import { Request, Response } from 'express';
import User from '../Models/userModel.js'; // Correct import of the User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  role?: 'customer' | 'admin';
  address: {
    phone: string;
    region: string;
    address_direction: string;
    building: string;
    floor: string;
  };
}

interface LoginBody {
  email: string;
  password: string;
}


export const register = async (
  req: Request<{}, {}, RegisterBody>, // Explicitly define types for Request
  res: Response
): Promise<Response> => {
  try {
    const { email, password, name, role, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      address,
      role: role ?? 'customer', // default role
    });

    return res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Login function
export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`User found: ${user.id}`);

    const match = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${match}`);
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET ?? '',
      { expiresIn: '1d' }
    );
    
    // Fixed cookie configuration
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: 'none', // Fixed syntax
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/', // Ensure cookie is available on all paths
    });
    
    console.log(`Token generated for user: ${user.id}`);    

    // Also return the token in the response body for clients that can't use cookies
    return res.json({ 
      message: 'Logged in successfully', 
      user: { id: user.id, role: user.role },
      token // Include token in response for alternative auth method
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
//update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { email, password, name, role, address } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.email = email;
    user.name = name;
    user.role = role;
    user.address = address;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
//get all users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}


//get me

export const getMe = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'name', 'email', 'role', 'address'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Get Me Error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
// Logout function
export const logout = (req: Request, res: Response): Response => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};

//delete user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}