import mongoose from 'mongoose';
const { Schema } = mongoose;

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const userSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: [addressSchema] },
});

const User = mongoose.model('User', userSchema);

export default User;
 