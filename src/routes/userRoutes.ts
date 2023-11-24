// routes/authRoutes.ts
import express from 'express';
import AuthController from '../controllers/UserControllers';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();
const authController = new AuthController();

// Registration route
router.post('/register', AuthController.register);

// Login route
router.post('/login', authController.login);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

// // Reset password route
router.get('/reset-password/:token', AuthController.resetPassword);

// // Logout route
router.get('/logout',verifyToken, AuthController.logout);

// Get user profile by token route
router.get('/profile', verifyToken, AuthController.getProfileByToken);

// // Get all users route
router.get('/all-users', AuthController.getAllUsers);

// // Get user by ID route
router.get('/:id', authController.getUserById);

// Crud
// User Update route
router.put('/update/:id', AuthController.userUpdate);

// User Delete route
router.delete('/delete/:id', AuthController.userDelete);

export default router;
