import { Request, Response } from 'express';
import Nut from '../Models/nutModel.js';
import Product from '../Models/productModel.js'; // Import the Product model

interface NutBody { 
    id: number;
    variety: string;
    price: number;
  
}   

export const createNut = async (
    req: Request<{}, {}, NutBody>, // Explicitly define types for Request
    res: Response
): Promise<Response> => {
        try {   
            const { variety, price } = req.body;
            // Check if nut exists  
            const existingNut = await Nut.findOne({ where: { variety } });
            if (existingNut) {      
                return res.status(400).json({ message: 'Nut already exists' });
            }   
            // Create new nut
            const newNut = await Nut.create({
                variety,
                price
            }); 
            return res.status(201).json({ message: 'Nut created successfully', nutId: newNut.id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    };

export const getNuts = async (req: Request, res: Response): Promise<Response> => {          
    try {
        const nuts = await Nut.findAll();
        return res.status(200).json(nuts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getNutById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    console.log('Requested nut ID:', id);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid nut ID' });
    }

    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }
        return res.status(200).json(nut);
    } catch (error) {
        console.error('Error fetching nut:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


export const updateNut = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { variety, price } = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }

        // Optional: validate price and variety here
        nut.variety = variety ?? nut.variety;
        nut.price = price ?? nut.price;

        await nut.save();

        return res.status(200).json({ message: 'Nut updated successfully', nut });
    } catch (error) {
        console.error('Error updating nut:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const deleteNut = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid nut ID' });
    }

    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }

        // 🔍 Check for products that use this nut
        const relatedProducts = await Product.findAll({ where: { nutId: id } });

        if (relatedProducts.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete nut: It is used in existing products.',
            });
        }

        // ✅ Safe to delete
        await nut.destroy();

        return res.status(200).json({ message: 'Nut deleted successfully' });

    } catch (error) {
        console.error('Error deleting nut:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};