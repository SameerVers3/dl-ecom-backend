import User from '../../models/UserSchema.js';
import { Admin } from '../../models/AdminSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { EmailVerificationHtml } from '../../templates/template.js';
import OtpModel from '../../models/OtpSchema.js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "test";

const adminLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const signupController = async (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            response.status(400).json({
                message: "Required fields are missing!",
                status: false
            });
            return;
        }

        const hashPass = await bcrypt.hash(password, 10);

        const user = await User.findOne({ email });

        if (user) {
            response.status(400).json({
                message: "Email address already in use!",
                status: false
            });
            return;
        }

        const obj = {
            ...request.body,
            passwordHash: hashPass 
        };

        const userResponse = await User.create(obj);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
        const otp = Math.floor(100000 + Math.random() * 900000);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification",
            html: EmailVerificationHtml(otp),
        });

        await OtpModel.create({
            otp,
            email
        });

        response.status(201).json({
            data: userResponse,
            message: "Successfully signed up!",
            status: true
        });
    } catch (error) {
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
}

export const LoginController = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response.status(400).json({
                message: "Required fields are missing!",
                status: false
            });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            response.status(401).json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
            return;
        }

        const comparePass = await bcrypt.compare(password, user.passwordHash);

        if (!comparePass) {
            response.status(401).json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
            return;
        }

        // const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        
        // for no token expire 
        const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET);

        response.status(200).json({
            message: "User login successful!",
            status: true,
            data: user,
            token
        });

    } catch (error) {
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
}

export const OTPVerification = async (request, response) => {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            response.status(400).json({
                message: "Required fields are missing!",
                status: false
            });
            return;
        }

        const otpRes = await OtpModel.findOne({ email, otp });

        if (!otpRes) {
            response.status(400).json({
                message: "Invalid OTP!",
                status: false
            });
            return;
        }

        if (otpRes.isUsed) {
            response.status(400).json({
                message: "OTP already used!",
                status: false
            });
            return;
        }

        await OtpModel.findOneAndUpdate({ _id: otpRes._id }, {
            isUsed: true
        });

        response.status(200).json({
            message: "OTP verified!",
            status: true,
            data: []
        });

    } catch (error) {
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
}

// Admin login controller
export const AdminLoginController = async (request, response) => {
    try {
        const parsedBody = adminLoginSchema.safeParse(request.body);

        if (!parsedBody.success) {
            return response.status(400).json({
                message: "Validation error",
                status: false,
                errors: parsedBody.error.errors,
            });
        }

        const { email, password } = parsedBody.data;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found!",
                status: false
            });
        }

        //const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

        if (password !== admin.passwordHash) {
            console.log("Invalid password");

            return response.status(401).json({
                message: "Invalid password!",
                status: false
            });

        }

        const token = jwt.sign({ _id: admin._id, email: admin.email }, JWT_SECRET, {
            expiresIn: '1h'
        });

        response.status(200).json({
            message: "Admin logged in successfully!",
            status: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token
            }
        });

    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            status: false,
            error: error.message
        });
    }
};

export const VerifyTokenController = async (request, response) => {
    try {
        const token = request.headers.authorization.split(" ")[1];
        if (!token) {
            return response.status(401).json({
                message: "Unauthorized access!",
                status: false
            });
        }

        jwt.verify(token, JWT_SECRET, async (error, decoded) => {
            if (error) {
                return response.status(401).json({
                    message: "Unauthorized access!",
                    status: false
                });
            }

            const admin = await Admin.findById(decoded._id);
            if (!admin) {
                return response.status(404).json({
                    message: "Admin not found!",
                    status: false
                });
            }

            response.status(200).json({
                message: "Token verified!",
                status: true,
                data: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    sessionValid: true
                }
            });
        });

    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            status: false,
            error: error.message
        });
    }
}
