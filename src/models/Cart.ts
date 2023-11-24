import mongoose, { Schema, Document, Types } from 'mongoose';
import { User, UserModel } from './User';
import { Product, ProductModel } from './Product';

interface Cart extends Document {
  user: Types.ObjectId | User;
  productList: 
  {
    product: Types.ObjectId | Product;
    quantity: number;
  }[];
  totalCost: number;
}

const cartSchema = new Schema<Cart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productList: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<Cart>('Cart', cartSchema);

export { CartModel };
