import { Request, Response } from 'express';
import Category from '../Models/categoryModel.js';

interface CategoryBody {
    id: number;
    name: string;
}

export const createCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { name } = req.body;
      const imageFile = req.file;
  
      if (!imageFile) {
        return res.status(400).json({ message: 'Image is required' });
      }
  
      // Check if category already exists
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      // Create new category
      const newCategory = await Category.create({
        name,
        image: imageFile.filename, // or imageFile.path if you want full path
      });
  
      return res.status(201).json({
        message: 'Category created successfully',
        CategoryId: newCategory.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name } = req.body;
    const imageFile = req.file;
  
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Update fields
      category.name = name || category.name;
      if (imageFile) {
        category.image = imageFile.filename;
      }
  
      await category.save();
  
      return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete category
        await category.destroy();
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
