import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ShippingModel } from '../models/Shipping';
import { User, UserModel } from '../models/User';
import { OrderModel } from '../models/order';

class ShippingController {
  // Add shipping
  public static async addShipping(req: Request, res: Response): Promise<void> {
    try {
      const { userId, orderId, shippingAddress, shippingStatus } = req.body;

      const user = await UserModel.findById(userId);
      const order = await OrderModel.findById(orderId);

      if (!user || !order) {
        res.status(404).json({ success: false, message: 'User or order not found' });
        return;
      }

      const shipping = new ShippingModel({
        user: userId,
        order: orderId,
        shippingAddress,
        shippingStatus,
      });

      await shipping.save();

      res.status(201).json({ success: true, data: shipping });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Get shipping for an order
  public static async getShippingForOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;

      const shipping = await ShippingModel.findOne({ order: orderId }).populate('user');

      if (shipping) {
        const { _id, shippingAddress, shippingStatus, user } = shipping;
        const { _id: userId, firstName, lastName, email ,mobileNo} = user as User;
  
        res.status(200).json({
          success: true,
          data: {
            _id,
            shippingAddress,
            shippingStatus,
            user: {
              _id: userId,
              firstName,
              lastName,
              email,
              mobileNo
            },
          },
        });
      } else {
        res.status(404).json({ success: false, message: 'Shipping not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Update shipping
  public static async updateShipping(req: Request, res: Response): Promise<void> {
    try {
      const { shippingId, shippingAddress, shippingStatus } = req.body;

      const shipping = await ShippingModel.findByIdAndUpdate(
        shippingId,
        { shippingAddress, shippingStatus },
        { new: true }
      );

      if (shipping) {
        res.status(200).json({ success: true, data: shipping });
      } else {
        res.status(404).json({ success: false, message: 'Shipping not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete shipping
  public static async deleteShipping(req: Request, res: Response): Promise<void> {
    try {
      const shippingId = req.params.shippingId;

      const shipping = await ShippingModel.findByIdAndDelete(shippingId);

      if (shipping) {
        res.status(200).json({ success: true, data: shipping });
      } else {
        res.status(404).json({ success: false, message: 'Shipping not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default ShippingController;
