import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ["admin", "superadmin"] 
  }
});

export const Admin = mongoose.model('Admin', adminSchema);
