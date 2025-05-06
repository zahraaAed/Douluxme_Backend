import { Request,Response } from "express";

import { Cart, Product, User } from "../Models/index.js"; // Adjust the import path as necessary

interface CartBody {
    userId: number;
    productId: number;
    quantity: number;
}   

export const createCart = async (
    req: Request<{}, {}, CartBody>, // Explicitly define types for Request
    res: Response
): Promise<Response> => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create new cart item
        const newCartItem = await Cart.create({
            userId,
            productId,
            quantity
        });

        return res.status(201).json({ message: 'Cart item created successfully', cartItemId: newCartItem.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getCarts = async (req: Request, res: Response): Promise<Response> => { 
    try {
        const carts = await Cart.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: User, as: 'user' }
            ],
        });
        return res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

export const getCartById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }

    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        return res.status(200).json(cartItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}   

export const updateCart = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, productId, quantity } = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Update cart item
        await cartItem.update({
            userId,
            productId,
            quantity
        });

        return res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const deleteCart = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }

    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();
        return res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}   
export const getCartsByUserId = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const carts = await Cart.findAll({
            where: { userId },
            include: [
                { model: Product, as: 'product' },
                { model: User, as: 'user' }
            ],
        });
        return res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const getCartsByProductId = async (req: Request, res: Response): Promise<Response> => {
    const { id: productId } = req.params; // destructure id from params instead of productId
    console.log('productId:', productId);
    

    if (!productId || isNaN(Number(productId))) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const carts = await Cart.findAll({
            where: { productId },
            include: [
                { model: Product, as: 'product' },
                { model: User, as: 'user' }
            ],
        });
        return res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
