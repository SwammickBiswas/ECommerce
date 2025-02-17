import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../../store/shop/cart-slice/index";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cartItems-content";

function UserCartWrapper({ cartItems,setOpenCartSheet }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  const totalPrice = cartItems.reduce((total, item) => total + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity, 0);

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent cartItem={item} key={item.productId} />
          ))
        ) : (
          <p>No items in cart</p>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <Button onClick={()=>{
        navigate('/shop/checkout')
        setOpenCartSheet(false)
      }} className="w-full mt-6">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
