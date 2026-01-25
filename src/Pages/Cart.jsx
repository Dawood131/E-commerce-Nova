import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Header from "../components/Header/Header";
import MainBtn from "../components/Button/MainBtn";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import Footer from "../components/Layout/Footer";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { GoTrash } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { toggleWishlist } from "../redux/wishlistSlice";


const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showWishlistConfirm, setShowWishlistConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const confirmMoveToWishlist = () => {
    dispatch(toggleWishlist(selectedProduct));
    dispatch(removeFromCart(selectedProduct.id));
    setShowWishlistConfirm(false);
    setSelectedProduct(null);
  };

  const cancelMoveToWishlist = () => {
    setShowWishlistConfirm(false);
    setSelectedProduct(null);
  };



  const handleRemoveClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(removeFromCart(deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1 || quantity > 5) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const subtotal = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const salesTax = subtotal * 0.15;
  const fbrCharges = 1;
  const total = subtotal + salesTax + fbrCharges;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="md:hidden w-full flex justify-center items-center py-2 -mb-26">
          <NavLink to="/">
            <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
          </NavLink>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-20 mt-10">
          <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl max-w-4xl w-full p-8 gap-8">

            {/* Left: Illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="flex items-center justify-center md:w-64 w-44 md:h-64 h-44 rounded-full bg-yellow-50 shadow-inner">
                <HiOutlineShoppingBag className="md:text-[160px] text-[120px] text-yellow-500" />
              </div>
            </div>

            {/* Right: Text & Button */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 text-center md:text-left text-lg">
                Looks like you haven’t added any products yet. Explore our collections to find your favorites and start shopping now!
              </p>
              <NavLink to="/">
                <MainBtn text={"Continue Shopping"} className="rounded-xl md:w-95 w-75" />
              </NavLink>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="md:hidden w-full flex justify-center items-center py-2 -mb-15">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-28 mt-5">

        {/* ===== PRODUCTS LIST ===== */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between  pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Your Bag
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review your selected items
              </p>
            </div>

            <div className="flex items-center justify-center min-w-[44px] h-10 px-3 rounded-lg bg-black text-white text-lg font-semibold">
              {cart.length}
            </div>
          </div>

          {cart.map((product, index) => (
            <div key={product.id} className="flex flex-col gap-4 md:mt-2 mt-4">
              <div className="flex flex-row items-start gap-4">

                {/* Product Image */}
                <img
                  src={product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-lg flex-shrink-0"
                />

                {/* Product Info + Quantity */}
                <div className="flex-1 flex flex-col justify-between gap-2">


                  {/* Top Row: Name, Price, Size, Stock */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 md:text-lg text-sm line-clamp-2">
                        {product.name || "Unnamed Product"}
                      </h3>
                      <p className="text-gray-800 font-bold text-sm md:text-base">
                        ${product.price?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-gray-600 text-sm">Size: <span className="font-bold">{product.selectedSize  || "N/A"}</span></p>
                      <p className="text-green-600 font-medium text-sm">In Stock</p>

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowWishlistConfirm(true);
                        }}
                        className="text-sm text-gray-600 hover:text-yellow-500 mt-1 font-semibold transition cursor-pointer"
                      >
                        Move to Wishlist
                      </button>
                    </div>

                    {/* Trash Button Top-Right */}
                    <button
                      onClick={() => handleRemoveClick(product.id)}
                      className="flex items-center justify-center text-black hover:text-yellow-500 transition p-1 -mt-0.5 rounded-full cursor-pointer"
                    >
                      <GoTrash size={20} />
                    </button>
                  </div>

                  {/* Bottom Row: Quantity */}
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-max -ml-0.5 md:-mt-1 mt-1">
                      {/* Minus */}
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                        className={`flex items-center justify-center px-3 py-2 bg-gray-100 cursor-pointer transition text-gray-700 rounded-md ${product.quantity === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-yellow-500"
                          }`}
                        disabled={product.quantity === 1}
                      >
                        <AiOutlineMinus size={16} />
                      </button>

                      {/* Quantity */}
                      <span className="font-medium text-gray-800 px-3">{product.quantity}</span>

                      {/* Plus */}
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                        className={`flex items-center justify-center px-3 py-2 bg-gray-100 cursor-pointer transition text-gray-700 rounded-md ${product.quantity === 5
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-yellow-500"
                          }`}
                        disabled={product.quantity === 5}
                      >
                        <AiOutlinePlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index !== cart.length - 1 && (
                <div className="border-b border-gray-300 mt-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* ===== ORDER SUMMARY ===== */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-lg shadow-md flex flex-col gap-3 self-start md:mt-20 -mt-27 mb-10">
          <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>

          <div className="flex justify-between text-gray-700">
            <span>Price (Incl. Tax)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Sales Tax (VAT 15%)</span>
            <span>${salesTax.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          <div className="flex justify-between font-bold text-yellow-500 text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-center">
            <NavLink to="/checkout">
              <MainBtn text={"Proceed to Checkout"} className="w-70 rounded-lg mt-2" />
            </NavLink>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-700 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white max-w-xl max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-50">
                <GoTrash className="text-yellow-500 text-3xl" />
              </div>

              {/* Heading */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Remove Item?
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                This product will be removed from your cart. You can add it again anytime.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {showWishlistConfirm && selectedProduct && (
          <div className="fixed inset-0 z-700 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white max-w-xl max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-50 ">
                <FaRegHeart className="text-yellow-500 text-3xl" />
              </div>

              {/* Heading */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Move to Wishlist?
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Are you sure you want to move this product to your wishlist? It will be removed from your cart.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelMoveToWishlist}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmMoveToWishlist}
                  className="flex-1 py-3 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
                >
                  Yes, Move
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
