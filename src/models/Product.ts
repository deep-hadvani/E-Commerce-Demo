import { Schema, Document, model } from 'mongoose';

// Define the interface for the Product document
interface Product extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  inventoryCount: number;
  images: string[];
  variants: {
    size?: string;
    color?: string;
  };
  ratings: number[];
  reviews: string[];
}
 
// Create the Mongoose schema for the Product
const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inventoryCount: { type: Number, required: true },
  images: { type: [String], required: true },
  variants: {
    size: { type: String },
    color: { type: String },
  },
  ratings: { type: [Number], default: [] },
  reviews: { type: [String], default: [] },
});
 
// Create the Product model
const ProductModel = model<Product>('Product', productSchema);

export { Product, ProductModel };