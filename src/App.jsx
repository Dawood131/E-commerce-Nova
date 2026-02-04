import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Cart from './Pages/Cart'
import Wishlist from './Pages/Wishlist'
import ProductPage from './Pages/ProductPage'
import Search from './Pages/Search';
import SignIn from './Pages/Auth/SignIn';
import SignUp from './Pages/Auth/SignUp';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import TrackOrder from './Pages/TrackOrder'
import UiModal from './components/Modals/UiModal';
import Checkout from './Pages/Checkout';
import Category from './Pages/Collection/Category';
import Collection from './Pages/Collection/Collection';
import { Toaster } from "sonner";

const App = () => {
    return (
        <div>
            <UiModal />
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<Search />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/collection' element={<Collection />} />
                <Route path="/trackorder/:trackingId" element={<TrackOrder />} />
                <Route path="/:main/:sub?" element={<Category />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;
