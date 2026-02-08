import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem("wishlistItems");
    const items = data ? JSON.parse(data) : [];
    return items.filter(item => item && item.id);
  } catch (err) {
    return [];
  }
};

const saveWishlistToStorage = (items) => {
  localStorage.setItem("wishlistItems", JSON.stringify(items));
};

const initialState = {
  items: loadWishlistFromStorage(),
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);

      if (exists) {
        state.items = state.items.filter(item => item.id !== product.id);
      } else {
        state.items.push(product);
      }
      saveWishlistToStorage(state.items);
    }
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
