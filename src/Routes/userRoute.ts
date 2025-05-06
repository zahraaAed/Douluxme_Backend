// src/Routes/userRoute.ts
import express, { Request, Response } from 'express';
import { register, login, logout, getAllUsers, deleteUser, updateUser,getMe } from '../Controllers/userController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; 
// Create an Express router instance
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/get',  authenticate, authorize(['admin']), getAllUsers);
router.get('/me', authenticate, getMe); // to get the logged-in user's details
router.delete('/delete/:id', authenticate, authorize(['admin']), deleteUser);
router.patch('/update/:id', authenticate, authorize(['admin']), updateUser);

export default router;
