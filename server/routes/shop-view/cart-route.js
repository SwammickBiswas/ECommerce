const express = require("express")




const {addToCart,fetchCartItems,deleteCartItem,updateCartItemQuantity} = require("../../controllers/shop/cart-controller")




const router = express.Router()

router.post("/add",addToCart)
router.get("/get/:userId",fetchCartItems)
router.delete("/:userId/:productId",deleteCartItem)
router.put("/update-cart",updateCartItemQuantity)

module.exports = router