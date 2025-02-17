const express = require("express");
const { upload } = require("../../heplers/cloudinary");
const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products.controller");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.get("/get", fetchAllProducts);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
