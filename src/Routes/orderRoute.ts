import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder, getOrdersByUserId, getOrdersByStatus } from '../Controllers/orderController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware

const router = express.Router();
// Route to create a new order
router.post('/create', authenticate, authorize(['customer']), createOrder);
// Route to get all orders
router.get('/get', authenticate, authorize(['admin']), getOrders);
// Route to get a specific order by ID
router.get('/get/:id', authenticate, authorize(['admin']), getOrderById);
// Route to update an order by ID
router.patch('/update/:id', authenticate, authorize(['admin']), updateOrder);
// Route to delete an order by ID
router.delete('/delete/:id', authenticate, authorize(['admin']), deleteOrder);

// Route to get orders by user ID
router.get('/user/:userId', authenticate, authorize(['customer']), getOrdersByUserId);
// Route to get orders by status
router.get('/status/:status', authenticate, authorize(['admin']), getOrdersByStatus);
// Route to get orders by payment method
export default router;