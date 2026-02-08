// redux/cartDrawerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartDrawerSlice = createSlice({
  name: "cartDrawer",
  initialState: { isOpen: false },
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
  }
});

export const { openCart, closeCart, toggleCart } = cartDrawerSlice.actions;
export default cartDrawerSlice.reducer;
