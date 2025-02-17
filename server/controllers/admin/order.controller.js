const Order = require("../../models/Order")

const getAllOrdersOfAllUsers= async (req,res) => {
  try {
    const orders = await Order.find({})
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

const getOrderDetailsForAdmin = async (req,res) => {
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
  const updateOrderStatus=async (req,res) => {
    try {
      const {id} = req.params
      const {orderStatus} = req.body;
      const order = await Order.findById(id)
      if(!order){
        return res.status(404).json({message:"Order not found",success:false})
        }
      await Order.findByIdAndUpdate(id,{orderStatus}, {new:true})
      res.status(200).json({
        message: "Order status updated successfully",
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




module.exports={getAllOrdersOfAllUsers,getOrderDetailsForAdmin,updateOrderStatus}