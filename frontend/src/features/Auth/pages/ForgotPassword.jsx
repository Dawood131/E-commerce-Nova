import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "../../../shared/components/Header";
import MainBtn from "../../../shared/ui/MainBtn";

const ForgotPassword = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem("novaUsers")) || [];
    const user = users.find((u) => u.email === email);

    if (user) {
      // For demo, show password
      setMessage(`Your password is: ${user.password}`);
    } else {
      setErrors({ email: "Email not found" });
    }
  };

  const isFilled = () => email.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      <div className="md:hidden w-full flex justify-center items-center py-2">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12 md:mt-0 -mt-30">
        {/* Card */}
        <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-md rounded-xl">
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-[#d4af37]">
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <label
                className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold ${isFilled()
                  ? "-top-4 text-xs text-[#d4af37]"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                  }`}
              >
                Email
              </label>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                {errors.email}
              </p>
            </div>

            {/* Message */}
            {message && (
              <p className="text-xs text-green-500 mt-1 min-h-[1rem]">{message}</p>
            )}

            {/* Submit Button */}
            <MainBtn text={"Send Reset Link"} className="w-full rounded-md" />
          </form>

          {/* Divider + Sign In link inline */}
          <div className="flex justify-center items-center gap-2 mt-5">
            <span className="text-center text-sm text-gray-500">Remembered your password?</span>
            <NavLink
              to="/signin"
              className="text-[#d4af37] font-semibold hover:underline"
            >
              Sign in
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
