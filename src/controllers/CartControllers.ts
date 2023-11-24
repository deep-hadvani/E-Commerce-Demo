import { Request, Response } from 'express';
import { CartModel } from '../models/Cart';
import { ProductModel } from '../models/Product';

class CartController {
  // Add product to the cart
  public static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const { userId, productId, quantity } = req.body;

      const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        {
          $addToSet: { productList: { product: productId, quantity } },
        },
        { upsert: true, new: true }
      );

      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Update product quantity in the cart
  public static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { userId, productId, quantity } = req.body;

      const cart = await CartModel.findOneAndUpdate(
        { user: userId, 'productList.product': productId },
        {
          $set: { 'productList.$.quantity': quantity },
        },
        { new: true }
      );

      if (cart) {
        res.status(200).json({ success: true, data: cart });
      } else {
        res.status(404).json({ success: false, message: 'Product not found in the cart' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Remove product from the cart
  public static async removeCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { userId, productId } = req.params;

      const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        {
          $pull: { productList: { product: productId } },
        },
        { new: true }
      );

      if (cart) {
        res.status(200).json({ success: true, data: cart });
      } else {
        res.status(404).json({ success: false, message: 'Product not found in the cart' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Get cart details
  public static async getCartDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const cart = await CartModel.findOne({ user: userId }).populate('productList.product');

      if (cart) {
        res.status(200).json({ success: true, data: cart });
      } else {
        res.status(404).json({ success: false, message: 'Cart not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default CartController;
