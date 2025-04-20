import express, { Request, Response } from 'express';
import { createChocolate, deleteChocolate, getChocolateById, getChocolates, updateChocolate } from '../Controllers/chocolateController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/create', authenticate, authorize(['admin']),createChocolate);
router.get('/get', getChocolates)
router.get('/get/:id', getChocolateById);
router.patch('/update/:id',authenticate, authorize(['admin']), updateChocolate);
router.delete('/delete/:id', authenticate, authorize(['admin']),deleteChocolate);


export default router;