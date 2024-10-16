const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  productId: { type: Schema.Types.ObjectId, required: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: ["view", "wishlist", "cart", "purchase"] 
  },
  timestamp: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
