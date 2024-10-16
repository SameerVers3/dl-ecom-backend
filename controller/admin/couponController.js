import Coupon from '../../models/CouponSchema.js';


export const createCoupon = async (req, res) => {
  const { code, type, amount, expiryDate, isActive } = req.body;


  if (!code || !type || !amount || !expiryDate || typeof isActive === 'undefined') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCoupon = new Coupon({ code, type, amount, expiryDate, isActive });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const viewCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const viewCouponsById = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
