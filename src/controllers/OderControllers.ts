import { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { User, UserModel } from '../models/User';
import { ProductModel } from '../models/Product';


class OrderController {

  // Get all orders

public static async getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const orders = await OrderModel.find()
      .populate({
        path: 'user',
        select: 'userId firstName lastName email mobileNo' // Specify the fields you want to include
      })
      .populate('productList');

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

  // Get order by ID
  public static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const order = await OrderModel.findById(orderId)
        .populate('user')
        .populate('productList');

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      const { _id, user, productList, totalCost, shippingInformation, orderStatus } = order;
    const { _id: userId,firstName, lastName, email ,mobileNo } = user as User;

    res.status(200).json({
      success: true,
      data: {
        _id,
        user: {
          _id: userId,
          firstName,
          lastName,
          email,
          mobileNo
        },
        productList,
        totalCost,
        shippingInformation,
        orderStatus,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

  // Add new order
  public static async addOrder(req: Request, res: Response): Promise<void> {
    try {
      const { user, productList, totalCost, shippingInformation, orderStatus }= req.body;

      const newOrder = new OrderModel({
        user,
        productList,
        totalCost,
        shippingInformation,
        orderStatus,
      });

      const savedOrder = await newOrder.save();

      res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Update order by ID
  public static async updateOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const { user, productList, totalCost, shippingInformation, orderStatus } = req.body;

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { user, productList, totalCost, shippingInformation, orderStatus },
        { new: true } // Return the modified document
      )
        .populate('user')
        .populate('productList');

      if (!updatedOrder) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete order by ID
  public static async deleteOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const deletedOrder = await OrderModel.findByIdAndDelete(orderId)
        .populate('user')
        .populate('productList');

      if (!deletedOrder) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      res.status(200).json({ success: true, data: deletedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default OrderController;
