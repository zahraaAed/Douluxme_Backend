import { Request, Response } from 'express';
import {OrderDetail, Product, Order} from "../Models/index.js"; // Adjust the import path as necessary

interface OrderDetailBody {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}
export const createOrderDetail = async (    
    req: Request<{}, {}, OrderDetailBody>, // Explicitly define types for Request
    res: Response
): Promise<Response> => {
    try {
        const { orderId, productId, quantity, price } = req.body;
        // Check if order exists
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Create new order detail
        const newOrderDetail = await OrderDetail.create({
            orderId,
            productId,
            quantity,
            price
        });
        return res.status(201).json({ message: 'Order detail created successfully', orderDetailId: newOrderDetail.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrderDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const orderDetails = await OrderDetail.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Order, as: 'order' }
            ],
        });
        return res.status(200).json(orderDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrderDetailById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order detail ID' });
    }

    try {
        const orderDetail = await OrderDetail.findByPk(id, {
            include: [
                { model: Product, as: 'product' },
                { model: Order, as: 'order' }
            ],
        });
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }
        return res.status(200).json(orderDetail);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const updateOrderDetail = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { orderId, productId, quantity, price } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order detail ID' });
    }

    try {
        const orderDetail = await OrderDetail.findByPk(id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }

        // Update order detail
        await orderDetail.update({
            orderId,
            productId,
            quantity,
            price
        });

        return res.status(200).json({ message: 'Order detail updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const deleteOrderDetail = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order detail ID' });
    }

    try {
        const orderDetail = await OrderDetail.findByPk(id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }
        await orderDetail.destroy();
        return res.status(200).json({ message: 'Order detail deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getOrderDetailsByOrderId = async (req: Request, res: Response): Promise<Response> => {
    const { orderId } = req.params;
  
    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
  
    try {
      const orderDetails = await OrderDetail.findAll({
        where: { orderId },
        include: [
          { model: Product, as: 'product' }
        ],
      });
      
      if (orderDetails.length === 0) {
        return res.status(404).json({ message: 'No order details found for this order' });
      }
  
      return res.status(200).json(orderDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  