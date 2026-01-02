import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MainBtn from "../components/Button/MainBtn";

const ViewTrackOrder = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // Fetch order with validation
  const [loading, setLoading] = useState(false);

  const fetchOrder = () => {
    if (!trackingCode.trim()) {
      setError("Please enter a tracking code");
      return;
    }
    if (loading) return;

    setLoading(true);
    setError("");

    setOrder({
      id: trackingCode,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Shipped",
      items: [
        { name: "Men Round Neck Pure Cotton T-shirt", qty: 1, price: 200 },
        { name: "Girls Round Neck Cotton Top", qty: 2, price: 140 },
      ],
    });

    setLoading(false);
  };

  const steps = ["Ordered", "Processed", "Shipped", "Delivered"];
  const currentStepIndex = order ? steps.indexOf(order.status) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <NavLink to="/" className="shrink-0">
        <img
          src="/logo-header.png"
          alt="Logo"
          className="h-24 w-fit mx-auto"
        />
      </NavLink>

      {/* Track Input */}
      {!order && (
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto flex flex-col items-center mt-10">
          <label className="block text-gray-800 font-bold text-3xl mb-10 text-center">
            Enter Tracking Code
          </label>

          <input
            type="text"
            value={trackingCode}
            onChange={(e) => {
              setTrackingCode(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g., ORD123456"
            className={`w-full px-3 py-1 border-b-2 transition
              ${error ? "border-red-500" : "border-gray-800"}
              focus:border-yellow-400 focus:outline-none
              text-gray-800 placeholder-gray-400 mb-2
            `}
          />

          {error && (
            <p className="text-red-500 text-sm mb-6 text-center">
              {error}
            </p>
          )}

          <div className="w-full flex justify-center mt-4">
            <MainBtn
              text={loading ? "Tracking..." : "Track Order"}
              className="w-60 rounded-lg"
              onClick={fetchOrder}
            />
          </div>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="max-w-2xl mx-auto mt-10 space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Order ID:</span>
              <span className="text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Order Date:</span>
              <span className="text-gray-900">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">
                Current Status:
              </span>
              <span className="text-yellow-500 font-semibold">
                {order.status}
              </span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 text-gray-800">
              Order Progress
            </h2>

            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => (
                <div key={step} className="flex-1 relative text-center">
                  <div
                    className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                    ${index <= currentStepIndex ? "bg-yellow-500" : "bg-gray-300"}`}
                  >
                    {index + 1}
                  </div>

                  <div className="mt-2 text-sm text-gray-700 font-semibold">{step}</div>

                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 right-0 w-full h-1 border-t-2
                      ${index < currentStepIndex
                          ? "border-yellow-500"
                          : "border-gray-300"
                        }`}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Order Items
            </h2>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between py-3 border-b last:border-none"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Quantity: {item.qty}
                  </div>
                </div>
                <div className="font-semibold text-gray-800">
                  ${item.price}
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Total</span>
              <span>
                $
                {order.items.reduce(
                  (acc, item) => acc + item.price * item.qty,
                  0
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <NavLink to="/">
              <MainBtn text={"Continue Shopping"} className="w-60 rounded-lg" />
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTrackOrder;
