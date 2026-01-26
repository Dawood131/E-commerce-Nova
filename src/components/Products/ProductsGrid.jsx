import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768 ? 14 : 8
  );
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && visibleCount < products.length) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(
                prev + (window.innerWidth >= 768 ? 4 : 2),
                products.length
              )
            );
            setLoading(false);
          }, 600); // delay to show skeleton
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [visibleCount, products.length]);

  if (!products?.length)
    return <p className="text-center text-gray-500 mt-10">No products found</p>;

  // Skeleton loader
  const skeletonCount = window.innerWidth >= 768 ? 4 : 2;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:px-10 px-4 py-6">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Skeleton while loading next batch */}
        {loading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[280px] md:h-[310px] bg-gray-200 animate-pulse rounded-md"
            />
          ))}
      </div>

      {/* Trigger div for lazy loading */}
      {visibleCount < products.length && (
        <div ref={loadMoreRef} className="h-8 md:h-12" />
      )}
    </>
  );
};

export default ProductGrid;
