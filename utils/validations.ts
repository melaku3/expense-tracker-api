import { z } from "zod";

// Define schemas for request body validations
export const createUserSchema = z.object({
    username: z.string().min(1, { message: 'Username cannot be empty' }).min(3, { message: 'Username must be at least 3 characters' }).max(20, { message: 'Username must be at most 20 characters' }).toLowerCase().trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim().toLowerCase(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(20, { message: 'Password must be at most 20 characters' }),
    role: z.enum(['user', 'admin'], { message: 'Role must be either user or admin' })
});

// Define schemas for request body validations
export const createCategorySchema = z.object({
    userId: z.string().length(24, { message: 'User ID must be exactly 24 characters long' }),
    name: z.string().min(3, { message: 'Category name must be at least 3 characters' }).max(255, { message: 'Category name must be at most 20 characters' }).toLowerCase().trim(),
    description: z.string().optional(),
    type: z.enum(['income', 'expense'], { message: 'Type must be either income or expense' }),
    colorCode: z.string().optional()
});

// Define schemas for request body validations
export const updateCategorySchema = z.object({
    categoryId: z.string().length(24, { message: 'Category ID must be exactly 24 characters long' }),
    userId: z.string().length(24, { message: 'User ID must be exactly 24 characters long' }),
    name: z.string().min(3, { message: 'Category name must be at least 3 characters' }).max(255, { message: 'Category name must be at most 20 characters' }).toLowerCase().trim().optional(),
    description: z.string().optional(),
    type: z.enum(['income', 'expense'], { message: 'Type must be either income or expense' }).optional(),
    colorCode: z.string().optional()
});

// Define schemas for request body validations
export const createExpenseSchema = z.object({
    userId: z.string().length(24, { message: 'User ID must be exactly 24 characters long' }),
    categoryId: z.string().length(24, { message: 'Category ID must be exactly 24 characters long' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
    description: z.string().optional(),
    date: z.date().optional()
});

// Define schemas for request body validations
export const updateExpenseSchema = z.object({
    expenseId: z.string().length(24, { message: 'Expense ID must be exactly 24 characters long' }),
    userId: z.string().length(24, { message: 'User ID must be exactly 24 characters long' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }).optional(),
    description: z.string().optional(),
    date: z.date().optional()
});

