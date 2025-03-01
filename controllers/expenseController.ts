import expressAsyncHandler from "express-async-handler";
import expenseModel from "../models/expenseModel";
import categoryModel from "../models/categoryModel";
import { createExpenseSchema, updateExpenseSchema } from "../utils/validations";

// @docs: Get all expenses
// @route: GET /api/expenses
// @access: Private
export const getExpenses = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 }).populate('categoryId', '_id type name colorCode description').populate('userId', '_id username email role');

    if (!expenses.length) {
        res.status(404).json({ message: "No expenses found" });
        return;
    }

    res.json(expenses);
});

// @docs: Get a single expense
// @route: GET /api/expenses/:id
// @access: Private
export const getExpense = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    const expenseId = req.params.id;

    const validate = updateExpenseSchema.safeParse({ userId, expenseId });
    if (!validate.success) {
        const message = validate.error.errors[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.errors[0].path} is required` : message });
        return;
    }
    const expense = await expenseModel.findOne({ $and: [{ _id: validate.data.expenseId }, { userId: validate.data.userId }] }).populate('categoryId', '_id type name colorCode description').populate('userId', '_id username email role');
    if (!expense) {
        res.status(404).json({ message: "Expense not found" });
        return;
    }

    res.json(expense);
});

// @docs: Create an expense
// @route: POST /api/expenses
// @access: Private
export const createExpense = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    body.userId = req.body.user.id;
    delete body.user;

    const validate = createExpenseSchema.safeParse(body);
    if (!validate.success) {
        const message = validate.error.errors[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.errors[0].path} is required` : message });
        return;
    }

    const categoryExists = await categoryModel.findOne({ $and: [{ _id: validate.data.categoryId }, { userId: validate.data.userId }] });
    if (!categoryExists) {
        res.status(404).json({ message: "Category not found" });
        return;
    }

    const expenseExists = await expenseModel.findOne({ $and: [{ categoryId: validate.data.categoryId }, { userId: validate.data.userId }] });
    if (expenseExists) {
        res.status(400).json({ message: "Expense already exists" });
        return;
    }

    const expense = new expenseModel(validate.data);
    await expense.save();



    res.json({ message: "Create an expense" });
});

// @docs: Update an expense
// @route: PATCH /api/expenses/:id
// @access: Private
export const updateExpense = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    body.userId = req.body.user.id;
    body.expenseId = req.params.id;
    delete body.user;

    const validate = updateExpenseSchema.safeParse(body);
    if (!validate.success) {
        const message = validate.error.errors[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.errors[0].path} is required` : message });
        return;
    }

    const expenseExists = await expenseModel.findOne({ $and: [{ _id: validate.data.expenseId }, { userId: validate.data.userId }] });
    if (!expenseExists) {
        res.status(404).json({ message: "Expense not found" });
        return;
    }

    await expenseModel.updateOne({ _id: validate.data.expenseId, userId: validate.data.userId }, { $set: validate.data });

    res.json({ message: "Update an expense" });
});

// @docs: Delete an expense
// @route: DELETE /api/expenses/:id
// @access: Private
export const deleteExpense = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    const expenseId = req.params.id;

    const validate = updateExpenseSchema.safeParse({ userId, expenseId });
    if (!validate.success) {
        const message = validate.error.errors[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.errors[0].path} is required` : message });
        return;
    }

    const expenseExists = await expenseModel.findOne({ $and: [{ _id: validate.data.expenseId }, { userId: validate.data.userId }] });
    if (!expenseExists) {
        res.status(404).json({ message: "Expense not found" });
        return;
    }

    await expenseModel.deleteOne({ _id: validate.data.expenseId, userId: validate.data.userId });
    res.json({ message: "Delete an expense" });
});

// @docs: Filter expenses
// @route: GET /api/expenses/filter
// @access: Private
export const filterExpenses = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    const { categoryId, minAmount, maxAmount, startDate, endDate, sortBy = 'date', limit = '10', page = '1' } = req.query;

    const query: any = { userId };
    if (categoryId) query.categoryId = categoryId;
    if (minAmount) query.amount = { ...query.amount, $gte: Number(minAmount) };
    if (maxAmount) query.amount = { ...query.amount, $lte: Number(maxAmount) };
    if (startDate && endDate) query.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };

    const expenses = await expenseModel.find(query).sort({ [sortBy as string]: -1 }).skip((parseInt(page as string) - 1) * parseInt(limit as string)).limit(parseInt(limit as string)).populate('categoryId', '_id type name colorCode description').populate('userId', '_id username email role');
    if (!expenses.length) {
        res.status(404).json({ message: "No expenses found" });
        return;
    }

    res.json(expenses);
});