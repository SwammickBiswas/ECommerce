import { configureStore } from "@reduxjs/toolkit"
import adminOrderSlice from "./admin/order-slice"
import adminProductsSlice from "./admin/products-slice/index"
import authReducer from "./authSlice/index"
import shopAddressSlice from "./shop/address-slice/index"
import shopCartSlice from './shop/cart-slice/index'
import commonFeatureSlice from "./shop/common-slice/index"
import shopOrderSlice from "./shop/order-slice/index"
import shoppingProductSlice from "./shop/products-slice"
import shopReviewSlice from "./shop/review-slice/index"
import shopSearchSlice from "./shop/search-slice/index"


const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductsSlice,
        shopProducts:shoppingProductSlice,
        shopCart:shopCartSlice,
        shopAddress:shopAddressSlice,
        shopOrder:shopOrderSlice,
        adminOrder:adminOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewSlice,
        commonFeature:commonFeatureSlice

    }
})

export default store