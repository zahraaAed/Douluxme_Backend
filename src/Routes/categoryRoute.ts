import express, { Request, Response } from 'express';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../Controllers/categoryController';
import upload from '../Middleware/multer.js';
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware

const router = express.Router();

router.post('/create', authenticate, authorize(['admin']), upload.single('image'), createCategory)
router.get('/get', getCategories);
router.get('/get/:id', getCategoryById);
router.put('/update/:id', authenticate, authorize(['admin']),  upload.single('image'),updateCategory);
router.delete('/delete/:id', authenticate, authorize(['admin']), deleteCategory);


export default router;