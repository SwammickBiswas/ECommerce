import UserCartItemsContent from "@/components/shopping-view/cartItems-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../@/hooks/use-toast";
import image from "../../assets/account.avif";
import Address from "../../components/shopping-view/address";
import { createNewOrder } from "../../store/shop/order-slice/index";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart)
const { user } = useSelector((state) => state.auth);
const {approvalURL} =useSelector(state=>state.shopOrder)
  console.log(cartItems, "cartItems");
  const [currentSelectedAddress,setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart,setIsPaymentStart] = useState(false)
  const dispatch = useDispatch()
  const {toast} = useToast()
  console.log(currentSelectedAddress);
  
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );
  function handleInitiatePaypalPayment(){
    if(cartItems.length === 0){
      toast({
        title:"Your cart is empty. Please add items to proceed",
        variant:"destructive"
      })
      return
    }
    if(currentSelectedAddress === null){
      toast({
        title:"Please select one address to proceed",
        variant:"destructive"
      })
      return
    }
    const orderData={
      userId:user?.id,
      cartId:cartItems?._id,
      cartItems:cartItems?.map(singleCartItem=>({
        productId:singleCartItem?.productId,
        title:singleCartItem?.title,
        price:singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        image:singleCartItem?.image,
        salePrice:singleCartItem?.salePrice,
        quantity:singleCartItem?.quantity
      })),
      addressInfo:{
        addressId:currentSelectedAddress?._id,
        address : currentSelectedAddress?.address,
        city : currentSelectedAddress?.city,
        pincode:currentSelectedAddress?.pincode,
        phone:currentSelectedAddress?.phone,
        notes:currentSelectedAddress?.notes
      },
      orderStatus:"pending",
      paymentMethod:"paypal",
      paymentStatus:"pending",
      totalAmount:totalPrice,
      orderDate:new Date(),
      paymentId:"",
      payerId:'',
      orderUpdateDate:new Date(),
    }
    console.log(orderData);
    dispatch(createNewOrder(orderData)).then((data)=>{
      console.log(data,"data");
      if(data?.payload?.success){
        setIsPaymentStart(true)
      }else{
        setIsPaymentStart(false)
      }
    })
  }
  if(approvalURL){
    window.location.href=approvalURL
  }


  return (
    <div className="flex flex-col ">
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={image}
          className="h-full w-full object-cover object-center"
          alt=""
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems && cartItems.length > 0
            ? cartItems.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        <div className="w-full mt-4">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {
                isPaymentStart ? 'Processing Paypal Payment' : "Checkout with paypal"
              }</Button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
