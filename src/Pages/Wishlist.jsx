import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Layout/Footer";
import MainBtn from "../components/Button/MainBtn";
import { toggleWishlist } from "../redux/wishlistSlice";
import { HiOutlineHeart } from "react-icons/hi";
import ProductCard from "../components/Products/ProductCard";

const Wishlist = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wishlistProducts = useSelector((state) => state.wishlist.items);

  if (wishlistProducts.length === 0) {
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

            <div className="w-full md:w-1/2 flex justify-center">
              <div className="flex items-center justify-center md:w-64 w-44 md:h-64 h-44 rounded-full bg-yellow-50 shadow-inner">
                <HiOutlineHeart className="md:text-[160px] text-[120px] text-gray-300 text-yellow-500" />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4">
              <h1 className="text-[24px] md:text-3xl font-extrabold text-gray-800">
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
    <div className="min-h-screen">
      <Header />

      <div className="md:hidden w-full flex justify-center items-center py-2">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
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

      </div>

      {/* PRODUCTS GRID (border ke niche) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 md:px-20 px-4 -mt-5 mb-25">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>


      <Footer />
    </div>
  );
};

export default Wishlist;
