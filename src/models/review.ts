import mongoose, { Schema, Document, Types } from 'mongoose';
import { User, UserModel } from './User';
import { Product, ProductModel } from './Product';

interface Review extends Document {
  user: Types.ObjectId | User;
  product: Types.ObjectId | Product;
  rating: number;
  reviewText: string;
}

const reviewSchema = new Schema<Review>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<Review>('Review', reviewSchema);

export { ReviewModel };
