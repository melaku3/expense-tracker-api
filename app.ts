import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';

// Routes
import authRoute from './routes/authRoute';

// Create Express server
const app = express();


// Middleware
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Welcome message
app.get('/', (_req, res) => {
    res.json({message: 'Welcome to the Expense Tracker API! This project is designed to help you manage and track your expenses efficiently. Feel free to explore and contribute to this brainstorming project.'});
});

app.use('/api/auth', authRoute);


// Error handler
app.use(errorHandler);

export default app;
