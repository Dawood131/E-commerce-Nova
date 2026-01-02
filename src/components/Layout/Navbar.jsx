import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineChevronDown
} from "react-icons/hi";
import { CgMenuLeft } from "react-icons/cg";
import { TbCircleArrowRightFilled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [shadow, setShadow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Redux state
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const desktopLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const mobileItems = [
    { icon: CgMenuLeft, label: "Menu" },
    { icon: HiOutlineShoppingBag, label: "Bag", path: "/cart" },
    { icon: HiOutlineHome, label: "Home", path: "/" },
    { icon: HiOutlineSearch, label: "Search", path: "/search" },
    { icon: HiOutlineUser, label: "Account", path: "/login" }
  ];

  const collectionSections = ["Men", "Women", "Kids"];

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:flex fixed w-full bg-white text-black z-200 transition-shadow duration-300 ${shadow ? "shadow-md" : ""
          }`}
      >
        <div className="container mx-auto px-6 py-2 flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0">
            <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
          </NavLink>

          {/* Links */}
          <ul className="flex space-x-12 font-medium text-lg">
            {desktopLinks.map((link) => {
              const isCollection = link.name === "Collection";
              return (
                <li key={link.name} className="relative group">
                  <NavLink to={link.path} className="transition-colors duration-300">
                    {link.name}
                  </NavLink>

                  {/* Collection Dropdown */}
                  {isCollection && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 rounded-lg">
                      <div className="grid grid-cols-3 divide-x divide-gray-200 text-center p-3">
                        {collectionSections.map((section) => (
                          <NavLink
                            key={section}
                            to={`/collection/${section.toLowerCase()}`}
                            className="py-1 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-semibold text-base transition-all duration-200 transform hover:scale-105"
                          >
                            {section}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-500 transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  ></span>
                </li>
              );
            })}
          </ul>

          {/* Icons */}
          <div className="flex items-center space-x-6 text-2xl">
            {/* Search */}
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `cursor-pointer transition-colors duration-300 ${isActive ? "text-yellow-600" : "hover:text-yellow-500"
                }`
              }
            >
              <HiOutlineSearch />
            </NavLink>

            {/* Wishlist */}
            <NavLink to="/wishlist" className={({ isActive }) =>
              ` relative cursor-pointer transition-colors duration-300 ${isActive ? "text-yellow-600" : "hover:text-yellow-500"
              }`
            }>
              <FaRegHeart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </NavLink>

            {/* Cart */}
            <NavLink to="/cart" className={({ isActive }) =>
              ` relative cursor-pointer transition-colors duration-300 ${isActive ? "text-yellow-600" : "hover:text-yellow-500"
              }`
            }>
              <HiOutlineShoppingBag />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>

            {/* Account */}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `cursor-pointer transition-colors duration-300 ${isActive ? "text-yellow-600" : "hover:text-yellow-500"
                }`
              }
            >
              <HiOutlineUser />
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      {location.pathname === "/" ? (
        <div className="md:hidden fixed top-0 left-0 w-full flex justify-center items-center z-50">
          <NavLink to="/">
            <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
          </NavLink>
        </div>
      ) : (
        <div className="md:hidden relative w-full flex justify-center items-center py-2">
          <NavLink to="/">
            <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
          </NavLink>
        </div>
      )}

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white text-black border-t border-gray-300">
        <div className="flex justify-between px-5 py-2 -ml-1">
          {mobileItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const isMenu = item.label === "Menu";

            const circleClass =
              "relative flex flex-col items-center justify-center w-15 h-12 rounded-2xl transition-all duration-300";

            if (isMenu) {
              return (
                <button
                  ref={menuButtonRef}
                  key={idx}
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className={`${circleClass} ${mobileMenuOpen ? "bg-yellow-500 text-white" : "text-gray-500 hover:text-yellow-500"
                    }`}
                >
                  {item.icon && <item.icon className="text-2xl" />}
                  <span className="text-xs mt-0.5">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.path}
                className={`${circleClass} ${isActive ? "bg-yellow-500 text-white" : "text-gray-500 hover:text-yellow-500"
                  }`}
              >
                {item.icon && <item.icon className="text-2xl" />}
                <span className="text-xs mt-0.5">{item.label}</span>

                {/* Badge for cart & wishlist */}
                {item.label === "Bag" && cartItems.length > 0 && (
                  <span className="absolute -top-0.5 right-3 bg-yellow-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                {item.label === "Wishlist" && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`fixed bottom-16 left-0 w-full max-h-[70%] bg-white z-20 transform transition-transform duration-300 rounded-t-4xl shadow-lg overflow-auto md:hidden ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="flex justify-center py-3">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl text-gray-500 hover:text-yellow-500"
          >
            <HiOutlineChevronDown className="h-6 w-6" />
          </button>
        </div>

        {/* Collection & Sections */}
        <div className="mb-4 px-4">
          <NavLink
            to="/collection"
            className="py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-semibold transition-all duration-200 flex justify-between items-center -ml-0.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Collection
            <span className="text-yellow-600 font-bold mr-0.2">
              <TbCircleArrowRightFilled />
            </span>
          </NavLink>
        </div>

        <div className="mb-4 px-4 flex flex-col space-y-2">
          {collectionSections.map((section) => (
            <NavLink
              key={section}
              to={`/collection/${section.toLowerCase()}`}
              className="py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-medium transition-all duration-200 flex justify-between items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {section}
              <span className="text-yellow-600 font-bold">
                <TbCircleArrowRightFilled />
              </span>
            </NavLink>
          ))}
        </div>

        {/* Wishlist */}
        <div className="my-2 border-t border-gray-300 w-80 mx-auto"></div>
        <div className="px-4">
          <NavLink
            to="/wishlist"
            className="relative py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-medium transition-all duration-200 flex justify-between items-center mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Wishlist
            <span className="text-yellow-600 font-bold">
              <FaRegHeart className="h-5 w-5" />
            </span>
            {wishlistItems.length > 0 && (
              <span className="absolute top-1.5 -right-0.5 bg-yellow-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </NavLink>
        </div>


        {/* About / Contact / Track Order */}
        <div className="my-2 border-t border-gray-300 w-80 mx-auto"></div>
        <div className="px-4 flex flex-col space-y-2">

           <NavLink
            to="/trackorder" 
            className="relative py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-medium transition-all duration-200 flex justify-between items-center mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Track Order
            <span className="text-yellow-600 font-bold">
              <TbCircleArrowRightFilled />
            </span>
          </NavLink>

          <NavLink
            to="/about"
            className="py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-medium transition-all duration-200 flex justify-between items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
            <span className="text-yellow-600 font-bold">
              <TbCircleArrowRightFilled />
            </span>
          </NavLink>
          <NavLink
            to="/contact"
            className="py-3 px-2 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 font-medium transition-all duration-200 flex justify-between items-center mb-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
            <span className="text-yellow-600 font-bold">
              <TbCircleArrowRightFilled />
            </span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
