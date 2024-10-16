import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  imageUrl: { type: String, required: true },
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

export const Category = mongoose.model('Category', categorySchema);
