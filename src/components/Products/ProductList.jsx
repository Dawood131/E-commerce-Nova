import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";
import { HiOutlineShoppingBag } from "react-icons/hi";

// Blinking dots loader
const LoadingDots = () => {
    const [dots, setDots] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 300);
        return () => clearInterval(interval);
    }, []);
    return <span>Loading products{dots}</span>;
};

const ProductList = ({ products, viewMode }) => {
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(false);
    const { ref, inView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        setVisibleCount(8);
    }, [products]);

    useEffect(() => {
        if (inView && visibleCount < products.length) {
            setLoading(true);
            const timer = setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + 8, products.length));
                setLoading(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [inView, visibleCount, products.length]);

    const gridClass =
        viewMode === "grid-4"
            ? "grid grid-cols-2 md:grid-cols-4 gap-3 md:px-13 px-4 mb-10"
            : viewMode === "grid-3"
                ? "grid grid-cols-2 md:grid-cols-3 gap-3 md:px-13 px-4 mb-10"
                : viewMode === "grid-2"
                    ? "grid grid-cols-2 gap-3 md:px-13 px-4 mb-10"
                    : "grid grid-cols-1 gap-3 md:px-13 px-4 mb-10";

    if (!products || products.length === 0) {
        return (
            <div className="flex items-center justify-center py-10 mb-15 px-4">
                <div className="max-w-md w-full  text-center animate-fadeIn">

                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full bg-yellow-50 shadow-inner">
                        <HiOutlineShoppingBag className="text-yellow-500 text-4xl" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                        No Products Found
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        We couldn’t find any products matching your selection.
                        Try adjusting filters, price range, or categories.
                    </p>

                    {/* Action */}
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 py-3 px-6 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition cursor-pointer"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {products.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}

            {visibleCount < products.length && (
                <div
                    ref={ref}
                    className="col-span-full flex justify-center items-center py-6"
                >
                    <div className="bg-white bg-white border border-yellow-400 shadow-md px-6 py-3 rounded-lg text-gray-700 font-medium flex items-center space-x-2">
                        <LoadingDots />
                    </div>
                </div>
            )}

            {visibleCount >= products.length && (
                <div className="col-span-full flex justify-center items-center py-6">
                    <div className="bg-white border border-yellow-400 shadow-md px-6 py-3 rounded-lg text-gray-700 font-medium">
                        No More Products
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductList;
