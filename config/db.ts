import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
            .then(() => console.log("Connected to MongoDB"));
    } catch (error) {
        let errorMessage = "Error connecting to MongoDB";
        if (error instanceof Error) errorMessage = error.message;
        console.error(errorMessage);
    }
}

export default db;
