const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const Product = require("../../models/Products");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });
    // if (!order) {
    //   return res
    //     .status(403)
    //     .json({
    //       message: "You need to purchase products to review",
    //       success: false,
    //     });
    // }
    const checkExistingReview = await ProductReview.findOne({
      userId,
      productId,
    });
    if (checkExistingReview) {
      return res
        .status(403)
        .json({
          message: "You have already reviewed this product",
          success: false,
        });
    }
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();
    const reviews = await ProductReview.find({ productId });
    const totalReviewLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewLength;
    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      message: "Product review added successfully",
      success: true,
      data:newReview
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReview = async (req, res) => {
  try {
    const {productId} = req.params
    const reviews = await ProductReview.find({productId})
    res.status(200).json({
        success: true,
        data: reviews
        })




  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReview,
};
