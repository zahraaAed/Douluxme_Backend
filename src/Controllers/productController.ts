import { Request, Response } from 'express';
import Product from '../Models/productModel.js';
import Category from '../Models/categoryModel.js';
import Nut from '../Models/nutModel.js';
import Chocolate from '../Models/chocolateModel.js';
import User from '../Models/userModel.js';

// Define the type for the product body
interface ProductBody {
    name: string;
    nutId: number;
    userId: number; // Admin who created or updated the product
    chocolateId: number;
    categoryId: number; // Category can be used to classify products (e.g. gift, box, bar)
    price: number;
    image: string;
    boxSize?: 6 | 12 | 24; // Optional box size for products
}

// Create Product
// Create Product
export const createProduct = async (
    req: Request<{}, {}, ProductBody>,
    res: Response
  ): Promise<Response> => {
    const { name, nutId, chocolateId, categoryId, price, boxSize } = req.body;
    const image = req.file ? req.file.filename : ''; // Default to empty string if no file
  
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const user = await User.findByPk(req.user.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied. Admin access required.' });
      }
  
      const nut = await Nut.findByPk(nutId);
      const chocolate = await Chocolate.findByPk(chocolateId);
      const category = await Category.findByPk(categoryId);
  
      if (!nut || !chocolate || !category) {
        return res.status(404).json({ message: 'Nut, Chocolate, or Category not found' });
      }
  
      let finalPrice = price;
      if (boxSize) {
        if (![6, 12, 24].includes(boxSize)) {
          return res.status(400).json({ message: 'Invalid box size. Allowed sizes are 6, 12, and 24.' });
        }
        finalPrice = price * boxSize; // Adjust price based on box size
      }
  
      const newProduct = await Product.create({
        name,
        nutId,
        chocolateId,
        categoryId,
        price: finalPrice,
        image, // Store the image path in the database (it could be empty string if no file)
        userId: parseInt(req.user.userId), // Use the logged-in user's ID
      });
  
      return res.status(201).json({ message: 'Product created successfully', productId: newProduct.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
// Get All Products
export const getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const products = await Product.findAll({
            include: [Nut, Chocolate, Category], // Include related models
        });
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [Nut, Chocolate, Category], // Include related models
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Update Product
export const updateProduct = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { name, nutId, chocolateId, categoryId, price, boxSize } = req.body;
    const image = req.file ? req.file.filename : null; // Grab the image filename
  
    try {
      const user = await User.findByPk(req.user?.userId); // Access logged-in user from req.user
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied. Admin access required.' });
      }
  
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      let finalPrice = price;
      if (boxSize) {
        if (![6, 12, 24].includes(boxSize)) {
          return res.status(400).json({ message: 'Invalid box size. Allowed sizes are 6, 12, and 24.' });
        }
        finalPrice = price * boxSize;
      }
  
      product.name = name;
      product.nutId = nutId;
      product.chocolateId = chocolateId;
      product.categoryId = categoryId;
      product.price = finalPrice;
      if (image) {
        product.image = image; // Update the image if a new file is uploaded
      }
  
      await product.save();
      return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
// Delete Product
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        // Ensure the user is an admin
        const user = await User.findByPk(req.user?.userId); // Access logged-in user from req.user
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied. Admin access required.' });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the product
        await product.destroy();
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
