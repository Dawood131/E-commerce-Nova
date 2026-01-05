import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Header from "../components/Header.jsx/Header";
import Footer from "../components/Layout/Footer";
import MainBtn from "../components/Button/MainBtn";
import { toggleWishlist } from "../redux/wishlistSlice";
import { HiOutlineHeart } from "react-icons/hi";

const Wishlist = () => {
  const dispatch = useDispatch();

  // wishlist IDs
  const wishlistIds = useSelector((state) => state.wishlist.items);

  // all products (adjust path if needed)
  const products = useSelector((state) => state.products?.items || []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // match IDs with products
  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p.id)
  );

  // ===== EMPTY STATE =====
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-20 mt-10">
          <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl max-w-4xl w-full p-8 gap-8">

            {/* Left: Illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="flex items-center justify-center md:w-64 w-44 md:h-64 h-44 rounded-full bg-yellow-50 shadow-inner">
                <HiOutlineHeart className="md:text-[160px] text-[120px] text-gray-300 text-yellow-500" />
              </div>
            </div>

            {/* Right: Text & Button */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-600 text-center md:text-left text-lg">
                Looks like you haven’t added any items to your wishlist yet. Explore our collections to find your favorites and start adding them now!
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile Logo */}
      <div className="md:hidden w-full flex justify-center items-center py-2">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Items you love & saved for later
            </p>
          </div>

          <div className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold">
            {wishlistProducts.length}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
            >
              <NavLink to={`/product/${product.id}`}>
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-lg"
                />
              </NavLink>

              <div className="mt-4 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {product.name}
                </h3>

                <p className="font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>

                <button
                  onClick={() => dispatch(toggleWishlist(product.id))}
                  className="mt-auto text-sm font-semibold text-red-500 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
