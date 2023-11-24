import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { PaymentModel } from '../models/payment';
import { UserModel } from '../models/User';
import { OrderModel } from '../models/order';

class PaymentController {   
  // Add payment
  public static async addPayment(req: Request, res: Response): Promise<void> {
    try {
      const { userId, orderId, paymentAmount, paymentStatus } = req.body;

      const user = await UserModel.findById(userId);
      const order = await OrderModel.findById(orderId);

      if (!user || !order) {
        res.status(404).json({ success: false, message: 'User or order not found' });
        return;
      }

      const payment = new PaymentModel({
        user: userId,
        order: orderId,
        paymentAmount,
        paymentStatus,
      });
      
      await payment.save();

      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

// Get payments for a user
public static async getPaymentsForUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
  
      const payments = await PaymentModel.find({ user: userId })
        .populate({
          path: 'order',
          select: 'orderId totalAmount paymentStatus' // Specify the fields you want to include
        });
  
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Update payment
  public static async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId, paymentAmount, paymentStatus } = req.body;

      const payment = await PaymentModel.findByIdAndUpdate(
        paymentId,
        { paymentAmount, paymentStatus },
        { new: true }
      );

      if (payment) {
        res.status(200).json({ success: true, data: payment });
      } else {
        res.status(404).json({ success: false, message: 'Payment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete payment
  public static async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentId = req.params.paymentId;

      const payment = await PaymentModel.findByIdAndDelete(paymentId);

      if (payment) {
        res.status(200).json({ success: true, data: payment });
      } else {
        res.status(404).json({ success: false, message: 'Payment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default PaymentController;
