import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
    isLoading:false,
    addressList:[]
}

export const addNewAddress = createAsyncThunk('address/addNewAddress',
    async(formData)=>{
        const response = await axios.post("http://localhost:5000/api/shop/address/add",formData)
        return response.data
    }
)
export const fetchAllAddresses = createAsyncThunk('address/fetchAllAddresses',
    async(userId)=>{
        const response = await axios.get(`http://localhost:5000/api/shop/address/get/${userId}`)
        return response.data; 
    }
)


export const editAddresses = createAsyncThunk('address/editAddresses',
    async({userId,addressId,formData})=>{
        const response = await axios.put(`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,formData)
        return response.data
    }
)


export const deleteAddress = createAsyncThunk('address/deleteAddress',
    async({ userId, addressId })=>{
        const response = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`)
        return response.data
    }
)

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList=action.payload.data;
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
                
            })
            .addCase(fetchAllAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload.data; 
            })
            .addCase(fetchAllAddresses.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(editAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editAddresses.fulfilled, (state, action) => {
                console.log(action.payload);
                
                state.isLoading = false;
                const index = state.addressList.findIndex(address => address.id === action.payload.id);
                if (index !== -1) {
                    state.addressList[index] = action.payload;
                }
            })
            .addCase(editAddresses.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = state.addressList.filter(address => address.id !== action.payload.id);
            })
            .addCase(deleteAddress.rejected, (state) => {
                state.isLoading = false;
            });
    }
});

export default addressSlice.reducer;

