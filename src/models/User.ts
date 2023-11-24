// models/User.ts
import { Schema, Document, model } from 'mongoose';
import * as yup from 'yup';

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
    password: string;
    confirmPassword?: string;
    mobileNo:string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    token?: string;
  }

  const userSchema = new Schema<User>(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      confirmPassword:{type: String},
      mobileNo: { type: String, required: true, unique: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
      },
      token: { type: String },
    },
    { timestamps: true }
  );

const UserModel = model<User>('User', userSchema);

export { User, UserModel };