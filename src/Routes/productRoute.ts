import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory } from '../Controllers/productController.js';
import upload from '../Middleware/multer.js'; // Import multer for file upload
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware

const router = express.Router();

// Add image upload handling
router.post('/create', authenticate, authorize(['admin']), upload.single('image'), createProduct); // For image upload in POST
router.patch('/update/:id', authenticate, authorize(['admin']), upload.single('image'), updateProduct);
router.get('/get', getProducts);
router.get('/get/:id', getProductById);
router.delete('/delete/:id', authenticate, authorize(['admin']), deleteProduct);
router.get('/get/products/category/:categoryId', getProductsByCategory);
export default router;
