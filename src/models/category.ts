import mongoose, { Schema, Document, model, Types } from 'mongoose';
import { Product, ProductModel } from './Product';

interface Category extends Document {
    name: string;
    description?: string;
    products: Types.ObjectId[] | Product[];
    // Add other category fields
  }
  
  const categorySchema = new Schema<Category>({
    name: { type: String, required: true },
    description: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    // Add other category fields 
  },
  { timestamps: true }
  );
  
  const CategoryModel = mongoose.model<Category & Document>('Category', categorySchema);
  
  export { CategoryModel, ProductModel }; 