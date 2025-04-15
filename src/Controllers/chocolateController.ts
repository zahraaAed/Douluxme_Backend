import { Request, Response } from 'express';
import Chocolate from '../Models/chocolateModel.js';

interface ChocolateBody { 
    id: number;
    type: string;
    price: number;
 
}   

export const createChocolate = async (
    req: Request<{}, {}, ChocolateBody>, // Explicitly define types for Request
    res: Response
): Promise<Response> => {
    try {   
        const { type, price} = req.body;
        
        // Check if chocolate exists  
        const existingChocolate = await Chocolate.findOne({ where: { type } });
        if (existingChocolate) {      
            return res.status(400).json({ message: 'Chocolate already exists' });
        }

        // Create new chocolate
        const newChocolate = await Chocolate.create({
            type,
            price
         
        }); 
        return res.status(201).json({ message: 'Chocolate created successfully', ChocolateId: newChocolate.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const getChocolates = async (req: Request, res: Response): Promise<Response> => {          
    try {
        const chocolates = await Chocolate.findAll();
        return res.status(200).json(chocolates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const getChocolateById = async (req: Request, res: Response): Promise<Response> => {       
    const { id } = req.params;
    try {
        const chocolate = await Chocolate.findByPk(id);
        if (!chocolate) {
            return res.status(404).json({ message: 'Chocolate not found' });
        }
        return res.status(200).json(chocolate);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const updateChocolate = async (req: Request, res: Response): Promise<Response> => {        
    const { id } = req.params;
    const { type, price } = req.body;
    try {
        const chocolate = await Chocolate.findByPk(id);
        if (!chocolate) {
            return res.status(404).json({ message: 'Chocolate not found' });
        }

        // Update chocolate attributes
        chocolate.type = type;
        chocolate.price = price;
       

        await chocolate.save();
        return res.status(200).json({ message: 'Chocolate updated successfully', chocolate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const deleteChocolate = async (req: Request, res: Response): Promise<Response> => {        
    const { id } = req.params;
    try {
        const chocolate = await Chocolate.findByPk(id);
        if (!chocolate) {
            return res.status(404).json({ message: 'Chocolate not found' });
        }
        
        // Delete chocolate
        await chocolate.destroy();
        return res.status(200).json({ message: 'Chocolate deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
