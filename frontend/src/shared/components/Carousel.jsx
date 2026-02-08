import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainBtn from "../ui/MainBtn";

// Public folder images ka path
const slides = [
  { image: "/products/all.jpg", title: "New Collection 2026", subtitle: "A bold step into the future of fashion — redefine your look today with our latest styles.", btn: "Shop Collection", path: "/collection" },
  { image: "/products/man.jpg", title: "Men’s Collection", subtitle: "Discover modern, confident, and bold looks — crafted for today’s men.", btn: "Shop Men", path: "/men" },
  { image: "/products/woman.jpg", title: "Women’s Collection", subtitle: "Where elegance meets comfort. Find outfits that define your grace.", btn: "Shop Women", path: "/women" },
  { image: "/products/p_img38.png", title: "Children’s Wear", subtitle: "Bright, fun, and made for movement — fashion your kids will love.", btn: "Shop Kids", path: "/kids" },
];

// Skeleton
const ImageSkeleton = () => (
  <div className="absolute inset-0 rounded-3xl">
    <div
      className="absolute inset-0 rounded-3xl"
      style={{
        background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "200% 0",
        animation: "shimmer 2.5s linear infinite",
      }}
    />
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

const NovaShowcaseCarousel = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (i) => {
    setImagesLoaded((prev) => ({ ...prev, [i]: true }));
  };

  return (
    <div className="relative w-full py-15 px-6 md:px-20 md:mt-3 mt-7 overflow-hidden">
      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        <div className="relative min-h-[480px] w-full mt-2 md:-mt-6">
          {slides.map((item, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <div className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 w-full px-4 md:px-0 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                
                {/* Image Section with Skeleton */}
                <div className="relative group w-full md:w-[48%] md:h-[420px] h-[380px] rounded-3xl overflow-hidden shadow-2xl">
                  {!imagesLoaded[i] && <ImageSkeleton />}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover object-top rounded-3xl transform transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110 ${imagesLoaded[i] ? "block" : "hidden"}`}
                    onLoad={() => handleImageLoad(i)}
                  />
                </div>

                {/* Text Section */}
                <div className="w-full md:w-[48%] text-center md:text-left -mt-8 md:mt-0 flex flex-col items-center md:items-start justify-center">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 mt-2 md:mt-0">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-[11px] md:text-lg mb-6 leading-relaxed -mt-3 md:mt-0">
                    {item.subtitle}
                  </p>

                  <MainBtn
                    onClick={() => navigate(item.path)}
                    text={item.btn}
                    className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base md:text-lg -mt-4 md:mt-0 rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute left-1/2 -translate-x-1/2 top-120 md:flex hidden space-x-2 z-30 -mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === i ? "bg-yellow-500 w-5" : "bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NovaShowcaseCarousel;
