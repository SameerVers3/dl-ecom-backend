import Order from '../../models/OrderSchema.js'; 
import mongoose from 'mongoose';


export const viewOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewOrderById = async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (userId, items, total, paymentId) => {
  try {
    const order = new Order({
      userId,
      items,
      total,
      status: 'completed',
      paymentId,
    });

    await order.save();
    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};
