import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "../../components/Header/Header";
import MainBtn from "../../components/Button/MainBtn";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirm, setShowConfirm] = useState(true);
  const [signupError, setSignupError] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const mediumPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (!mediumPasswordRegex.test(form.password))
      newErrors.password = "Password must be 8+ chars & include letters/numbers";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (newErrors.name) nameRef.current.focus();
    else if (newErrors.email) emailRef.current.focus();
    else if (newErrors.password) passwordRef.current.focus();
    else if (newErrors.confirmPassword) confirmRef.current.focus();

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
    setSignupError("");
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem("novaUsers")) || [];
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      toast.error("Email already registered");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      password: form.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("novaUsers", JSON.stringify(users));
    localStorage.setItem("novaCurrentUser", JSON.stringify(newUser));

    toast.success(`Account created! Welcome, ${newUser.name}!`);
    navigate("/");
  };

  const isFilled = (field) => form[field].length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      <div className="md:hidden  w-full flex justify-center items-center py-2">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12 md:mt-0 -mt-8 md:mb-0 mb-8">
        <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-md rounded-xl">

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-[#d4af37]">Welcome</h1>
            <p className="text-gray-500 text-sm mt-1">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <input
                ref={nameRef}
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder=" "
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] -mb-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              <label className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold
                ${isFilled("name")
                  ? "-top-3 text-xs text-[#d4af37]"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                }`}
              >Full Name</label>
              <p className="text-xs text-red-500 mt-3 min-h-[1rem]">{errors.name}</p>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder=" "
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              <label className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold
                ${isFilled("email")
                  ? "-top-4 text-xs text-[#d4af37]"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                }`}
              >Email</label>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.email}</p>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? "password" : "text"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder=" "
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <label className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold
                ${isFilled("password")
                  ? "-top-3 text-xs text-[#d4af37]"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                }`}
              >Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-6 -translate-y-1/2 text-gray-400 hover:text-[#d4af37] cursor-pointer"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.password}</p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                ref={confirmRef}
                type={!showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder=" "
                className={`peer w-full border-b-2 text-gray-900 py-2 focus:outline-none focus:border-[#d4af37] ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              <label className={`absolute left-0 text-gray-400 text-sm transition-all font-semibold
                ${isFilled("confirmPassword")
                  ? "-top-3 text-xs text-[#d4af37]"
                  : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"
                }`}
              >Confirm Password</label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-6 -translate-y-1/2 text-gray-400 hover:text-[#d4af37] cursor-pointer"
              >
                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
              <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.confirmPassword}</p>
            </div>

            {/* Signup Error */}
            {signupError && <p className="text-sm text-red-500">{signupError}</p>}

            {/* Submit Button */}
            <MainBtn text={"SIGN UP"} className="w-full rounded-md" />
          </form>

          {/* Divider + Sign In link inline */}
          <div className="flex justify-center items-center gap-2 mt-5">
            <span className="text-center text-sm text-gray-500">Already have an account?</span>
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

export default SignUp;
