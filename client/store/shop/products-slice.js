import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// ...existing code...

export const fetchAllFilteredProducts = createAsyncThunk(
  'products/fetchAllFilteredProducts',
  async ({ filterParams, sortParams }) => {
    const response = await axios.get('/api/products', {
      params: { ...filterParams, sort: sortParams },
    });
    return response.data;
  }
);

// ...existing code...

const productsSlice = createSlice({
  name: 'shopProducts',
  initialState: {
    productList: [],
    productDetails: null,
    // ...existing code...
  },
  reducers: {
    // ...existing code...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.productList = action.payload;
      })
      // ...existing code...
  },
});

export const { actions, reducer } = productsSlice;
export default reducer;
