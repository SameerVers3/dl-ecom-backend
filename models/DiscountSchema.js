import mongoose from 'mongoose';
const { Schema } = mongoose;

const discountSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["percentage", "fixed_amount"],
    default: "percentage" 
  },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
  createdAt: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;