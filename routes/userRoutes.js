import express from "express";
import { LoginController, OTPVerification, signupController } from "../controller/admin/authController.js";
import { viewAllUser , addAddress,  editUser, deleteUser, viewUserByID } from "../controller/admin/UserController.js";
import { StripeController, StripeWebhook } from "../controller/admin/StripeController.js";
import bodyParser from "body-parser";
import { authenticateUser } from "../middlewares/UserMiddleWare.js";

const router = express.Router();



// USER AUTH API
router.post("/signup", signupController);
router.post("/login", LoginController);
router.post("/otpverification", OTPVerification);
router.get("/view",viewAllUser);
router.get("/view/:id",viewUserByID);
router.put('/addAddress/:userId', addAddress);
router.put('/edit/:userId', editUser);
router.delete('/delete/:userId', deleteUser);

router.post("/stripe-checkout", authenticateUser , StripeController);

export default router;