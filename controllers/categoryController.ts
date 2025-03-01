import expressAsyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel";
import { createCategorySchema, updateCategorySchema } from "../utils/validations";


// @desc    Get all categories
// @route   GET /api/categories
// @access  private
export const getCategories = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    const categories = await categoryModel.find({ userId }).sort({ createdAt: -1 }).populate('userId', '_id username email role');

    if (!categories.length) {
        res.status(404).json({ message: 'No categories found' });
        return;
    }

    res.json(categories);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  private
export const getCategory = expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.body.user.id;

    const validate = updateCategorySchema.safeParse({ categoryId, userId });

    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const category = await categoryModel.findOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] }).populate('userId', '_id username email role');
    if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
    }

    res.json(category);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    body.userId = body.user.id;

    const validate = createCategorySchema.safeParse(body);
    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const categoryExists = await categoryModel.findOne({ name: validate.data.name });
    if (categoryExists && categoryExists.userId.toString() === validate.data.userId) {
        res.status(400).json({ message: 'Category already exists' });
        return;
    }

    const category = await categoryModel.create(validate.data);

    res.json({ message: 'Create category' });
});

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
export const updateCategory = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    body.userId = body.user.id;
    body.categoryId = req.params.id;
    delete body.user;

    const validate = updateCategorySchema.safeParse(body);
    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const categoryExists = await categoryModel.findOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] });
    if (!categoryExists) {
        res.status(404).json({ message: 'Category not found' });
        return;
    }

    const category = await categoryModel.updateOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] }, { $set: validate.data });

    res.json({ message: 'Update category' });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.body.user.id;

    const validate = updateCategorySchema.safeParse({ categoryId, userId });
    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const categoryExists = await categoryModel.findOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] });
    if (!categoryExists) {
        res.status(404).json({ message: 'Category not found' });
        return;
    }

    await categoryModel.deleteOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] });

    res.json({ message: 'Delete category' });
});
