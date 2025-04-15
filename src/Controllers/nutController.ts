import { Request, Response } from 'express';
import Nut from '../Models/nutModel.js';

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
    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }
        return res.status(200).json(nut);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const updateNut = async (req: Request, res: Response): Promise<Response> => {        
    const { id } = req.params;
    const { variety, price} = req.body;
    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }
        nut.variety = variety;
        nut.price = price;
     
        await nut.save();
        return res.status(200).json({ message: 'Nut updated successfully', nut });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const deleteNut = async (req: Request, res: Response): Promise<Response> => {        
    const { id } = req.params;
    try {
        const nut = await Nut.findByPk(id);
        if (!nut) {
            return res.status(404).json({ message: 'Nut not found' });
        }
        await nut.destroy();
        return res.status(200).json({ message: 'Nut deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}