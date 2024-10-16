import express from "express";
import { AdminLoginController, VerifyTokenController } from "../controller/admin/authController.js";
import { createCoupon, viewCoupons, viewCouponsById } from '../controller/admin/couponController.js';
import { viewOrders, viewOrderById } from '../controller/admin/orderController.js';
import { viewSellRequests, viewSellRequestById, addAdminNotes, setStatus, addSellRequest } from '../controller/admin/sellRequestController.js';
import { viewShipments, viewShipmentById } from '../controller/admin/shipmentController.js';
import { authenticateAdmin } from "../middlewares/AdminMiddleWare.js";
import { createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } from '../controller/admin/categoryController.js';
import { categoryImageUploadMiddleware } from '../middlewares/categoryImageUploadMiddleware.js';



const router = express.Router();

// ADMIN AUTH API
router.post('/login', AdminLoginController);
router.get('/verifysession', VerifyTokenController);

router.get('/profile', authenticateAdmin, (req, res) => {
    res.json({
        message: "Access granted to admin profile!",
        status: true,
        adminData: req.adminData
    });
});

// ADMIN ROUTES

router.get('/order/view', viewOrders);
router.get('/order/view/:id', viewOrderById);
router.post('/coupons/create', createCoupon);
router.get('/coupons/view', viewCoupons);
router.get('/coupons/view/:id', viewCouponsById);
router.get('/sellRequest/view', viewSellRequests);
router.get('/sellRequest/view/:id', viewSellRequestById);
router.put('/sellRequest/addNote/:id', addAdminNotes); // Add admin notes to the sell request
router.put('/sellRequest/setStatus/:id', setStatus);
router.post('/sellRequest/add', addSellRequest);
router.get('/shipment/view', viewShipments);
router.get('/shipment/view/:id', viewShipmentById);

// Category routes
router.post('/categories', categoryImageUploadMiddleware, createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', categoryImageUploadMiddleware, updateCategoryById);
router.delete('/categories/:id', deleteCategoryById);

export default router;