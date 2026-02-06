import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "../../components/Header/Header";
import MainBtn from "../../components/Button/MainBtn";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();

  // Load saved email/password from localStorage (if not expired)
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const saved = JSON.parse(localStorage.getItem("novaRemember")) || null;
    if (saved) {
      const now = new Date().getTime();
      if (now - saved.timestamp < 24 * 60 * 60 * 1000) {
        setForm({ email: saved.email, password: saved.password });
      } else {
        localStorage.removeItem("novaRemember");
      }
    }
  }, []);


  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(""); // reset previous error
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem("novaUsers")) || [];
    const user = users.find((u) => u.email === form.email);

    if (!user) {
      // User email not found
      setLoginError("Email not registered. Please Sign Up!");
    } else if (user.password !== form.password) {
      // Password mismatch
      setLoginError("Incorrect password. Try again!");
    } else {
      // Successful login
      localStorage.setItem("novaCurrentUser", JSON.stringify(user));
      localStorage.setItem(
        "novaRemember",
        JSON.stringify({ email: form.email, password: form.password, timestamp: new Date().getTime() })
      );
      toast.success(`Welcome back, ${user.name || "User"}!`);
      navigate("/");
    }
  };


  const isFilled = (field) => form[field].length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      <div className="md:hidden w-full flex justify-center items-center py-2">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12 md:mt-0 -mt-30">
        <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-md rounded-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-[#d4af37]">Welcome</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder=" "
                required
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <label
                className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold ${isFilled("email")
                  ? "-top-4 text-xs text-[#d4af37] font-semibold"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                  }`}
              >
                Email
              </label>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.email}</p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "password" : "text"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder=" "
                required
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <label
                className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold ${isFilled("password")
                  ? "-top-3 text-xs text-[#d4af37] font-semibold"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs font-semibold"
                  }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-6 -translate-y-1/2 text-gray-400 hover:text-[#d4af37] cursor-pointer"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.password}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center -mt-4 w-full">
              <p className="md:text-sm text-[12px] text-red-500 min-h-[1rem] mb-1 md:mb-0 flex-1">
                {loginError}
              </p>
              <NavLink
                to="/forgot-password"
                className="text-sm  text-gray-500 hover:text-[#d4af37] self-end md:self-auto"
              >
                Forgot password?
              </NavLink>
            </div>



            <MainBtn text={"SIGN IN"} className="w-full rounded-md" />
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400">New to NOVA?</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex justify-center items-center gap-2 mt-5">
            <p className="text-center text-sm text-gray-500">
              Don't have account?{" "}
              <NavLink
                to="/signup"
                className="text-[#d4af37] font-semibold hover:underline"
              >
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
