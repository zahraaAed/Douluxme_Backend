import { Request, Response } from 'express';
import{Order, User} from "../Models/index.js";
import { OrderStatus, PaymentMethod } from '../Models/order.js';

interface OrderBody {
    userId: number;
    subtotalPrice: number;
    price: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
  }

export const createOrder = async (
    req: Request<{}, {}, OrderBody>,
    res: Response
): Promise<Response> => {
    try {
        const { userId, subtotalPrice, price, status, paymentMethod } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new order
        const newOrder = await Order.create({
            userId,
            subtotalPrice,
            price,
            status,
            paymentMethod
        });

        return res.status(201).json({ message: 'Order created successfully', orderId: newOrder.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrders = async (req: Request, res: Response): Promise<Response> => {    
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, as: 'user' }
            ],
        });
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}   

export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await Order.findByPk(id, {
            include: [User], // Include related models
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
export const updateOrder = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, subtotalPrice, price, status, paymentMethod } = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order details
        order.userId = userId;
        order.subtotalPrice = subtotalPrice;
        order.price = price;
        order.status = status;
        order.paymentMethod = paymentMethod;

        await order.save();

        return res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.destroy();
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrdersByUserId = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }   
    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                { model: User, as: 'user' }
            ],
        });
        if (!orders) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrdersByStatus = async (req: Request, res: Response): Promise<Response> => {
    const { status } = req.params;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const orders = await Order.findAll({
            where: { status },
            include: [
                { model: User, as: 'user' }
            ],
        });
        if (!orders) {
            return res.status(404).json({ message: 'No orders found with this status' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrdersByPaymentMethod = async (req: Request, res: Response): Promise<Response> => {
    const { paymentMethod } = req.params;

    if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required' });
    }

    try {
        const orders = await Order.findAll({
            where: { paymentMethod },
            include: [
                { model: User, as: 'user' }
            ],
        });
        if (!orders) {
            return res.status(404).json({ message: 'No orders found with this payment method' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
