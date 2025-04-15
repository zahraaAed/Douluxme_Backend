import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../Controllers/productController';
import upload from '../Middleware/multer.js'; // Import multer for file upload
import { authenticate, authorize } from '../Middleware/authMiddleware.js'; // Import authentication and authorization middleware

const router = express.Router();

// Add image upload handling
router.post('/create', authenticate, authorize(['admin']), upload.single('image'), createProduct); // For image upload in POST
router.put('/update/:id', authenticate, authorize(['admin']), upload.single('image'), updateProduct); // For image upload in PUT
router.get('/get', getProducts);
router.get('/get/:id', getProductById);
router.delete('/delete/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;
