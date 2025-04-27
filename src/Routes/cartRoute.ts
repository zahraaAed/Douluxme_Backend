import express from 'express';
import { createCart, getCartsByUserId, updateCart, deleteCart, getCartsByProductId } from '../Controllers/cartController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware
const router = express.Router();


router.use(express.json());
router.get('/get', authenticate, authorize(['customer']), getCartsByUserId);
router.post('/create', authenticate, authorize(['customer']), createCart);
router.patch('/update/:id', authenticate, authorize(['customer']), updateCart);
router.delete('/delete/:id', authenticate, authorize(['customer']), deleteCart);
router.get('/get/:id', authenticate, authorize(['customer']), getCartsByProductId);


export default router;