import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";

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
