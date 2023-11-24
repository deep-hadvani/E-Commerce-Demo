import express from 'express';
import PaymentController from '../controllers/PaymentControllers';

const router = express.Router();

// Add payment
router.post('/addPayment', PaymentController.addPayment);

// Get payments for a user
router.get('/getPaymentsForUser/:userId', PaymentController.getPaymentsForUser);

// Update payment
router.put('/updatePayment', PaymentController.updatePayment);

// Delete payment
router.delete('/deletePayment/:paymentId', PaymentController.deletePayment);

export default router;
