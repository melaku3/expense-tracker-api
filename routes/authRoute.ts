import express from 'express';
import { login, signup, userProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const authRoute = express.Router();

authRoute.post('/signup', signup);
authRoute.post('/login', login);
authRoute.get('/me', protect, userProfile);

export default authRoute;
