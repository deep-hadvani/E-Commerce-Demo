import express, { Router } from 'express';
import CategoryController from '../controllers/categoryControllers';

const router: Router = express.Router();

// Routes for Category CRUD 

// Get all categories
router.get('/view', CategoryController.getAllCategories);

// Get category by ID
router.get('/view/:id', CategoryController.getCategoryById);

// Add new category
router.post('/add', CategoryController.addCategory);

// Update category by ID
router.put('/update/:id', CategoryController.updateCategoryById);

// Delete category by ID
router.delete('/delete/:id', CategoryController.deleteCategoryById);

export default router;
