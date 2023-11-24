import mongoose, { Schema, Document, model, Types } from 'mongoose';
import { User, UserModel } from './User';
import { Product, ProductModel } from './Product';

interface Order extends Document {
  user: Types.ObjectId | User;
  productList: Types.ObjectId[] | Product[];
  totalCost: number;
  shippingInformation: {
    address: string;
    city: string;
    // Add other shipping fields as needed
  };
  orderStatus: string;
}

const orderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productList: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    totalCost: { type: Number, required: true },
    shippingInformation: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      // Add other shipping fields as needed
    },
    orderStatus: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export { OrderModel };
