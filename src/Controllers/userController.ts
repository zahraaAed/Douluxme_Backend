import { Request, Response, NextFunction } from 'express';
import supabase from '../Config/supabaseClient';
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role, address } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Sign up user in Supabase Auth
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    const user = signUpData?.user;

    if (authError || !user) {
      throw new Error(authError?.message || 'User creation failed');
    }

    // Insert user info into the 'users' table
    const { error: dbError } = await supabase.from('users').insert([{
      id: user.id,
      name,
      email,
      role,
      address,
    }]);

    if (dbError) {
      throw new Error(dbError.message || 'Error inserting user into database');
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    // Log in user with Supabase Auth
    const { data: loginData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const user = loginData?.user;
    const session = loginData?.session;

    if (authError || !user || !session) {
      throw new Error(authError?.message || 'Login failed');
    }

    // Fetch additional user info from the "users" table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      throw new Error(userError.message || 'Error fetching user data');
    }

    // Set token in cookie
    res.cookie('token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      message: 'Login successful',
      user: userData,
    });
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
};
