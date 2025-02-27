import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const protect = expressAsyncHandler(async (req, res, next) => {
    const cookie = req.headers.cookie;
    
    if (!cookie || !cookie.startsWith("token")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = cookie.split("=")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
    
});
