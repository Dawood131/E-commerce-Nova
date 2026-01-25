import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const TopbarTrackorder = () => {
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("novaCurrentUser"));
    if (!currentUser) return;
    const latestOrderId = localStorage.getItem(
      `novaLastTrackingId_${currentUser.email}`
    );
    if (latestOrderId) {
      setTrackingId(latestOrderId); 
    } else {
      setTrackingId("");
    }
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between px-6 lg:px-12 h-10 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-800 text-sm font-medium shadow-sm border-b border-gray-200">
      
      {/* Left Section - Informational Text */}
      <div className="text-gray-700">
        Free Delivery on Orders Above $500
      </div>

      {/* Right Section - Track Order Link */}
      <div className="flex items-center gap-6">
        {trackingId && (
          <NavLink
            to={`/trackorder/${trackingId}`}
            className="relative group text-gray-700 transition-colors duration-300 -ml-20"
          >
            Track Order
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default TopbarTrackorder;
