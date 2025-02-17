import { MinusIcon, Plus, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../@/hooks/use-toast";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartItemQuantity,
} from "../../store/shop/cart-slice/index";
import { Button } from "../ui/button";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const {productList} = useSelector((state)=>state.shopProducts)
  const dispatch = useDispatch();
  const { toast } = useToast();
  const MAX_QUANTITY = 10; 

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    console.log("handleUpdateQuantity called with:", getCartItem, typeOfAction); 
    if(typeOfAction === "plus"){
      let getCartItems = cartItems || [];
      console.log("getCartItems:", getCartItems); 
      if(getCartItems.length){
        const indexOfCurrentCartItem = getCartItems.findIndex((item)=>item.productId ===  getCartItem?.productId)
        const getCurrentProductIndex =productList?.findIndex(product=>product._id === getCartItem?.productId)
        const getTotalStock = productList?.[getCurrentProductIndex]?.totalStock
        console.log("Indexes and stock:", indexOfCurrentCartItem, getCurrentProductIndex, getTotalStock); 
        
        if(indexOfCurrentCartItem > -1){
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity
          if(getQuantity + 1 > getTotalStock){
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant:"destructive"
            })
            return;
          }
        }
      }
    }
    const newQuantity =
      typeOfAction === 'plus'
        ? getCartItem?.quantity + 1
        : getCartItem?.quantity - 1;

    if (newQuantity < 1 || newQuantity > MAX_QUANTITY) return;

    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
        dispatch(fetchCartItems(user?.id));
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then(() => {
      dispatch(fetchCartItems(user?.id)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cart item is deleted successfully",
          });
        }
      });
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            disabled={cartItem?.quantity === 1} 
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, 'minus')} 
          >
            <MinusIcon className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            disabled={cartItem?.quantity >= MAX_QUANTITY}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, 'plus')}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <TrashIcon
          className="cursor-pointer mt-1"
          size={20}
          onClick={() => handleCartItemDelete(cartItem)}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
