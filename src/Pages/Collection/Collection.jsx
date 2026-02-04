import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Layout/Footer";
import productsData from "../../components/data/products";
import ProductList from "../../components/Products/ProductList";
import Select from "react-select";
import { MdOutlineFilterList } from "react-icons/md";
import { Grid4, Grid3, Grid2, List } from "../../assets/Icons";

/* -------------------- CONSTANTS -------------------- */

const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "New Arrival" },
    { value: "bestseller", label: "Bestsellers" },
];

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: "38px",
        borderRadius: "0.5rem",
        borderColor: state.isFocused ? "#d4af37" : "#d1d5db",
        boxShadow: "none",
        "&:hover": { borderColor: "#d4af37" },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? "#f3f4f6"
            : state.isSelected
                ? "#fef3c7"
                : "white",
        color: "#333",
        cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "#333" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    menu: (base) => ({ ...base, borderRadius: "0.5rem" }),
    menuList: (base) => ({ ...base, padding: 0 }),
};

const MIN_PRICE = 0;
const MAX_PRICE = 500;
const MIN_GAP = 10;

const collectionImages = {
    "All Products": "/products/all.jpg",
    Men: "/products/man.jpg",
    Women: "/products/woman.jpg",
    Kids: "/products/p_img38.png",
};

const circles = ["All Products", "Men", "Women", "Kids"];

/* -------------------- COMPONENT -------------------- */

