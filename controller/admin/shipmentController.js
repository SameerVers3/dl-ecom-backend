import Shipment from '../../models/ShipmentSchema.js'; 
import mongoose from 'mongoose';


export const viewShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const viewShipmentById = async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid shipment ID' });
  }

  try {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
