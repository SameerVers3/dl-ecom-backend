import { Admin } from '../models/AdminSchema.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = "test";

export const authenticateAdmin = async (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            return response.status(401).json({
                message: "Authentication failed! Token not provided.",
                status: false
            });
        }


        const decodedToken = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decodedToken._id); 
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found!",
                status: false
            });
        }

        request.adminData = decodedToken;
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return response.status(401).json({
            message: "Authentication failed! Invalid token.",
            status: false
        });
    }
};
