import mongoose from 'mongoose';

const { Schema } = mongoose;

const couponSchema = new Schema({
  code: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["percentage", "fixed_amount"] 
  },
  amount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, required: true }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
