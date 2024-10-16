import SellRequest from '../../models/SellRequest.js'; 
import mongoose from 'mongoose';

export const viewSellRequests = async (req, res) => {
  try {
    const sellRequests = await SellRequest.find();
    res.status(200).json(sellRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewSellRequestById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid sell request ID' });
  }

  try {
    const sellRequest = await SellRequest.findById(id);

    if (!sellRequest) {
      return res.status(404).json({ message: 'Sell request not found' });
    }

    res.status(200).json(sellRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAdminNotes = async (req, res) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid sell request ID' });
  }

  try {
    const sellRequest = await SellRequest.findById(id);

    if (!sellRequest) {
      return res.status(404).json({ message: 'Sell request not found' });
    }

    sellRequest.adminNotes = adminNotes;
    sellRequest.updatedAt = Date.now();
    await sellRequest.save();

    res.status(200).json(sellRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSellRequest = async (req, res) => {
  const { userId, itemName, brand, processor, screenSize, condition, description } = req.body;

  const newSellRequest = new SellRequest({
    userId,
    itemName,
    brand,
    processor,
    screenSize,
    condition,
    description,
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  try {
    const savedSellRequest = await newSellRequest.save();
    res.status(201).json(savedSellRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid sell request ID' });
  }

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const sellRequest = await SellRequest.findById(id);

    if (!sellRequest) {
      return res.status(404).json({ message: 'Sell request not found' });
    }

    sellRequest.status = status;
    sellRequest.updatedAt = Date.now();
    await sellRequest.save();

    res.status(200).json(sellRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
