import mongoose, { Schema, Document, Types } from 'mongoose';
import { User, UserModel } from './User';
import { OrderModel } from './order';
import { Order } from 'sequelize';

interface Shipping extends Document {
  user: Types.ObjectId | User;
  order: Types.ObjectId | Order;
  shippingAddress: string;
  shippingStatus: string;
}

const shippingSchema = new Schema<Shipping>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    shippingAddress: { type: String, required: true },
    shippingStatus: { type: String, required: true },
  },
  { timestamps: true }
);

const ShippingModel = mongoose.model<Shipping>('Shipping', shippingSchema);

export { ShippingModel };
