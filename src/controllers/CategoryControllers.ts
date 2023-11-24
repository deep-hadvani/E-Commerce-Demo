import { Request, Response } from 'express';
import { CategoryModel } from '../models/category';

class CategoryController {
  // Get all categories
  public static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.find().populate('products');
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Get category by ID
  public static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      const category = await CategoryModel.findById(categoryId).populate('products');

      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Add new category
  public static async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, products } = req.body;

      const newCategory = new CategoryModel({ name, description, products });
      const savedCategory = await newCategory.save();

      res.status(201).json({ success: true, data: savedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Update category by ID
  public static async updateCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      const { name, description, products } = req.body;

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { name, description, products },
        { new: true } 
      );

      if (!updatedCategory) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }

      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete category by ID
  public static async deleteCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

      if (!deletedCategory) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }

      res.status(200).json({ success: true, data: deletedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default CategoryController;
