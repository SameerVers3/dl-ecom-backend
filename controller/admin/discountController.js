import { isObjectIdOrHexString } from "mongoose";
import Discount from "../../models/DiscountSchema.js";
import Product from "../../models/ProductSchema.js";

export const createDiscount = async (req, res) => {
  const {
    productId,
    amount,
    startDate,
    endDate,
    isActive
  } = req.body;

  if (!isObjectIdOrHexString(productId)){
    res.status(401).send({
      success: false,
      message: "Invalid product ID or product doensn't exist"
    })
    return;
  }
  const product = await Product.findById(productId);

  if (!product)  {
    res.status(401).send({
      success: false,
      message: "Invalid product ID or product doensn't exist"
    })
    return;
  }

  const alreadyPresent = await Discount.findOne({ productId });

  if (alreadyPresent) {

    res.status(200).send({
      success: false,
      message: "Discount for the product already Exists, try to update the it"
    })

    return;
  }

  try {
    console.log("saving discount");

    const newDiscount = new Discount({
      productId,
      amount,
      startDate,
      endDate,
      isActive
    });



    const savedDiscount = await newDiscount.save();

    console.log(savedDiscount);
    res.status(201).json(savedDiscount);

  } catch (error) {
    res.status(500).json({ message: 'Error creating discount', error });
  }
}



export const updateDiscount = async (req, res) => {

  const { id } = req.params;

  const {
    productId,
    amount,
    startDate,
    endDate,
    isActive
  } = req.body;

  try {

    const discount = await Discount.findById(id);

    if (!discount) {
      res.status(401).json({
        success: false,
        message: "Discount ID invalid"
      })
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(401).json({
        success: false,
        message: "Invalid product ID or product doesn't exist"
      });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        productId,
        amount,
        startDate,
        endDate,
        isActive
      },
      { new: true }
    );

    if (!updatedDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Error updating discount', error });
  }
};

export const deleteDiscount = async (req, res) => {
  const {id} = req.params;

  try {
    const deletedDiscount = await Discount.findByIdAndDelete(id);
    if (!deletedDiscount) {
      return res.status(404).json({ 
        message: 'Discount not found',
        success: false
      });
    }
    res.status(200).json({ 
      message: 'Discount deleted successfully',
      success: true
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting discount', 
      error
   });
  }
}

export const getDiscountById = async (req, res) => {
  const {id} = req.params;

  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ 
        message: 'Discount not found',
        success: false
      });
    }
    res.status(200).json({
      discount,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discount', error });
  }
}

export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounts', error });
  }
};