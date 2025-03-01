import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';

const categoryRoute = express.Router();

categoryRoute.route('/')
    .get(protect, getCategories)
    .post(protect, createCategory);

categoryRoute.route('/:id')
    .get(protect, getCategory)
    .patch(protect, updateCategory)
    .delete(protect, deleteCategory);

export default categoryRoute;
