import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cartItems");
    return data ? JSON.parse(data) : [];
  } catch {
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

      const existingItem = state.items.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        existingItem.quantity += product.qty || 1;
      } else {
        state.items.push({
          ...product,
          quantity: product.qty || 1,
          selectedSize: product.selectedSize,
          isInCart: true,
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const { id, selectedSize } = action.payload;

      state.items = state.items.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize)
      );

      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, selectedSize, quantity } = action.payload;

      const item = state.items.find(
        (item) => item.id === id && item.selectedSize === selectedSize
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === id && i.selectedSize === selectedSize)
          );
        } else {
          item.quantity = quantity;
        }
      }

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
