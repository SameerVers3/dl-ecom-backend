import express from "express";
import { uploadImage, deleteImage, viewImages, viewImage } from '../controller/admin/imageController.js';
import upload from '../controller/admin/imageController.js'; // Import the upload middleware

const router = express.Router();

router.post('/upload', upload.single('file'), uploadImage);
router.post("/delete", deleteImage);
router.get('/view', viewImages);
router.get('/view/:id', viewImage);

export default router;
