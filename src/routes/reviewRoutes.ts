import express from 'express';
import ReviewController from '../controllers/reviewControllers';

const router = express.Router();

// Add review
router.post('/addReview', ReviewController.addReview);

// Update review
router.put('/updateReview', ReviewController.updateReview);

// Delete review
router.delete('/deleteReview/:reviewId', ReviewController.deleteReview);

// Get reviews for a product
router.get('/getReviewsForProduct/:productId', ReviewController.getReviewsForProduct);

export default router;
