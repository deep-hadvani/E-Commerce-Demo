import express from 'express';
import ProductController from '../controllers/ProductController';

const router = express.Router();
const productController = new ProductController();

// Define product routes

// add Product
router.post('/add', productController.addProduct);

// update ProductById
router.put('/update/:id', productController.updateProductById);

// delete ProductById
router.delete('/delete/:id', productController.deleteProductById);

// get All Products
router.get('/view', productController.getAllProducts);

// get Product By Id
router.get('/view/:id', productController.getProductById);

export default router;
