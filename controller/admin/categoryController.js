import { string, object, optional } from "zod";
import mongoose from "mongoose";
import { Category } from '../../models/CategorySchema.js';

const { ObjectId } = mongoose.Types;

// Define Zod schema for category creation and update
const categorySchema = object({
  name: string().min(1, 'Name must be at least 1 character long'),
  description: string().min(1, 'Description must be at least 1 character long'),
  
  parentCategoryId: optional(string().refine(id => ObjectId.isValid(id), {
    message: "Invalid ObjectId format",
  })), // Validate ObjectId
});

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategoryId } = categorySchema.parse(req.body);
    const imageUrl = req.file ? req.file.path : null; // Get the uploaded image URL

    const category = new Category({
      name,
      description,
      parentCategoryId: parentCategoryId ? new ObjectId(parentCategoryId) : null,
      imageUrl, // Save the image URL to the category
    });

    await category.save();
    res.status(201).json({
      message: 'Category created successfully!',
      status: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(400).json({
      message: error.errors ?? 'Invalid data provided',
      status: false,
      error: error.message
    });
  }
};

// Other category functions remain unchanged

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: 'Categories retrieved successfully!',
      status: true,
      data: categories
    });
  } catch (error) {
    console.error('Error retrieving categories:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      status: false,
      error: error.message
    });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found!',
        status: false
      });
    }
    res.status(200).json({
      message: 'Category retrieved successfully!',
      status: true,
      data: category
    });
  } catch (error) {
    console.error('Error retrieving category:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      status: false,
      error: error.message
    });
  }
};

// Update a category by ID
export const updateCategoryById = async (req, res) => {
  try {
    const { name, description, parentCategoryId } = categorySchema.parse(req.body);
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name,
      description,
      parentCategoryId: parentCategoryId ? new ObjectId(parentCategoryId) : null,
    }, { new: true });
    if (!category) {
      return res.status(404).json({
        message: 'Category not found!',
        status: false
      });
    }
    res.status(200).json({
      message: 'Category updated successfully!',
      status: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(400).json({
      message: error.errors ?? 'Invalid data provided',
      status: false,
      error: error.message
    });
  }
};

// Delete a category by ID
export const deleteCategoryById = async (req, res) => {
  try {
    // console.log(req.params.id)
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found!',
        status: false
      });
    }
    res.status(200).json({
      message: 'Category deleted successfully!',
      status: true
    });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      status: false,
      error: error.message
    });
  }
};


export default {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
