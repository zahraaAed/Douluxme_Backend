import express, { Request, Response } from 'express';
import { createNut, deleteNut, getNuts, updateNut } from '../Controllers/nutController';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware
const router = express.Router();

router.post('/create', authenticate, authorize(['admin']),createNut);
router.get('/get',getNuts)
router.get('/get/:id', getNuts);
router.put('/update/:id',authenticate, authorize(['admin']), updateNut);
router.delete('/delete/:id', authenticate, authorize(['admin']),deleteNut);
export default router;