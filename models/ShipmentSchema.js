import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const shipmentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, required: true },
  address: { 
    type: addressSchema, 
    required: true 
  },
  status: { type: String, required: true },
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
