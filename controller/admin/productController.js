import Product from '../../models/ProductSchema.js';
import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const viewProducts = async (req, res) => {
  try {
    // console.log("Inside the product")
    const products = await Product.find();
    // console.log(products);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const viewProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error viewing product', error });
  }
};

export const addProduct = async (req, res) => {
  // console.log('Request body:', req.body); // Log the request body

  const {
    name,
    description,
    category,
    brand,
    price,
    stockQuantity,
    features,
    'specifications.processor': processor,
    'specifications.ram': ram,
    'specifications.storage': storage,
    'specifications.display': display,
    'specifications.graphics': graphics
  } = req.body;

  // Manually construct the specifications object
  const specifications = {
    processor,
    ram,
    storage,
    display,
    graphics
  };

  // console.log('Specifications:', specifications); // Log the specifications

  const images = [];
  try {
    if (req.file && req.file.path) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'products'
      });
      images.push(result.secure_url);

      // Check if the file path is local before trying to delete it
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path); // Remove the file after upload
      }
    }

    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      price,
      stockQuantity,
      images,
      features,
      specifications
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error); // Log the full error
    res.status(500).json({ message: 'Error adding product', error });
  }
};





export const editProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export default {
  viewProducts,
  viewProductById,
  addProduct,
  editProduct,
  deleteProduct,
};
