import Address from '../models/Address.js';

// Adding address for user
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || Object.keys(address).length === 0) {
      return res.status(400).json({ success: false, message: "Address data is required" });
    }

    const newAddress = new Address({
      ...address,
      userId: req.userId,
    });

    await newAddress.save();

    res.json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to add address" });
  }
};

// Getting address for logged user
export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    res.json({ success: true, addresses });
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to fetch addresses" });
  }
};
