import mongoose from 'mongoose';

const { Schema } = mongoose;

const sellRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    description: 'User ID of the requester (reference to Users collection)',
  },
  itemName: {
    type: String,
    required: true,
    description: 'Name of the laptop being offered for sale',
  },
  brand: {
    type: String,
    required: true,
    description: 'Brand of the laptop',
  },
  processor: {
    type: String,
    required: true,
    description: 'Processor details of the laptop',
  },
  screenSize: {
    type: String,
    required: true,
    description: 'Screen size of the laptop',
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Damaged/Faulty'],
    description: 'Condition of the laptop',
  },
  description: {
    type: String,
    required: true,
    description: 'Detailed description of the laptop',
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    description: 'Status of the sell request',
  },
  adminNotes: {
    type: String,
    description: 'Optional notes or comments from admin regarding the sell request',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    description: 'Timestamp indicating creation time of the sell request',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
    description: 'Timestamp indicating last update time of the sell request',
  },
});

const SellRequest = mongoose.model('SellRequest', sellRequestSchema);

export default SellRequest;
