import express from 'express';
import CartController from '../controllers/cartControllers';

const router = express.Router();

// Add product to the cart
router.post('/addToCart', CartController.addToCart);

// Update product quantity in the cart
router.put('/updateCartItem', CartController.updateCartItem);

// Remove product from the cart
router.delete('/removeCartItem/:userId/:productId', CartController.removeCartItem);

// Get cart details
router.get('/getCartDetails/:userId', CartController.getCartDetails);

export default router;
