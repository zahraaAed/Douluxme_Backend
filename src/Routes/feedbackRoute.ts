import express from 'express';
import { createFeedback, getFeedbacksByUserId, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback, getFeedbackByProductId } from '../Controllers/feedbackController.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/create', authenticate, authorize(['customer']), createFeedback);
router.get('/get', getFeedbacks);
router.get('/user/:userId', getFeedbacksByUserId);
router.get('/get/:id', getFeedbackById);
router.patch('/update/:id', authenticate, authorize(['customer', 'admin']), updateFeedback);
router.delete('/delete/:id', authenticate, authorize(['customer', 'admin']), deleteFeedback);
router.get('/product/:productId', getFeedbackByProductId);

export default router;
