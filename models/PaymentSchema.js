const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, required: true },
  method: { type: String, required: true },
  status: { type: String, required: true },
  transactionId: { type: String, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
