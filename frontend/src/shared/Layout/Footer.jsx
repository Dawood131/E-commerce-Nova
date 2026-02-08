import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";

// Import images from src/assets (Webpack-friendly)
import logo from "../../../public/logo-header.png";
import visa from "../../../public/products/visa.png";
import mastercard from "../../../public/products/mastercard.jpg";
import paypal from "../../../public/products/paypal.jpg";
import ssl from "../../../public/products/secure.gif";
import MainBtn from "../ui/MainBtn";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-gray-50 text-gray-800 pt-16 pb-2">
            <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-20">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
                    {/* Logo & Description */}
                    <div className="col-span-12 md:col-span-5 flex flex-col items-start">
                        <img
                            src={logo}
                            alt="NOVA Logo"
                            className="h-20 mb-4 cursor-pointer -ml-6"
                            onClick={scrollToTop}
                        />
                        <p className="text-sm w-80 text-gray-600 leading-relaxed">
                            NOVA Clothing delivers modern, high-quality fashion crafted for every lifestyle. Comfort, style & sustainability in every design.
                        </p>
                    </div>

                    {/* Right Sections */}
                    <div className="col-span-12 md:col-span-7 flex flex-col sm:flex-row md:justify-start md:ml-12 gap-8 mt-8 md:mt-0">
                        {/* Help Section */}
                        <div className="flex flex-col flex-1 min-w-[140px]">
                            <h4 className="text-lg font-bold mb-4 -ml-1">Need Help?</h4>
                            <ul className="space-y-2 text-sm">
                                {["FAQs", "Help Center", "Shipping & Returns", "Terms & Conditions", "Privacy Policy", "Disclaimer"].map((item) => (
                                    <li key={item} className="hover:text-yellow-500 transition-all cursor-pointer">
                                        <a href={`/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* More From NOVA */}
                        <div className="flex flex-col flex-1 min-w-[140px]">
                            <h4 className="text-lg font-bold mb-4 -ml-1">More From NOVA</h4>
                            <ul className="space-y-2 text-sm">
                                {["About Us", "Blogs & Style Tips", "Fabric Care Guide", "Sustainability"].map((item) => (
                                    <li key={item} className="hover:text-yellow-500 transition-all cursor-pointer">
                                        <a href={`/${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="flex flex-col flex-1 min-w-[140px]">
                            <h4 className="text-lg font-bold mb-4">Our Socials</h4>
                            <div className="flex space-x-4 text-xl flex-wrap">
                                {[FaInstagram, FaFacebookF, FaTiktok, FaYoutube].map((Icon, i) => (
                                    <a
                                        href="#"
                                        key={i}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-yellow-500 transition transform hover:scale-110 p-1 rounded-full"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="mb-12 text-center">
                    <h4 className="text-lg font-bold mb-3">Get the Latest News</h4>
                    <p className="text-sm mb-4">Subscribe for exclusive launches, offers & updates.</p>
                    <div className="flex justify-center flex-wrap gap-2 md:mx-0 -mx-6">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="md:px-4 px-2 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <MainBtn text={"Subscribe"} className="rounded-sm "/>
                    </div>
                </div>

                {/* Payment & SSL */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-300 py-6 text-sm">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0 flex-wrap justify-center md:justify-start">
                        <span>100% Safe Checkout</span>
                        <div className="flex space-x-2 flex-wrap justify-center md:justify-start">
                            <img src={visa} alt="Visa" className="h-6" />
                            <img src={mastercard} alt="MasterCard" className="h-6" />
                            <img src={paypal} alt="PayPal" className="h-6" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 text-xs justify-center md:justify-end">
                        <span>Secured by</span>
                        <img src={ssl} alt="SSL Seal" className="h-6" />
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center md:mt-6 text-gray-600 text-xs md:mb-6 mb-20">
                    © 2026 NOVA. All Rights Reserved. <br />
                    Fashion that moves with you.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
