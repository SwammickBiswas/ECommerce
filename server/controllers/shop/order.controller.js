const paypal = require("../../heplers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Products");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      paymentMethod,
      orderStatus,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          paymentId,
          payerId,
          orderUpdateDate,
        });
        await newlyCreatedOrder.save();
        const approvalURL = payment.links.find((link)=>link.rel === "approval_url").href;
        res.status(201).json({ approvalURL,success:true,orderId:newlyCreatedOrder._id });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating order",
      success: false,
    });
  }
};
const capturePayment = async (req, res) => {
  try {
    const {paymentId,payerId,orderId} = req.body
    let order = await Order.findById(orderId)
    if(!order){
      return res.status(404).json({message:"Order not found",success:false})
      }
      order.paymentStatus ="paid",
      order.orderStatus = "confirmed"
      order.paymentId=paymentId
      order.payerId=payerId

    for(let item of order.cartItems){
      let product = await Product.findById(item.productId)
      if(!product){
        return res.status(404).json({message:`Not enough stock for this product ${product.title}`,success:false})
      }

      product.totalStock -= item.quantity
      await product.save()
    }

      const getCartId = order.cartId
       await Cart.findByIdAndDelete(getCartId)


      await order.save()
      res.status(200).json({
        message: "Payment captured successfully",
        success: true,
        data:order
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error capturing order",
      success: false,
    });
  }
};
const getAllOrdersByUser= async (req,res) => {
  try {
    const {userId} = req.params
    const orders = await Order.find({userId})
    if(!orders.length ){
      return res.status(404).json({message:"No orders found",success:false})
    }
    res.status(200).json({
      message: "Orders retrieved successfully",
      success: true,
      data:orders
      })
  
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error capturing order",
      success: false,
    });
  }
}
const getOrderDetails = async (req,res) => {
  try {
    const {id} = req.params
    const order = await Order.findById(id)
    if(!order){
      return res.status(404).json({message:"Order not found",success:false})
      }
      res.status(200).json({
        message: "Order details retrieved successfully",
        success: true,
        data:order
        })



  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error capturing order",
      success: false,
    });
  }
}

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
};
