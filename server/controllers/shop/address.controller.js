const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    await newlyCreatedAddress.save();
    res.status(201).json({
      message: "Address Added Successfully",
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to add address",
      success: false,
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Userid is required", success: false });
    }
    const addressList = await Address.find({ userId });
    res.status(200).json({
      message: "Address Fetched Successfully",
      success: true,
      data: addressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to add address",
      success: false,
    });
  }
};
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ message: "Userid and AddressId are required", success: false });
    }
    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId: userId,
      },
      formData,
      { new: true }
    );
    if (!address) {
      return res
        .status(400)
        .json({ message: "Address not found", success: false });
    }
    res.status(200).json({
      message: "Address Updated Successfully",
      success: true,
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to add address",
      success: false,
    });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ success: false, message: "Address ID is required" });
    }
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
