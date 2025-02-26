import app from "./app";
import dotenv from "dotenv";
import db from "./config/db";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
db();

const PORT = process.env.PORT || 3000;

// Start the server
mongoose.connection.once("open", () => app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`)));
