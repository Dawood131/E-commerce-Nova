import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../features/Home/pages/Home";
import Cart from "../features/Cart/pages/Cart";
import Wishlist from "../features/Wishlist/pages/Wishlist";
import ProductPage from "../features/Products/pages/ProductPage";
import Search from "../features/Products/pages/Search";
import SignIn from "../features/Auth/pages/SignIn";
import SignUp from "../features/Auth/pages/SignUp";
import ForgotPassword from "../features/Auth/pages/ForgotPassword";
import TrackOrder from "../features/Order/pages/TrackOrder";
import Checkout from "../features/Cart/pages/Checkout";
import Collection from "../features/Products/pages/Collection";
import Category from "../features/Products/pages/Category";

// Layout / Shared Components
import UiModal from "../shared/components/UiModal";
import PageNotFound from "../shared/components/PageNotFound"
import Analytics from "../Analytics";
import { Toaster } from "sonner";

const Router = () => {
  return (
    <>
      <UiModal />
      <Toaster position="top-right" reverseOrder={false} />
      <Analytics />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/trackorder/:trackingId" element={<TrackOrder />} />
        <Route path="/:main/:sub?" element={<Category />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default Router;
