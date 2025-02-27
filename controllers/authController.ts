import expressAsyncHandler from "express-async-handler";
import userModel from "../models/userModel";
import { createUserSchema } from "../utils/validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @docs: Register a new user
// @route: POST /api/auth/signup
// @access: Public
export const signup = expressAsyncHandler(async (req, res) => {
    const body = req.body;
    body.role = body?.role?.toLowerCase();

    const validate = createUserSchema.safeParse(body);
    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const userExists = await userModel.findOne({ $or: [{ email: validate.data.email }, { username: validate.data.username }] });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    validate.data.password = await bcrypt.hash(validate.data.password, salt);

    const user = await userModel.create(validate.data);
    res.status(201).json({ message: "User created successfully" });
});

// @docs: Login a user
// @route: POST /api/auth/login
// @access: Public
export const login = expressAsyncHandler(async (req, res) => {
    const body = req.body;

    const validate = createUserSchema.pick({ email: true, password: true }).safeParse(body);
    if (!validate.success) {
        const message = validate.error.issues[0].message;
        res.status(400).json({ message: message === 'Required' ? `${validate.error.issues[0].path} is ${message.toLocaleLowerCase()}` : message });
        return;
    }

    const user = await userModel.findOne({ email: validate.data.email });
    if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }

    const isMatch = await bcrypt.compare(validate.data.password, user.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' }); // 15 minutes
    res.clearCookie('token');
    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 15 * 60 * 1000) }); // 15 minutes
    res.json({ message: "User logged in successfully" });
});

// @docs: Get the current user
// @route: GET /api/auth/me
// @access: Private
export const userProfile = expressAsyncHandler(async (req, res) => {
    const userId = req.body.user.id;
    if (!userId || userId.length !== 24) {
        res.status(400).json({ message: "Invalid user" });
        return;
    }   

    const user = await userModel.findById(userId).select('-password');
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json({ message: user });
});
