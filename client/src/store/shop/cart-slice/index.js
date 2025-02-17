import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
    cartItems:[],
    isLoading:false
}
export const addToCart = createAsyncThunk('/cart/addToCart',
    async ({userId,productId,quantity}) =>{
        const response = await axios.post('http://localhost:5000/api/shop/cart/add',{
            userId,
            productId,
            quantity
        });
        return response.data;
    } 
)
export const fetchCartItems = createAsyncThunk('/cart/fetchCartItems',
    async (userId) =>{
        const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
        return response.data;
    } 
)
export const deleteCartItem = createAsyncThunk('/cart/deleteCartItem',
    async ({userId,productId}) =>{
        const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`);
        return response.data;
    } 
)
export const updateCartItemQuantity = createAsyncThunk('/cart/updateCartItemQuantity',
    async ({userId,productId,quantity}) =>{
        const response = await axios.put('http://localhost:5000/api/shop/cart/update-cart',{
            userId,
            productId,
            quantity
        });
        return response.data;
    } 
)
const shoppingCartSlice = createSlice({
    name:"shoppingCart",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = []
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data.items;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = state.cartItems.filter(item => item.productId !== action.payload.productId);
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
                if (index !== -1) {
                    state.cartItems[index].quantity = action.payload.quantity;
                }
            })
            .addCase(updateCartItemQuantity.rejected, (state) => {
                state.isLoading = false;
            });
    }
})

export default shoppingCartSlice.reducer;