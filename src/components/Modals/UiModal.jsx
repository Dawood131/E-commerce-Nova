import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../redux/uiModalSlice";
import { useNavigate } from "react-router-dom";

const UiModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, type, product } = useSelector((state) => state.uiModal);

  // Auto close after 4s
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => dispatch(closeModal()), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleBackdropClick = () => dispatch(closeModal());
  const handleNavigate = (path) => {
    dispatch(closeModal());
    if (path === "current") {
      navigate(window.location.pathname);
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="fixed inset-0 z-700 flex items-center justify-center bg-black/25 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-5 flex flex-col md:flex-row items-center md:items-start shadow-2xl relative transform scale-95 opacity-0 animate-modalIn transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeModal())}
          className="md:hidden absolute top-3 right-4 text-gray-400 hover:text-gray-700 transition text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Product Image */}
        {product && (
          <img
            src={Array.isArray(product.image) ? product.image[0] : product.image}
            alt={product.name}
            className="h-28 w-28 md:h-32 md:w-32 object-cover rounded-xl shadow-xl border border-gray-100 mb-4 md:mb-0 md:mr-6 transform hover:scale-105 transition duration-300"
          />
        )}

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Product Name */}
          {product && (
            <p className="text-sm md:text-lg font-semibold text-gray-700 mb-1 truncate">
              {product.name}
            </p>
          )}

          {/* Message */}
          <p className="text-sm text-gray-700 mb-4">
            {type === "cart"
              ? "Item successfully added to your shopping bag"
              : "Item successfully saved to your wishlist"}
          </p>

          {/* Buttons */}
          {type === "cart" ? (
            <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-4">
              <button
                onClick={() => handleNavigate("current")}
                className="w-full md:flex-1 py-3 px-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => handleNavigate("/cart")}
                className="w-full md:flex-1 py-3 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
              >
                View Bag
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavigate("/wishlist")}
              className="md:w-full w-70 py-3 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
            >
              View Wishlist
            </button>
          )}
        </div>

        {/* Tailwind Animation */}
        <style>
          {`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.9); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-modalIn {
              animation: modalIn 0.25s ease-out forwards;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default UiModal;
