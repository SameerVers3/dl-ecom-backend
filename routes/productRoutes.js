import express from 'express';
import {
  viewProducts,
  viewProductById,
  addProduct,
  editProduct,
  deleteProduct,
} from '../controller/admin/productController.js';
import { imageUploadMiddleware } from '../middlewares/imageUploadMiddleware.js';

const router = express.Router();

router.get('/', viewProducts);
router.get('/:id', viewProductById);
router.post('/add', imageUploadMiddleware, addProduct);
router.put('/edit/:id', imageUploadMiddleware, editProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
