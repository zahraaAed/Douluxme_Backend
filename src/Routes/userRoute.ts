// src/Routes/userRoute.ts
import express, { Request, Response } from 'express';
import { register, login, logout } from '../Controllers/userController.js';

// Create an Express router instance
const router = express.Router();

// Use proper types for each route handler
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
