const Products = require("../../models/Products");

const getFilterProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
    let filters = {};
    if (category.length > 0) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length > 0) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Products.find(filters).sort(sort);
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occurred",
    });
  }
};

const getProductsDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "product not found",
      });
    }
    res.status(200).json({
        status: "success",
        data: product,
        });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occurred",
    });
  }
};

module.exports = { getFilterProducts,getProductsDetails };
