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
        // 🔁 SAME SIZE → REMOVE (toggle)
        if (exists.selectedSize === product.selectedSize) {
          state.items = state.items.filter(
            (item) => item.id !== product.id
          );
        }
        else {
          exists.selectedSize = product.selectedSize;
          exists.isInCart = true;
        }
      }
      else {
        state.items.push({
          ...product,
          quantity: 1,
          isInCart: true,
          selectedSize: product.selectedSize,
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
