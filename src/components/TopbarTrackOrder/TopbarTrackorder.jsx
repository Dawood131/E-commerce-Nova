import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const TopbarTrackorder = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("novaCurrentUser"));
    if (!currentUser) return;
    const latestOrderId = localStorage.getItem(
      `novaLastTrackingId_${currentUser.email}`
    );
    if (latestOrderId) setTrackingId(latestOrderId);
  }, []);

  const handleTrackClick = () => {
    if (trackingId) {
      // agar ID available → direct order page
      navigate(`/trackorder/${trackingId}`);
    } else {
      // agar ID nahi → input prompt ya modal open
      const userInput = prompt("Enter your tracking ID:");
      if (userInput) navigate(`/trackorder/${userInput}`);
    }
  };

  return (
    <div className="hidden md:flex items-center justify-between px-6 lg:px-12 h-10 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-800 text-sm font-medium shadow-sm border-b border-gray-200">
      <div className="text-gray-700">Free Delivery on Orders Above $500</div>

      <div className="flex items-center gap-6">
        <button
          onClick={handleTrackClick}
          className="relative group text-gray-700 transition-colors duration-300 cursor-pointer"
        >
          Track Order
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default TopbarTrackorder;
