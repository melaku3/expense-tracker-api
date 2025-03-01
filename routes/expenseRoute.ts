import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, filterExpenses } from "../controllers/expenseController";

const expenseRoute = express.Router();

expenseRoute.route("/")
    .get(protect, getExpenses)
    .post(protect, createExpense);

expenseRoute.get("/filter", protect, filterExpenses);

expenseRoute.route("/:id")
    .get(protect, getExpense)
    .patch(protect, updateExpense)
    .delete(protect, deleteExpense);


export default expenseRoute;
