import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import MainBtn from "../components/Button/MainBtn";

const ViewTrackOrder = () => {
  const { trackingId: paramTrackingId } = useParams();
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = ["Ordered", "Processed", "Shipped", "Delivered"];

  // Fetch order function
  const fetchOrder = (code = trackingCode) => {
    const strCode = String(code || "").trim().toUpperCase();
    if (!strCode) {
      setError("Please enter a tracking code");
      setOrder(null);
      return;
    }

    setLoading(true);
    const orders = JSON.parse(localStorage.getItem("novaOrders") || "[]");
    const foundOrder = orders.find((o) => o.orderId === strCode);
    if (!foundOrder) {
      setError("Order not found. Please check your tracking code.");
      setOrder(null);
    } else {
      setOrder(foundOrder);
      setError("");
      setTrackingCode(strCode);

      // ✅ Set current step from saved order status
      const savedStepIndex = steps.indexOf(foundOrder.status || "Ordered");
      setCurrentStepIndex(savedStepIndex >= 0 ? savedStepIndex : 0);
    }

    setLoading(false);
  };

  // Auto-fill tracking code from latest order
  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("novaOrders") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("novaCurrentUser"));
    if (!currentUser) return;

    // Get last tracking ID
    let latestOrderId = paramTrackingId
      ? paramTrackingId.trim().toUpperCase()
      : localStorage.getItem(`novaLastTrackingId_${currentUser.email}`);

    if (!latestOrderId) return;

    const foundOrder = allOrders.find((o) => o.orderId === latestOrderId);
    if (foundOrder) {
      setTrackingCode(foundOrder.orderId);
      setOrder(null);
      setCurrentStepIndex(0);
    }
  }, [paramTrackingId]);


  // Auto-progress steps every 5s until Delivered
  useEffect(() => {
    if (!order) return;
    if (currentStepIndex >= steps.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev < steps.length - 1 ? prev + 1 : prev;

        // Update order status in localStorage every step
        const orders = JSON.parse(localStorage.getItem("novaOrders") || "[]");
        const orderIndex = orders.findIndex((o) => o.orderId === order.orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].status = steps[next];
          localStorage.setItem("novaOrders", JSON.stringify(orders));
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order, currentStepIndex]);

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const total = order
    ? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  return (
    <>
      <NavLink to="/" className="shrink-0">
        <img
          src="/logo-header.png"
          alt="Logo"
          className="md:h-24 h-14 w-fit mx-auto mt-2"
        />
      </NavLink>
      <div className="max-w-5xl mx-auto p-6 ">
        {/* Track Input */}
        {!order && (
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto flex flex-col items-center mt-10">
            <label className="block text-gray-800 font-bold md:text-3xl text-2xl mb-10 text-center w-150">
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
              <p className="text-red-500 text-sm mb-6 text-center">{error}</p>
            )}

            <div className="w-full flex justify-center mt-4">
              <MainBtn
                text={loading ? "Tracking..." : "Track Order"}
                className="w-60 rounded-lg"
                onClick={() => fetchOrder(trackingCode)}
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
                <span className="text-gray-900">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-700">Order Date:</span>
                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Current Status:</span>
                <span className="text-yellow-500 font-semibold">
                  {steps[currentStepIndex]}
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

                    <div className="mt-2 text-sm text-gray-700 font-semibold">
                      {step}
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 right-0 w-full h-1 border-t-2
                      ${index < currentStepIndex ? "border-yellow-500" : "border-gray-300"}`}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Order Items</h2>

              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 border-b border-b-gray-400 last:border-none"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800">${item.price}</div>
                </div>
              ))}

              <div className="flex justify-between mt-4 font-bold text-lg">
                <span>Total</span>
                <span>${total}</span>
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
    </>
  );
};

export default ViewTrackOrder;
