import express, { Router } from 'express';
import OrderController from '../controllers/oderControllers';

const router: Router = express.Router();

// Routes for Order CRUD 

// Get all orders
router.get('/view', OrderController.getAllOrders);

// Get order by ID
router.get('/view/:id', OrderController.getOrderById);

// Add new order
router.post('/add', OrderController.addOrder);

// Update order by ID
router.put('/update/:id', OrderController.updateOrderById);

// Delete order by ID
router.delete('/delete/:id', OrderController.deleteOrderById);

export default router;
