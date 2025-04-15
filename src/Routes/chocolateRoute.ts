import express, { Request, Response } from 'express';
import { createChocolate, getChocolates } from '../Controllers/chocolateController';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/create', authenticate, authorize(['admin']),createChocolate);
router.get('/get', getChocolates)
router.get('/get/:id', getChocolates);
router.put('/update/:id',authenticate, authorize(['admin']), getChocolates);
router.delete('/delete/:id', authenticate, authorize(['admin']),getChocolates);


export default router;