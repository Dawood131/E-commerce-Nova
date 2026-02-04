import React, { useState, useRef, useEffect } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import { openModal } from "../../redux/uiModalSlice";
import { NavLink } from "react-router-dom";

const ProductCard = ({ product, viewMode }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);

  const [hoverWishlist, setHoverWishlist] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const sizeSelectorRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);


  const cartItem = cart.find((item) => item.id === product.id);
  const selectedSize = cartItem?.selectedSize || "";
  const [localSelectedSize, setLocalSelectedSize] = useState(cartItem?.selectedSize || "");
  const isInCart = !!cartItem;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const price = product.new_price || product.price;
  const oldPrice = product.old_price || null;
  const image = Array.isArray(product.image) ? product.image[0] : product.image;

  // ================= CART SIZE SELECT =================
  const handleSizeSelect = (size) => {
    const cartProduct = {
      ...product,
      selectedSize: size,
    };

    dispatch(addToCart(cartProduct));
    dispatch(openModal({ type: "cart", product: cartProduct }));

    // Update local selection
    setLocalSelectedSize(size);
    setShowSizeSelector(false);
  };

  // ================= WISHLIST =================
  const handleWishlistClick = () => {
    const wishlistProduct = {
      ...product, // 🔥 FULL PRODUCT (sizes preserved)
      image: Array.isArray(product.image) ? product.image : [product.image],
      size: product.size || null,
    };

    dispatch(toggleWishlist(wishlistProduct));

    if (!isWishlisted) {
      dispatch(openModal({ type: "wishlist", product: wishlistProduct }));
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeSelectorRef.current && !sizeSelectorRef.current.contains(e.target)) {
        setShowSizeSelector(false);
      }
    };

    if (showSizeSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSizeSelector]);

  // ================= JSX =================
  return (
    <div className="group relative w-full mb-3">
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-md">
        <NavLink to={`/product/${product.id}`}>
          <div
            className={`relative w-full overflow-hidden rounded-lg ${viewMode === "list" ? "aspect-[6/5]" : "aspect-[3/4]"
              }`}
          >
            <div className="relative w-full h-full">
              {!imgLoaded && (
                <div className="absolute inset-0 animate-shimmer rounded-lg" />
              )}

              <img
                src={image}
                alt={product.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500
      ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>

        </NavLink>
        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlistClick}
          onMouseEnter={() => setHoverWishlist(true)}
          onMouseLeave={() => setHoverWishlist(false)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all
            ${isWishlisted
              ? "bg-yellow-400 text-white"
              : hoverWishlist
                ? "bg-white text-yellow-400"
                : "bg-white text-gray-600"
            }`}
        >
          {isWishlisted || hoverWishlist ? (
            <AiFillHeart size={22} />
          ) : (
            <AiOutlineHeart size={22} />
          )}
        </button>

        {/* CART + SIZE */}
        <div
          ref={sizeSelectorRef}
          className="absolute bottom-3 left-3 flex items-center space-x-2"
          onMouseEnter={() => window.innerWidth >= 768 && setShowSizeSelector(true)}
          onMouseLeave={() => window.innerWidth >= 768 && setShowSizeSelector(false)}
        >
          {!showSizeSelector && (
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition
        ${isInCart ? "bg-yellow-500 text-white" : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"}`}
              onClick={() => window.innerWidth < 768 && setShowSizeSelector(true)}
            >
              <TbShoppingBagPlus size={20} />
            </button>
          )}

          {showSizeSelector && product.sizes?.length > 0 && (
            <div className="flex space-x-1 bg-white px-2 py-1 rounded-full shadow-sm md:ml-0 -ml-2">
              {product.sizes.map((size) => {
                // Check if this size is already in the cart for this product
                const isSizeInCart = cart.some(
                  (item) => item.id === product.id && item.selectedSize === size
                );

                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`md:w-9 w-8 md:h-9 h-8 rounded-full text-sm shadow-md font-medium transition
        ${isSizeInCart
                        ? "bg-yellow-400 text-white"
                        : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* CONTENT */}
      <div className="mt-3">
        {product.tags && (
          <p className="text-[12px] text-gray-500">{product.tags}</p>
        )}
        <NavLink to={`/product/${product.id}`}>
          <h2 className="text-[14px] font-medium mt-1">{product.name}</h2>
        </NavLink>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[16px] font-semibold">
            $ {price.toLocaleString()}
          </span>
          {oldPrice && (
            <span className="text-sm line-through text-gray-400">
              $ {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {product.isNew && (
          <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded-full inline-block mt-1">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
