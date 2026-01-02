import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Collection from './Pages/Collection'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Wishlist from './Pages/Wishlist'
import Orders from './Pages/Orders'
import PlaceOrder from './Pages/PlaceOrder'
import Products from './Pages/Products'
import Search from './Pages/Search';
import Login from './Auth/Login';
import TrackOrder from './Pages/TrackOrder'

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/collection' element={<Collection />} />
                <Route path='/search' element={<Search />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/place-order' element={<PlaceOrder />} />
                <Route path='/products' element={<Products />} />
                <Route path='/login' element={<Login />} />
                <Route path='/trackorder' element={<TrackOrder />} />
            </Routes>
        </div>
    );
}

export default App;
