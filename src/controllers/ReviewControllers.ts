import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ReviewModel } from '../models/review';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';

class ReviewController {
  // Add review
  public static async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { userId, productId, rating, reviewText } = req.body;

      const user = await UserModel.findById(userId);
      const product = await ProductModel.findById(productId);

      if (!user || !product) {
        res.status(404).json({ success: false, message: 'User or product not found' });
        return;
      }

      const review = new ReviewModel({
        user: userId,
        product: productId,
        rating,
        reviewText,
      });

      await review.save();

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

// Get reviews for a product
public static async getReviewsForProduct(req: Request, res: Response): Promise<void> {
  try {
    const productId = req.params.productId;

    const reviews = await ReviewModel.find({ product: productId })
      .populate({
        path: 'user',
        select: 'userId firstName lastName email mobileNo' // Specify the fields you want to include
      });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


  // Update review
  public static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId, rating, reviewText } = req.body;


      const review = await ReviewModel.findByIdAndUpdate(
        reviewId,
        { rating, reviewText },
        { new: true }
      );

      if (review) {
        res.status(200).json({ success: true, data: review });
      } else {
        res.status(404).json({ success: false, message: 'Review not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete review
  public static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewId = req.params.reviewId;

      const review = await ReviewModel.findByIdAndDelete(reviewId);

      if (review) {
        res.status(200).json({ success: true, data: review });
      } else {
        res.status(404).json({ success: false, message: 'Review not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default ReviewController;
