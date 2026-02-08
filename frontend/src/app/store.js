import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/Cart/cartSlice";
import wishlistReducer from "../features/Wishlist/wishlistSlice";
import uiModalReducer from "../shared/ui/uiModalSlice";
import productsReducer from "../features/Products/productsSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    uiModal: uiModalReducer,
    products: productsReducer,
  },
});
