import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlice.js";
import wishlistReducer from "../redux/wishlistSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
