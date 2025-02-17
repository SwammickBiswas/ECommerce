const { ImageUploadUtil } = require("../../heplers/cloudinary");
const Products = require("../../models/Products");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await ImageUploadUtil(url);
    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
    });
  }
};
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newLyCreatedProduct = new Products({
      image,
      title,
      description,
      category,
      price,
      brand,
      salePrice,
      totalStock,
    });
    await newLyCreatedProduct.save();
    res.json({
      success: true,
      message: "Product added successfully",
      data: newLyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    });
  }
};
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Products.find({});
    res.json({
      success: true,
      message: "Products fetched successfully",
      data: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      price,
      brand,
      salePrice,
      totalStock,
    } = req.body;
    let findProduct = await Products.findByIdAndUpdate(id);
    if (!findProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price=== "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice=== "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image
    await findProduct.save();
    res.json({
        success: true,
        message: "Product updated successfully",
        data: findProduct,
        });



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error editing product",
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByIdAndDelete(id);
    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found",
            });
            }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProducts,
};
