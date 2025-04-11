import { Router } from 'express';
import { loginUser, registerUser } from '../Controllers/userController';


const router = Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

export default router;
