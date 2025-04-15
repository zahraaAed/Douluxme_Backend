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
  req: Request<{}, {}, LoginBody>, // Explicit types for request body
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET ?? '',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: 'Logged in successfully', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Logout function
export const logout = (req: Request, res: Response): Response => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};
