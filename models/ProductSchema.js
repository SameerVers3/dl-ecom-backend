import mongoose from 'mongoose';

const { Schema } = mongoose;

const specificationSchema = new Schema({
  processor: { type: String },
  ram: { type: String },
  storage: { type: String },
  display: { type: String },
  graphics: { type: String }
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  brand: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  images: { type: [String], required: true },
  features: { type: [String], required: true },
  specifications: { type: specificationSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
