import { Request, Response } from 'express';
import { Product, ProductModel } from '../models/Product';

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addProduct(req: Request, res: Response) {
    try {
      const { name, price, description, category, inventoryCount, images, variants, ratings, reviews } = req.body;
      const newProduct: Product = new ProductModel({
        name,
        price,
        description,
        category,
        inventoryCount,
        images,
        variants,
        ratings,
        reviews,
      });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const { name, price, description, category, inventoryCount, images, variants, ratings, reviews } = req.body;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        {
          name,
          price,
          description,
          category,
          inventoryCount,
          images,
          variants,
          ratings,
          reviews,
        },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default ProductController;
