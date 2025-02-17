import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../../../@/hooks/use-toast";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice/index";
import { fetchAllProductDetails } from "../../store/shop/products-slice/index";
import {
    getSearchResults,
    resetSearchResults,
} from "../../store/shop/search-slice";

function SearchProducts() {
  const [keyWord, setKeyWord] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  useEffect(() => {
    if (keyWord && keyWord.trim() !== "" && keyWord.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyWord}`));
        dispatch(getSearchResults(keyWord));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyWord}`));
      dispatch(resetSearchResults());
    }
  }, [keyWord]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    console.log(getCurrentProductId);
    console.log(cartItems, "cartItem");
    let getCartItems = cartItems || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product Added to Cart",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    });
  }

  function handleGetProductsDetails(getCurrentProductId) {
    dispatch(fetchAllProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "bcvbk");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyWord}
            name="keyword"
            onChange={(event) => setKeyWord(event.target.value)}
            placeholder="Search products..."
            className="py-6"
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No Result Found</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults?.map((item) => (
          <>
            <ShoppingProductTile
              handleAddToCart={handleAddToCart}
              product={item}
              handleGetProductsDetails={handleGetProductsDetails}
            />
          </>
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
