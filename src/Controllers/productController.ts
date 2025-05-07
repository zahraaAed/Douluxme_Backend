import { Request, Response } from 'express';
import { Product, Category, Nut, Chocolate, User } from '../Models/index.js';
import supabase from '../Config/supabaseClient.js';

// Define the type for the product body
interface ProductBody {
  name: string;
  nutIds: number[]; // Changed to an array for multiple nut IDs
  userId: number; // Admin who created or updated the product
  chocolateIds: number[]; // Changed to an array for multiple chocolate IDs
  categoryId: number; // Category can be used to classify products (e.g. gift, box, bar)
  price: number;
  image: string;
  boxSize?: 6 | 12 | 24; // Optional box size for products
}

export const createProduct = async (
  req: Request<{}, {}, any>,
  res: Response
): Promise<Response> => {
  const { name, nutId, chocolateId, extraNutIds, extraChocolateIds, categoryId, price, boxSize } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Admin access required.' });
    }

    // Validate that nutId and chocolateId are provided as single values
    if (!nutId || !chocolateId) {
      return res.status(400).json({ message: 'nutId and chocolateId are required.' });
    }

    // Validate extraNutIds and extraChocolateIds (if provided, they should be arrays)
    let extraNutIdsArray: number[] = [];
    let extraChocolateIdsArray: number[] = [];

    if (extraNutIds) {
      try {
        extraNutIdsArray = JSON.parse(extraNutIds);  // Parse the extraNutIds JSON string into an array
      } catch (error) {
        return res.status(400).json({ message: 'Invalid extraNutIds format' });
      }
    }

    if (extraChocolateIds) {
      try {
        extraChocolateIdsArray = JSON.parse(extraChocolateIds);  // Parse the extraChocolateIds JSON string into an array
      } catch (error) {
        return res.status(400).json({ message: 'Invalid extraChocolateIds format' });
      }
    }

    // Validate nutId and chocolateId (should be valid ids)
    const nut = await Nut.findByPk(nutId);
    const chocolate = await Chocolate.findByPk(chocolateId);
    const category = await Category.findByPk(categoryId);

    if (!nut) {
      return res.status(404).json({ message: 'Nut not found.' });
    }

    if (!chocolate) {
      return res.status(404).json({ message: 'Chocolate not found.' });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Validate that extraNutIds and extraChocolateIds (if provided) are valid
    if (extraNutIdsArray.length > 0) {
      const extraNuts = await Nut.findAll({ where: { id: extraNutIdsArray } });
      if (extraNuts.length !== extraNutIdsArray.length) {
        return res.status(404).json({ message: 'One or more selected extra nuts not found.' });
      }
    }

    if (extraChocolateIdsArray.length > 0) {
      const extraChocolates = await Chocolate.findAll({ where: { id: extraChocolateIdsArray } });
      if (extraChocolates.length !== extraChocolateIdsArray.length) {
        return res.status(404).json({ message: 'One or more selected extra chocolates not found.' });
      }
    }

    // Handle price and box size
    let finalPrice = price;
    if (boxSize) {
      if (![6, 12, 24].includes(boxSize)) {
        return res.status(400).json({ message: 'Invalid box size. Allowed sizes are 6, 12, and 24.' });
      }
      finalPrice = price * boxSize;
    }

    // Create product with the selected nutId and chocolateId, along with optional extraNutIds and extraChocolateIds
    const newProduct = await Product.create({
      name,
      nutId, // Store the single nutId
      chocolateId, // Store the single chocolateId
      categoryId,
      price: finalPrice,
      image,
      userId: parseInt(req.user.userId),
      extraNutIds: extraNutIdsArray,  // Store the extra nuts if any
      extraChocolateIds: extraChocolateIdsArray,  // Store the extra chocolates if any
    });

    return res.status(201).json({
      message: 'Product created successfully',
      productId: newProduct.id,
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


  //get all products
  export const getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Nut, as: 'nut' },
                { model: Chocolate, as: 'chocolate' },
                { model: Category, as: 'category' },
            ],
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
        include: [
            { model: Nut, as: 'nut' },
            { model: Chocolate, as: 'chocolate' },
            { model: Category, as: 'category' },
        ],
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
  
      if (name !== undefined) product.name = name;
      if (nutId !== undefined) product.nutId = nutId;
      if (chocolateId !== undefined) product.chocolateId = chocolateId;
      if (categoryId !== undefined) product.categoryId = categoryId;
      if (price !== undefined) {
        if (boxSize) {
          if (![6, 12, 24].includes(boxSize)) {
            return res.status(400).json({ message: 'Invalid box size. Allowed sizes are 6, 12, and 24.' });
          }
          product.price = price * boxSize;
        } else {
          product.price = price;
        }
      }
      if (image) {
        product.image = image;
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
// Get Products by Category
// Get Products by Category
export const getProductsByCategory = async (req: Request, res: Response): Promise<Response> => {
  const { categoryId } = req.params; // Extract categoryId from URL params
  try {
      const products = await Product.findAll({
          where: { categoryId },
          include: [
              { model: Nut, as: 'nut' },
              { model: Chocolate, as: 'chocolate' },
          ],
      });
      return res.status(200).json(products); // Return the products in JSON format
  } catch (error) {
      console.error(error); // Log any errors for debugging
      return res.status(500).json({ error: 'Server error' }); // Handle any server errors
  }
}
