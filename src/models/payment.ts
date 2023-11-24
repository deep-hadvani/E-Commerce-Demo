import mongoose, { Schema, Document, Types } from 'mongoose';
import { User, UserModel } from './User';
import { OrderModel } from './order';
import { Order } from 'sequelize';

interface Payment extends Document {
  user: Types.ObjectId | User;
  order: Types.ObjectId | Order;
  paymentAmount: number;
  paymentStatus: string;
}

const paymentSchema = new Schema<Payment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<Payment>('Payment', paymentSchema);

export { PaymentModel };
