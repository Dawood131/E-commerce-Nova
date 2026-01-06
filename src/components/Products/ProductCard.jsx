import React, { useState } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);

  // Local hover states (independent for each card)
  const [hoverCart, setHoverCart] = useState(false);
  const [hoverWishlist, setHoverWishlist] = useState(false);

  // Check if this product is in cart/wishlist
  const isInCart = cart.some(item => item.id === product.id);
  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Price handling
  const price = product.new_price || product.price;
  const oldPrice = product.old_price || null;
  const image = Array.isArray(product.image) ? product.image[0] : product.image;

  // Handlers
  const handleCartClick = () => {
    if (isInCart) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(addToCart(product));
    }
  };

  const handleWishlistClick = () => {
    // Pass full product object
    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      price: price,
      image: Array.isArray(product.image) ? product.image : [product.image],
      tags: product.tags,
      isNew: product.isNew
    }));
  };


  return (
    <div className="group relative w-full">
      {/* Image */}
      <div className="relative overflow-hidden rounded-md">
        <img
          src={image}
          alt={product.name}
          className=" w-full  h-[220px] sm:h-[250px] md:h-[280px] lg:h-[310px] object-cover  transition-all duration-500  group-hover:scale-105 cursor-pointer"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          onMouseEnter={() => setHoverWishlist(true)}
          onMouseLeave={() => setHoverWishlist(false)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all duration-300 
            ${isWishlisted
              ? "bg-yellow-400 text-white"
              : hoverWishlist
                ? "text-yellow-400 bg-white hover:bg-white/90"
                : "bg-white text-gray-600 hover:bg-white/90"}`}
        >
          {isWishlisted || hoverWishlist ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}
        </button>

        {/* Cart Button */}
        <button
          onClick={handleCartClick}
          onMouseEnter={() => setHoverCart(true)}
          onMouseLeave={() => setHoverCart(false)}
          className={`absolute bottom-3 left-3 p-2 rounded-full shadow-md flex items-center justify-center transition-all duration-300
            ${isInCart
              ? "bg-yellow-400 text-white"
              : hoverCart
                ? "text-yellow-400 bg-white hover:bg-white/90"
                : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          <TbShoppingBagPlus size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3">
        {/* Tags */}
        {product.tags && (
          <p className="text-[12px] text-gray-500 cursor-pointer">{product.tags}</p>
        )}

        {/* Title */}
        <h2 className="text-[14px] font-medium mt-1 leading-tight cursor-pointer">{product.name}</h2>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[16px] font-semibold">$ {price.toLocaleString()}</span>
          {oldPrice && (
            <span className="text-sm line-through text-gray-400">
              $ {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* New Badge */}
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
