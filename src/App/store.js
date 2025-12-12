import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlice";
import wishlistReducer from "../redux/wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
