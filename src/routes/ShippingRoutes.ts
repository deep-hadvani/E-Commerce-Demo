import express from 'express';
import ShippingController from '../controllers//ShippingControllers';

const router = express.Router();

// Add shipping
router.post('/addShipping', ShippingController.addShipping);

// Update shipping
router.put('/updateShipping', ShippingController.updateShipping);

// Delete shipping
router.delete('/deleteShipping/:shippingId', ShippingController.deleteShipping);

// Get shipping for order
router.get('/getShippingForOrder/:orderId', ShippingController.getShippingForOrder);

export default router;