const Collection = () => {
    const navigate = useNavigate();

    const [filteredProducts, setFilteredProducts] = useState(productsData);
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState(
        window.innerWidth >= 768 ? "grid-4" : "grid-2"
    );
    const [loading, setLoading] = useState(true);

    /* FILTER STATES */
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
    const [tempPriceRange, setTempPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [baseProducts, setBaseProducts] = useState(productsData);

    /* PRICE SLIDER */
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const activeThumb = useRef(null);
    const toggleSubCategory = (subCat) => {
        setFilteredSubCategories((prev) =>
            prev.includes(subCat)
                ? prev.filter((s) => s !== subCat)
                : [...prev, subCat]
        );
    };

    /* -------------------- INIT -------------------- */

    useEffect(() => {
        window.scrollTo(0, 0);
        setBaseProducts(productsData);
        setFilteredProducts(productsData);
        setLoading(false);
    }, []);

    useEffect(() => {
        const uniqueSubs = [
            ...new Set(productsData.map((p) => p.subCategory)),
        ];
        setSubCategories(uniqueSubs);
    }, []);

    /* -------------------- FILTER LOGIC -------------------- */

    const filterProducts = ({
        categories = filteredCategories,
        subCats = filteredSubCategories,
        sizes = selectedSizes,
        price = priceRange,
        availability = selectedAvailability,
        autoClose = true
    } = {}) => {
        let filtered = [...baseProducts];

        // Category filter
        if (categories.length > 0 && !categories.includes("All Products")) {
            filtered = filtered.filter((p) => categories.includes(p.category));
        }

        // Subcategory filter
        if (subCats.length > 0) {
            filtered = filtered.filter((p) => subCats.includes(p.subCategory));
        }

        // Sizes
        if (sizes.length > 0) {
            filtered = filtered.filter((p) =>
                p.sizes?.some((s) => sizes.includes(s))
            );
        }

        // Price
        filtered = filtered.filter((p) => p.price >= price[0] && p.price <= price[1]);

        // Availability
        if (availability.length > 0) {
            filtered = filtered.filter((p) => {
                if (availability.includes("inStock") && p.inStock) return true;
                if (availability.includes("outOfStock") && !p.inStock) return true;
                return false;
            });
        }

        setFilteredProducts(filtered);
        if (autoClose) setIsFilterOpen(false);
    };

    useEffect(() => {
        filterProducts();
    }, [selectedSizes, filteredCategories, filteredSubCategories, priceRange, selectedAvailability]);

    /* -------------------- SORT -------------------- */

    useEffect(() => {
        let data = [...baseProducts];

        // CATEGORY
        if (filteredCategories.length > 0 && !filteredCategories.includes("All Products")) {
            data = data.filter((p) => filteredCategories.includes(p.category));
        }

        // SUBCATEGORY
        if (filteredSubCategories.length > 0) {
            data = data.filter((p) => filteredSubCategories.includes(p.subCategory));
        }

        // SIZE
        if (selectedSizes.length > 0) {
            data = data.filter((p) =>
                p.sizes?.some((s) => selectedSizes.includes(s))
            );
        }

        // PRICE
        data = data.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // AVAILABILITY
        if (selectedAvailability.length > 0) {
            data = data.filter((p) => {
                if (selectedAvailability.includes("inStock") && p.inStock) return true;
                if (selectedAvailability.includes("outOfStock") && !p.inStock) return true;
                return false;
            });
        }

        // SORT
        if (sortBy === "bestseller") {
            data = data.filter((p) => p.bestseller);
        }
        if (sortBy === "price-asc") data.sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") data.sort((a, b) => b.price - a.price);
        if (sortBy === "newest") data.sort((a, b) => b.date - a.date);

        setFilteredProducts(data);
    }, [
        baseProducts,
        sortBy,
        selectedSizes,
        filteredCategories,
        filteredSubCategories,
        priceRange,
        selectedAvailability
    ]);

    /* -------------------- PRICE DRAG -------------------- */

    const startDrag = (e) => {
        isDragging.current = true;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const clickValue = Math.round(percent * MAX_PRICE);
        activeThumb.current =
            Math.abs(clickValue - tempPriceRange[0]) < Math.abs(clickValue - tempPriceRange[1])
                ? "min"
                : "max";
    };

    const startThumbDrag = (e, thumb) => {
        e.stopPropagation();
        isDragging.current = true;
        activeThumb.current = thumb;
    };

    useEffect(() => {
        const move = (e) => {
            if (!isDragging.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const rect = sliderRef.current.getBoundingClientRect();
            let value = Math.round(((clientX - rect.left) / rect.width) * MAX_PRICE);
            value = Math.max(0, Math.min(MAX_PRICE, value));

            if (activeThumb.current === "min") {
                if (value > tempPriceRange[1]) value = tempPriceRange[1];
                setTempPriceRange([value, tempPriceRange[1]]);
            } else if (activeThumb.current === "max") {
                if (value < tempPriceRange[0]) value = tempPriceRange[0];
                setTempPriceRange([tempPriceRange[0], value]);
            }
        };

        const end = () => {
            isDragging.current = false;
            activeThumb.current = null;
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", end);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", end);
        };
    }, [tempPriceRange]);

    /* -------------------- UI -------------------- */

    return (
        <div className="flex flex-col min-h-screen">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center py-2">
                <NavLink to="/">
                    <img src="/logo-header.png" className="h-14" />
                </NavLink>
            </div>

            <Header />
            <nav className="container mx-auto px-4 py-3 text-sm text-gray-600 flex flex-wrap items-center gap-1 md:mt-8 mb-2">
                <NavLink to="/" className="hover:underline">Home</NavLink> &gt;
                <span className="ml-1 font-semibold">Collection</span>
            </nav>
            {/* COLLECTION CIRCLES */}
            <div className="container mx-auto px-2 py-4 flex justify-center md:justify-center gap-4 -mt-5 mb-4 md:gap-x-10">
                {circles.map((c) => (
                    <div
                        key={c}
                        onClick={() =>
                            navigate(c === "All Products" ? "/collection" : `/${c.toLowerCase()}`)
                        }
                        className={`flex flex-col items-center cursor-pointer hover:scale-105 transition font-semibold
            ${c === "All Products" ? "border-b-2 border-black" : "border-b-2 border-transparent"}`}
                    >
                        <div className="w-19 md:w-24 h-19 md:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden border border-gray-200">
                            <img src={collectionImages[c]} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs md:text-sm text-center font-medium mb-1">{c}</span>
                    </div>
                ))}
            </div>

            {/* Filter / Sort / View */}
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center mb-7 bg-white gap-3">

                {/* Top Row: Filter (left) + Sort (right) */}
                <div className="flex w-full justify-between items-center md:justify-start md:gap-4">
                    {/* Filter button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 py-2 hover:underline cursor-pointer"
                    >
                        <MdOutlineFilterList className="w-5 h-5 text-gray-700" />
                        <span className="text-medium font-medium text-gray-700">FILTER</span>
                    </button>

                    {/* Sort dropdown */}
                    <div className="w-48 md:ml-4">
                        <Select
                            options={sortOptions}
                            value={sortOptions.find((opt) => opt.value === sortBy)}
                            onChange={(option) => setSortBy(option.value)}
                            styles={customSelectStyles}
                            isSearchable={false}
                        />
                    </div>
                </div>

                {/* Bottom Row: Price + Active Chips (left) + View Mode (right) */}
                <div className="flex w-full md:-ml-80 mt-2 md:mt-0 gap-3 flex-wrap md:flex-nowrap">

                    {/* Left: Price + Active Chips */}
                    <div className="flex flex-wrap gap-2">
                        {/* Price Chip */}
                        {priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? (
                            <span className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                                $ {priceRange[0]} - $ {priceRange[1]}
                                <button
                                    onClick={() => {
                                        setPriceRange([MIN_PRICE, MAX_PRICE]);
                                        setTempPriceRange([MIN_PRICE, MAX_PRICE]);
                                        filterProducts(false);
                                    }}
                                    className="ml-1 font-bold text-gray-600 hover:text-black cursor-pointer">×</button>
                            </span>
                        ) : null}

                        {/* Subcategory Chips */}
                        {filteredSubCategories.map((sc) => (
                            <span key={sc} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                                {sc}
                                <button
                                    onClick={() => { toggleSubCategory(sc); filterProducts(false); }}
                                    className="ml-1 font-bold cursor-pointer text-gray-600 hover:text-black cursor-pointer">×</button>
                            </span>
                        ))}

                        {/* Size Chips */}
                        {selectedSizes.map((size) => (
                            <span key={size} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                                Size: {size}
                                <button
                                    onClick={() => { setSelectedSizes((prev) => prev.filter((s) => s !== size)); filterProducts(false); }}
                                    className="ml-1 font-bold text-gray-600 hover:text-black cursor-pointer">×</button>
                            </span>
                        ))}

                        {/* Availability Chips */}
                        {selectedAvailability.map((a) => (
                            <span key={a} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                                {a === "inStock" ? "In Stock" : "Out of Stock"}
                                <button
                                    onClick={() => { setSelectedAvailability((prev) => prev.filter((x) => x !== a)); filterProducts(false); }}
                                    className="ml-1 font-bold text-gray-600 hover:text-black cursor-pointer">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* View Mode + Total Items */}
                <div className="flex items-center justify-between md:justify-end mt-3 md:mt-0 gap-3 w-full md:w-150">
                    <span className="text-gray-700 ml-1">{filteredProducts.length} items</span>
                    <div className="flex items-center gap-3">
                        {/* Desktop grid-4 & grid-3 */}
                        <div className="hidden md:flex flex-col items-center relative cursor-pointer" onClick={() => setViewMode("grid-4")}>
                            <Grid4 className="w-6 h-6" />
                            {viewMode === "grid-4" && <span className="absolute -bottom-1 w-3 h-[2px] bg-black rounded-full"></span>}
                        </div>

                        <div className="hidden md:flex flex-col items-center relative cursor-pointer" onClick={() => setViewMode("grid-3")}>
                            <Grid3 className="w-6 h-6" />
                            {viewMode === "grid-3" && <span className="absolute -bottom-1 w-3 h-[2px] bg-black rounded-full"></span>}
                        </div>

                        {/* Mobile + Desktop: grid-2 & grid-1 */}
                        <div className="flex flex-col items-center relative cursor-pointer" onClick={() => setViewMode("grid-2")}>
                            <Grid2 className="w-6 h-6" />
                            {viewMode === "grid-2" && <span className="absolute -bottom-1 w-3 h-[2px] bg-black rounded-full"></span>}
                        </div>

                        <div className="flex flex-col items-center relative cursor-pointer" onClick={() => setViewMode("grid-1")}>
                            <List className="w-6 h-6" />
                            {viewMode === "grid-1" && <span className="absolute -bottom-1 w-3 h-[2px] bg-black rounded-full"></span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <ProductList products={filteredProducts} viewMode={viewMode} />

            <Footer />

            {/* Sidebar Filter */}
            <div className="flex flex-wrap gap-2 mt-2">
                {filteredSubCategories.map((sc) => (
                    <span key={sc} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                        {sc}
                        <button
                            onClick={() => { toggleSubCategory(sc); filterProducts(); }}
                            className="ml-1 font-bold cursor-pointer text-gray-600 hover:text-black">×</button>
                    </span>
                ))}

                {selectedSizes.map((size) => (
                    <span key={size} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                        Size: {size}
                        <button
                            onClick={() => { setSelectedSizes((prev) => prev.filter((s) => s !== size)); filterProducts(); }}
                            className="ml-1 font-bold text-gray-600 hover:text-black">×</button>
                    </span>
                ))}

                {selectedAvailability.map((a) => (
                    <span key={a} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                        {a === "inStock" ? "In Stock" : "Out of Stock"}
                        <button
                            onClick={() => { setSelectedAvailability((prev) => prev.filter((x) => x !== a)); filterProducts(); }}
                            className="ml-1 font-bold text-gray-600 hover:text-black">×</button>
                    </span>
                ))}

                {/* Price Chip */}
                {priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? (
                    <span className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                        $ {priceRange[0]} - $ {priceRange[1]}
                        <button
                            onClick={() => {
                                setPriceRange([MIN_PRICE, MAX_PRICE]);
                                setTempPriceRange([MIN_PRICE, MAX_PRICE]);
                                filterProducts();
                            }}
                            className="ml-1 font-bold text-gray-600 hover:text-black cursor-pointer">×</button>
                    </span>
                ) : null}
            </div>

            {/* Sidebar Filter */}
            <>
                <div
                    onClick={() => setIsFilterOpen(false)}
                    className={`
             fixed inset-0 bg-black/40 z-400
             transition-opacity duration-300
             ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                />

                <div
                    className={` fixed top-0 left-0 h-full bg-white shadow-2xl flex flex-col w-70 md:w-75 z-1000
                  transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
                >

                    <div className="flex justify-center my-3">
                        <img src="/logo-header.png" alt="Logo" className="h-10 object-contain" />
                    </div>

                    <div className="px-5 flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-lg font-semibold text-gray-700">Filter</span>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-black transition text-xl cursor-pointer">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 space-y-6 hide-scrollbar-custom px-5">

                        {/* Category + Total Count */}
                        <div className="flex gap-3 border-b border-gray-200 pb-5">
                            <span className="text-lg font-semibold text-gray-700">All Products</span>
                            <span className="text-lg text-gray-500">({filteredProducts.length})</span>
                        </div>

                        {/* Sizes */}
                        <div className="mt-6 border-b border-gray-200 pb-5">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 tracking-wide">Sizes</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {["S", "M", "L", "XL"].map((size) => (
                                    <button key={size} onClick={() => { setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]); filterProducts(); }}
                                        className={`w-full h-12 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all duration-300 ${selectedSizes.includes(size) ? "bg-yellow-500 text-white border-transparent shadow-lg scale-105" : "bg-white text-gray-700 border-gray-300 hover:border-yellow-500 hover:shadow-md hover:scale-105 cursor-pointer"}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="border-b border-gray-200 pb-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Price</h3>
                            <div className="flex justify-between mb-3 text-xs text-gray-600">
                                <span>
                                    <span className="font-medium text-gray-500">Min</span>:
                                    <span className="font-semibold text-gray-800"> $ {tempPriceRange[0]}</span>
                                </span>
                                <span>
                                    <span className="font-medium text-gray-500">Max</span>:
                                    <span className="font-semibold text-gray-800"> $ {tempPriceRange[1]}</span>
                                </span>

                            </div>
                            <div
                                ref={sliderRef}
                                className="relative h-[3px] bg-gray-200 rounded-full cursor-pointer select-none mt-4"
                                onMouseDown={(e) => startDrag(e)}
                                onTouchStart={(e) => startDrag(e.touches[0])} // Touch support
                            >
                                {/* Range Highlight */}
                                <div
                                    className="absolute h-[3px] bg-black rounded-full"
                                    style={{
                                        left: `${(tempPriceRange[0] / MAX_PRICE) * 100}%`,
                                        width: `${((tempPriceRange[1] - tempPriceRange[0]) / MAX_PRICE) * 100}%`,
                                    }}
                                />

                                {/* Min Thumb */}
                                <div
                                    className="absolute w-1 h-6 bg-black top-1/2 -translate-y-1/2 rounded cursor-pointer"
                                    style={{ left: `${(tempPriceRange[0] / MAX_PRICE) * 100}%` }}
                                    onMouseDown={(e) => startThumbDrag(e, "min")}
                                    onTouchStart={(e) => startThumbDrag(e.touches[0], "min")}
                                />

                                {/* Max Thumb */}
                                <div
                                    className="absolute w-1 h-6 bg-black top-1/2 -translate-y-1/2 rounded cursor-pointer"
                                    style={{ left: `${(tempPriceRange[1] / MAX_PRICE) * 100}%` }}
                                    onMouseDown={(e) => startThumbDrag(e, "max")}
                                    onTouchStart={(e) => startThumbDrag(e.touches[0], "max")}
                                />
                            </div>

                            {/* Apply Filter */}
                            <button
                                onClick={() => {
                                    setPriceRange(tempPriceRange); // now filter and close
                                    filterProducts(true);
                                }}
                                className="mt-5 w-full px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900 transition cursor-pointer"
                            >
                                Filter
                            </button>

                        </div>

                        {/* Subcategories */}
                        <div className="border-b border-gray-200 pb-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Subcategories</h3>
                            <div className="space-y-2">
                                {subCategories.filter((sc) => sc !== "All Products").map((sc) => (
                                    <label key={sc} className="flex items-center gap-3 text-sm cursor-pointer">
                                        <input type="checkbox" checked={filteredSubCategories.includes(sc)} onChange={() => { toggleSubCategory(sc); filterProducts(); }} className="accent-black w-4 h-4" />
                                        <span className="text-gray-700">{sc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="pb-5">
                            {["inStock", "outOfStock"].map((status) => (
                                <label key={status} className="flex items-center gap-3 text-sm cursor-pointer mt-2 text-gray-700">
                                    <input type="checkbox" checked={selectedAvailability.includes(status)} onChange={() => { setSelectedAvailability((prev) => prev.includes(status) ? prev.filter((a) => a !== status) : [...prev, status]); filterProducts(); }} className="accent-black w-4 h-4" />
                                    <span>{status === "inStock" ? `In Stock (${filteredProducts.length})` : "Out of Stock (0)"}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <style>{`
                .hide-scrollbar-custom::-webkit-scrollbar { width: 6px; }
                .hide-scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
                .hide-scrollbar-custom::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
                .hide-scrollbar-custom { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) transparent; }
              `}
                </style>
            </>
        </div>
    );
};

export default Collection;
