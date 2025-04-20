import express, { Request, Response } from 'express';
import { createNut, deleteNut, getNutById, getNuts, updateNut } from '../Controllers/nutController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware
const router = express.Router();

router.post('/create', authenticate, authorize(['admin']),createNut);
router.get('/get',getNuts)
router.get('/get/:id', getNutById);
router.patch('/update/:id',authenticate, authorize(['admin']), updateNut);
router.delete('/delete/:id', authenticate, authorize(['admin']),deleteNut);
export default router;