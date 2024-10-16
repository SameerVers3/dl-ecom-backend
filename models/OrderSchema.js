import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  items: { 
    type: [itemSchema], 
    required: true 
  },
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: { 
    type: String, 
    required: true 
  },
  shipmentId: { 
    type: Schema.Types.ObjectId 
  },
  paymentId: { 
    type: String // Changed from ObjectId to String
  },
  couponCode: { 
    type: String 
  },
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

const Order = mongoose.model('Order', orderSchema);

export default Order;
