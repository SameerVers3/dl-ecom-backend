import express from "express";
import { createDiscount, getDiscounts, getDiscountById, updateDiscount, deleteDiscount} from '../controller/admin/discountController.js';
import { authenticateAdmin } from "../middlewares/AdminMiddleWare.js";

const router = express.Router();

// ADMIN PRODUCT ROUTES (CRUD)
router.get('/view',authenticateAdmin, getDiscounts);
router.get('/view/:id', getDiscountById);  

// authenticted only
router.put('/edit/:id',authenticateAdmin, updateDiscount);  
router.post('/add',authenticateAdmin, createDiscount);
router.delete('/delete/:id',authenticateAdmin, deleteDiscount);


export default router;