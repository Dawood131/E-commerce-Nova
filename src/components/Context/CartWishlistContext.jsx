import React, { createContext, useState } from "react";

// Create context
const CartWishlistContext = createContext();

// Context Provider
export const CartWishlistProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Cart functions
  const addToCart = (item) => setCartItems((prev) => [...prev, item]);
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  // Wishlist functions
  const addToWishlist = (item) => setWishlistItems((prev) => [...prev, item]);
  const removeFromWishlist = (id) =>
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export default CartWishlistContext; // export context itself
