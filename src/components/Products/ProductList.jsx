import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";
import { HiOutlineShoppingBag } from "react-icons/hi";

//  Skeleton
const ProductCardSkeleton = ({ viewMode }) => (
  <div className="w-full mb-3 relative overflow-hidden">
    {/* Image */}
    <div
      className={`relative overflow-hidden rounded-lg ${viewMode === "list" ? "aspect-[6/5]" : "aspect-[3/4]"}`}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>

    {/* Text */}
    <div className="mt-3 space-y-2">
      <div
        className="h-4 w-2/3 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
      <div
        className="h-4 w-1/5 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>

    <style>
      {`
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`}
    </style>

  </div>
);

// 🔄 Loading dots component
const LoadingDots = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 300);
    return () => clearInterval(interval);
  }, []);
  return <span>Loading products{dots}</span>;
};

const ProductList = ({ products, viewMode, resetFilters }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5 });

  // ✅ track images loaded
  const [imagesLoaded, setImagesLoaded] = useState({});
  useEffect(() => {
    if (!products) return;
    setImagesLoaded(prev => {
      const updated = { ...prev };
      products.forEach(p => {
        if (!(p.id in updated)) {
          updated[p.id] = false;
        }
      });
      return updated;
    });
  }, [products]);


  useEffect(() => {
    if (inView && visibleCount < products.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 8, products.length));
        setLoading(false);
      }, 500);
    }
  }, [inView, visibleCount, products]);


  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

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
      {/* No products */}
      {products && products.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-10 mb-15 px-4">
          <div className="max-w-md w-full text-center animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full bg-yellow-50 shadow-inner">
              <HiOutlineShoppingBag className="text-yellow-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We couldn’t find any products matching your selection.
            </p>
            <button
              onClick={resetFilters}
              className="py-3 px-6 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Products or skeleton */}
      {products &&
        products.slice(0, visibleCount).map((product) => {
          const imgLoaded = imagesLoaded[product.id];
          return imgLoaded ? (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ) : (
            <div key={product.id}>
              <ProductCardSkeleton viewMode={viewMode} />
              {/* hidden img triggers onLoad */}
              <img
                src={Array.isArray(product.image) ? product.image[0] : product.image}
                alt={product.name}
                className="hidden"
                onLoad={() => handleImageLoad(product.id)}
              />
            </div>
          );
        })}

      {/* Infinite loader */}
      <div ref={ref} className="h-1 col-span-full" />

      {products ? (
        visibleCount < products.length ? (
          <div className="col-span-full flex justify-center items-center py-6">
            <div className="bg-white border border-yellow-400 shadow-md px-6 py-3 rounded-lg text-gray-700 font-medium">
              <LoadingDots />
            </div>
          </div>
        ) : (
          visibleCount >= products.length && products.length > 0 && (
            <div className="col-span-full flex justify-center items-center py-6">
              <div className="bg-white border border-yellow-400 shadow-md px-6 py-3 rounded-lg text-gray-700 font-medium">
                No More Products
              </div>
            </div>
          )
        )
      ) : null}
    </div>
  );
};

export default ProductList;
