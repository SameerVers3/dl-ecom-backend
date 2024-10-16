import User from '../models/UserSchema.js'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "test"; // Use the environment variable if available

export const authenticateUser = async (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        console.log(token);
        if (!token) {
            return response.status(401).json({
                message: "Authentication failed! Token not provided.",
                status: false
            });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decodedToken._id); 
        if (!user) {
            return response.status(404).json({
                message: "User not found!",
                status: false
            });
        }

        console.log("User authenticated:", user);

        request.userData = decodedToken;
        request.userId = user._id;  // Add the user ID to the request object
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return response.status(401).json({
            message: "Authentication failed! Invalid token.",
            status: false
        });
    }
};
