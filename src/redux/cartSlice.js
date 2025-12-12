// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // store product objects {id, name, price,...}
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
  },
});

// ✅ Export actions
export const { addToCart, removeFromCart } = cartSlice.actions;

// ✅ Export reducer
export default cartSlice.reducer;
