// src/redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit"; // ✅ Must import this

const initialState = {
  items: [], // store product IDs
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter(itemId => itemId !== id);
      } else {
        state.items.push(id);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
