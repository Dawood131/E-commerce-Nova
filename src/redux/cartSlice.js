import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cartItems");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const initialState = {
  items: loadCartFromStorage(), 
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);

      if (exists) {
        exists.quantity += 1;
        exists.isInCart = true; // icon highlight flag
        if (product.selectedSize) exists.selectedSize = product.selectedSize; // save size
      } else {
        state.items.push({ 
          ...product, 
          quantity: 1, 
          isInCart: true, // new product icon state
          selectedSize: product.selectedSize || "" // default size
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      saveCartToStorage(state.items); 
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((item) => item.id === id);

      if (product) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          product.quantity = quantity;
        }
      }

      saveCartToStorage(state.items); 
    },

    // ✅ new reducer for size/icon updates
    updateProductOptions: (state, action) => {
      const { id, selectedSize, isInCart } = action.payload;
      const product = state.items.find((item) => item.id === id);
      if (product) {
        if (selectedSize !== undefined) product.selectedSize = selectedSize;
        if (isInCart !== undefined) product.isInCart = isInCart;
      }
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateProductOptions } = cartSlice.actions;
export default cartSlice.reducer;
