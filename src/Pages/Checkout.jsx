import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header/Header";
import Footer from "../components/Layout/Footer";
import MainBtn from "../components/Button/MainBtn";
import { useNavigate, NavLink, } from "react-router-dom";
import { toast } from "sonner";
import { clearCart } from "../redux/cartSlice";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";


const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Pakistan",
    "India",
    "Japan",
    "Brazil"
];

// Mapping of each country to 10 famous cities
const countryCities = {
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Edinburgh", "Glasgow", "Bristol", "Cardiff", "Belfast"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Quebec City", "Winnipeg", "Hamilton", "Halifax"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart", "Darwin", "Newcastle"],
    "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf", "Dresden", "Leipzig", "Nuremberg"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
    "Pakistan": ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"],
    "India": ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"],
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo", "Fukuoka", "Hiroshima", "Sendai", "Kobe", "Yokohama"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"]
};


const CheckoutPage = () => {
    const cart = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        postalCode: "",
        phone: "",
    });

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [trackingId, setTrackingId] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);


    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("checkoutData");

        if (saved) {
            const parsed = JSON.parse(saved);

            setForm(parsed.form || {});
            setSelectedCountry(parsed.country || null);
            setSelectedCity(parsed.city || null);
            setSaveInfo(true);
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("novaCurrentUser"));
        if (user) {
            setForm((prev) => ({
                ...prev,
                email: user.email,
            }));
        }
    }, []);

    // Validation function
    const validate = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";

        if (!form.firstName) newErrors.firstName = "First name is required";
        if (!form.lastName) newErrors.lastName = "Last name is required";
        if (!form.address) newErrors.address = "Address is required";
        if (!form.phone) newErrors.phone = "Phone is required";
        if (!selectedCountry) newErrors.country = "Country is required";
        if (!selectedCity) newErrors.city = "City is required";

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

    useEffect(() => {
        const data = {
            form,
            country: selectedCountry,
            city: selectedCity,
        };
        localStorage.setItem("checkoutData", JSON.stringify(data));
    }, [form, selectedCountry, selectedCity]);

    const placeOrder = () => {
        if (!validate()) return;

        const loggedInUser = JSON.parse(localStorage.getItem("novaCurrentUser"));

        if (!loggedInUser) {
            toast.error("Please sign in or create an account to place your order.");
            navigate("/signin");
            return;
        }

        // Generate tracking ID
        const id = uuidv4().slice(0, 8).toUpperCase();
        setTrackingId(id);

        // Save order
        const orderData = {
            orderId: id,
            userId: loggedInUser.id,
            userEmail: loggedInUser.email,
            items: cart,
            total,
            shipping: form,
            payment: form.payment,
            status: "Ordered",
            createdAt: new Date().toISOString(),
        };

        const allOrders = JSON.parse(localStorage.getItem("novaOrders") || "[]");
        allOrders.push(orderData);
        localStorage.setItem("novaOrders", JSON.stringify(allOrders));
        localStorage.setItem(
            `novaLastTrackingId_${loggedInUser.email}`,
            id
        );
        dispatch(clearCart());
        setShowSuccess(true);
    };

    const countryOptions = countries.map(c => ({ value: c, label: c }));
    const cityOptions = selectedCountry
        ? countryCities[selectedCountry.value].map(city => ({ value: city, label: city }))
        : [];
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#d4af37" : "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#d4af37" },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "#f3f4f6" // hover
                : state.isSelected
                    ? "#fef3c7" // selected
                    : "white",
            color: state.isFocused || state.isSelected ? "black" : "#333",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "#f3f4f6",
                color: "black",
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: "#333",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
        }),
    };


    // Floating label helper
    const isFilled = (field) => form[field]?.length > 0;

    return (
        <div className="min-h-screenflex flex-col">
            <div className="md:hidden  w-full flex justify-center items-center py-2">
                <NavLink to="/">
                    <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
                </NavLink>
            </div>
            <Header />

            {/* MOBILE COLLAPSIBLE ORDER SUMMARY */}
            <div className="lg:hidden w-full px-4 mt-4">
                {/* HEADER */}
                <button
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="w-full bg-white rounded-2xl shadow-md px-4 py-4 flex items-center justify-between active:scale-[0.99] transition"
                >
                    {/* LEFT — Summary + Arrow */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-base">
                            Order Summary
                        </span>

                        <span
                            className={`text-gray-600 text-lg transition-transform duration-300 ${showOrderSummary ? "rotate-180" : ""
                                }`}
                        >
                            ▾
                        </span>

                        <span className="text-sm text-gray-500">
                            ({cart.length})
                        </span>
                    </div>

                    {/* RIGHT — Total */}
                    <div className="font-bold text-yellow-500 text-lg">
                        ${total.toFixed(2)}
                    </div>
                </button>

                {/* DROPDOWN */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${showOrderSummary
                        ? "max-h-[1200px] opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4 mb-1">
                        {/* ITEMS */}
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                            >
                                <img
                                    src={item.image?.[0] || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-lg object-cover"
                                />

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Size: {item.selectedSize} · Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900 text-sm">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}

                        {/* TOTALS */}
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Tax (15%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-yellow-500 text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div
                className="lg:grid max-w-7xl mx-auto w-full px-4 py-10 grid-cols-[1.3fr_0.9fr] gap-10"
                style={{ height: 'calc(100vh - 80px)' }}
            >
                {/* LEFT SIDE - Checkout Form */}
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-10 overflow-y-auto max-h-full scrollbar-hide">
                    {/* CONTACT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold mb-6">Contact</h2>

                        {/* Email */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder=" "
                                value={form.email}
                                readOnly={!!localStorage.getItem("novaCurrentUser")} 
                                onChange={(e) => {
                                    const email = e.target.value;
                                    setForm({ ...form, email });

                                    const allData = JSON.parse(localStorage.getItem("checkoutDataByEmail") || "{}");

                                    if (allData[email]) {
                                        // Autofill form fields but do NOT check checkbox
                                        setForm(allData[email].form || {});
                                        setSelectedCountry(allData[email].country || null);
                                        setSelectedCity(allData[email].city || null);

                                        // Important: don't auto-check saveInfo
                                        setSaveInfo(false);
                                    } else {
                                        setSelectedCountry(null);
                                        setSelectedCity(null);
                                        setSaveInfo(false);
                                    }
                                }}
                                className={`peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] ${errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            <label className={`absolute left-0 text-gray-400 text-sm transition-all
        ${isFilled("email") ? "-top-4 text-xs text-[#d4af37]" : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                            >
                                Email*
                            </label>
                            <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.email}</p>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-gray-600 -mt-3">
                            <input type="checkbox" />
                            Email me with news and offers
                        </label>
                    </section>

                    {/* DELIVERY */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Delivery</h2>

                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {["firstName", "lastName"].map((field) => (
                                <div key={field} className="relative">
                                    <input
                                        placeholder=" "
                                        value={form[field]}
                                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                        className={`peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] ${errors[field] ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <label
                                        className={`absolute left-0 text-gray-400 text-sm transition-all
            ${isFilled(field) ? "-top-4 text-xs text-[#d4af37]" : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                                    >
                                        {field === "firstName" ? "First Name*" : "Last Name*"}
                                    </label>
                                    <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors[field]}</p>
                                </div>
                            ))}
                        </div>
                        {/* Country & City */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Country */}
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">
                                    Country<span className="text-red-500">*</span>
                                </label>

                                <Select
                                    options={countryOptions}
                                    value={selectedCountry}
                                    onChange={(country) => {
                                        setSelectedCountry(country);
                                        setSelectedCity(null); // reset city
                                    }}
                                    placeholder="Select country"
                                    isSearchable
                                    styles={customSelectStyles}
                                />

                                <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                                    {errors.country}
                                </p>
                            </div>

                            {/* City */}
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">
                                    City<span className="text-red-500">*</span>
                                </label>

                                <Select
                                    options={cityOptions}
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    placeholder={
                                        selectedCountry ? "Select city" : "Select country first"
                                    }
                                    isDisabled={!selectedCountry}
                                    isSearchable={!!selectedCountry}
                                    styles={customSelectStyles}
                                />

                                <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                                    {errors.city}
                                </p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="relative mt-4">
                            <input
                                placeholder=" "
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className={`peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] ${errors.address ? "border-red-500" : "border-gray-300"}`}
                            />
                            <label className={`absolute left-0 text-gray-400 text-sm transition-all
        ${isFilled("address") ? "-top-4 text-xs text-[#d4af37]" : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                            >
                                Address*
                            </label>
                            <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.address}</p>
                        </div>

                        {/* Apartment */}
                        <div className="relative mt-4">
                            <input
                                placeholder=" "
                                value={form.apartment}
                                onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                                className="peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] border-gray-300"
                            />
                            <label className={`absolute left-0 text-gray-400 text-sm transition-all
        ${isFilled("apartment") ? "-top-4 text-xs text-[#d4af37]" : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                            >
                                Apartment, suite, etc. (optional)
                            </label>
                        </div>

                        {/* Postal & Phone */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="relative">
                                <input
                                    placeholder=" "
                                    value={form.postalCode}
                                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                                    className="peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] border-gray-300"
                                />
                                <label className={`absolute left-0 text-gray-400 text-sm transition-all
          ${isFilled("postalCode") ? "-top-4 text-xs text-[#d4af37]" : "top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                                >
                                    Postal code
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    placeholder=" "
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className={`peer w-full border-b-2 py-2 focus:outline-none focus:border-[#d4af37] ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                                />
                                <label className={`absolute left-0 text-gray-400 text-sm transition-all
          ${isFilled("phone") ? "-top-4 text-xs text-[#d4af37]" : "top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-[#d4af37] peer-focus:text-xs"}`}
                                >
                                    Phone*
                                </label>
                                <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.phone}</p>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                            <input
                                type="checkbox"
                                checked={saveInfo}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSaveInfo(checked);

                                    if (!form.email) return toast.error("Enter your email to save data");

                                    const allData = JSON.parse(localStorage.getItem("checkoutDataByEmail") || "{}");

                                    if (checked) {
                                        // Save or update new data
                                        allData[form.email] = {
                                            form,
                                            country: selectedCountry,
                                            city: selectedCity
                                        };
                                        localStorage.setItem("checkoutDataByEmail", JSON.stringify(allData));
                                        toast.success("Information saved/updated!");
                                    } else {
                                        // Remove saved info
                                        delete allData[form.email];
                                        localStorage.setItem("checkoutDataByEmail", JSON.stringify(allData));
                                        toast.success("Saved information removed!");
                                    }
                                }}
                            />

                            Save this information for next time
                        </label>
                    </section>

                    {/* PAYMENT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Payment</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            All transactions are secure and encrypted.
                        </p>

                        <div className="space-y-3">
                            {/* Online Payment */}
                            <label
                                className={`flex gap-3 items-start cursor-pointer p-3 rounded-md border transition-colors ${form.payment === "online" ? "border-[#d4af37] bg-gray-50" : "border-gray-300 hover:border-[#d4af37]"
                                    }`}
                                onClick={() => setForm({ ...form, payment: "online" })}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={form.payment === "online"}
                                    onChange={() => setForm({ ...form, payment: "online" })}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium">Online Payment</p>
                                    <p className="text-sm text-gray-500">Pay via Debit / Credit / Wallet / Bank Account</p>
                                </div>
                            </label>

                            {/* Cash on Delivery */}
                            <label
                                className={`flex gap-3 items-start cursor-pointer p-3 rounded-md border transition-colors ${form.payment === "cod" ? "border-[#d4af37] bg-gray-50" : "border-gray-300 hover:border-[#d4af37]"
                                    }`}
                                onClick={() => setForm({ ...form, payment: "cod" })}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={form.payment === "cod"}
                                    onChange={() => setForm({ ...form, payment: "cod" })}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium">Cash on Delivery (COD)</p>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* BILLING ADDRESS */}
                    <section className="space-y-3 mt-6">
                        <h2 className="text-xl font-semibold mb-2">Billing address</h2>
                        <label
                            className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${form.billing === "same"
                                ? "border-[#d4af37] bg-gray-50"
                                : "border-gray-300 hover:border-[#d4af37]"
                                }`}
                            onClick={() => setForm({ ...form, billing: "same" })}
                        >
                            <input
                                type="radio"
                                name="billing"
                                checked={form.billing === "same"}
                                onChange={() => setForm({ ...form, billing: "same" })}
                            />
                            <span className="text-sm">Same as shipping address</span>
                        </label>
                        <MainBtn text={"Place Order"} className="w-full mt-2 rounded-md" onClick={placeOrder} />
                    </section>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden sm:block bg-white rounded-2xl shadow-lg p-6 self-start w-full lg:w-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <h3 className="font-semibold text-lg text-gray-800">Your Bag ({cart.length})</h3>
                    </div>

                    {/* Items */}
                    <div className={`flex flex-col gap-3 ${cart.length > 3 ? "max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hide" : ""}`}>
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm mb-5"
                            >
                                <img
                                    src={item.image?.[0] || "/placeholder.png"}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    alt={item.name}
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Size: {item.selectedSize}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Tax (15%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-yellow-500 text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 max-w-xl w-full animate-scaleIn">

                        {/* Success Icon */}
                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100 shadow-inner">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-14 w-14 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-3">
                            Order Placed Successfully!
                        </h2>

                        {/* Subheading */}
                        <p className="text-gray-600 text-center mb-5 text-lg">
                            Thank you for your purchase. Your order is confirmed.
                        </p>

                        {/* Tracking ID */}
                        <div className="text-center mb-8">
                            <span className="text-gray-700 font-semibold">Tracking ID:</span>{" "}
                            <span className="text-yellow-500 font-bold text-xl">{trackingId}</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    navigate(`/trackorder/${trackingId}`);
                                }}
                                className="flex-1 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                            >
                                Track Order
                            </button>

                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    navigate("/");
                                }}
                                className="flex-1 py-4 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
