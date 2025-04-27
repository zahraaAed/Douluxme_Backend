import { Request, Response } from 'express';
import Feedback from '../Models/feedbackModel.js';
import Product from '../Models/productModel.js'; // Import the Product model
import User from '../Models/userModel.js'; // Import the User model

interface FeedbackBody { 
    id: number
    comment: string;
    ProductId: number;
    UserId: number;
}

export const createFeedback = async (
    req: Request<{}, {}, FeedbackBody>, // Explicitly define types for Request
    res: Response
  ): Promise<Response> => {
    try {
      const { comment, ProductId, UserId } = req.body;
  
      // Check if feedback already exists for the same user and product
      const existingFeedback = await Feedback.findOne({
        where: {
          ProductId,
          UserId
        }
      });
  
      if (existingFeedback) {
        return res.status(400).json({ message: 'User has already submitted feedback for this product' });
      }
  
      // Create new feedback
      const newFeedback = await Feedback.create({
        comment,
        ProductId,
        UserId
      });
  
      return res.status(201).json({ message: 'Feedback created successfully', FeedbackId: newFeedback.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
export const getFeedbacksByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const feedbacks = await Feedback.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'] // Adjust attributes as needed
                }
            ]
        });
        if (!feedbacks) {
            return res.status(404).json({ message: 'No feedback found for this user' });
        }
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}  
export const getFeedbacks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'] // Adjust attributes as needed
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'] // Adjust attributes as needed
                }
            ]
        });
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getFeedbackById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    console.log('Requested feedback ID:', id);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    try {
        const feedback = await Feedback.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'] // Adjust attributes as needed
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'] // Adjust attributes as needed
                }
            ]
        });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        return res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const updateFeedback = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { comment, ProductId, UserId } = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Optional: validate comment, ProductId, and UserId here
        feedback.comment = comment ?? feedback.comment;
        feedback.ProductId = ProductId ?? feedback.ProductId;
        feedback.UserId = UserId ?? feedback.UserId;

        await feedback.save();

        return res.status(200).json({ message: 'Feedback updated successfully', feedback });
    } catch (error) {
        console.error('Error updating feedback:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const deleteFeedback = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        await feedback.destroy();
        return res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
export const getFeedbackByProductId = async (req: Request, res: Response): Promise<Response> => {
    const { productId } = req.params;

    if (!productId || isNaN(Number(productId))) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const feedbacks = await Feedback.findAll({
            where: { ProductId: productId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'] // Adjust attributes as needed
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'] // Adjust attributes as needed
                }
            ]
        });
        if (!feedbacks) {
            return res.status(404).json({ message: 'No feedback found for this product' });
        }
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}