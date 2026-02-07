import React, { useEffect, useRef, useState, useMemo } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import ProductCard from "../Products/ProductCard";
import Headings from "../Headings/Headings";

const GAP = 10;
const AUTO_DELAY = 3000;

// Skeleton
const ProductCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>
    <div className="mt-2 h-4 w-2/3 rounded bg-gray-200 relative overflow-hidden">
      <div
        className="absolute inset-0 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>
    <div className="mt-1 h-3 w-1/5 rounded bg-gray-200 relative overflow-hidden">
      <div
        className="absolute inset-0 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// Product wrapper to handle skeleton + actual product
const ProductWrapper = ({ product, width }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ width }} className="flex-shrink-0">
      {!imgLoaded && <ProductCardSkeleton />}
      <img
        src={product.image[0]}
        alt={product.name}
        className="hidden"
        onLoad={() => setImgLoaded(true)}
      />
      {imgLoaded && <ProductCard product={product} />}
    </div>
  );
};


const ProductCarousel = ({ products = [] }) => {
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const slideIndexRef = useRef(0);

  const [slideIndex, setSlideIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(0);
  const getInitialSettings = () => {
    const w = window.innerWidth;
    if (w >= 1280) return { cardsPerView: 5, scrollStep: 1 };
    if (w >= 1024) return { cardsPerView: 5, scrollStep: 1 };
    if (w >= 768) return { cardsPerView: 3, scrollStep: 1 };
    return { cardsPerView: 2, scrollStep: 2 }; // mobile default
  };

  const { cardsPerView: initialCards, scrollStep: initialStep } = getInitialSettings();

  const [cardsPerView, setCardsPerView] = useState(initialCards);
  const [scrollStep, setScrollStep] = useState(initialStep);

  // ------------------ 1) UNIQUE BESTSELLERS ------------------
  const bestSellers = useMemo(() => {
    return products
      .filter(p => p?.bestseller === true)
      .filter(
        (item, index, self) =>
          index === self.findIndex(p => p.id === item.id)
      );
  }, [products]);

  // ------------------ 2) RESPONSIVE SETTINGS ------------------
  useEffect(() => {
    const updateBreakpoints = () => {
      const w = window.innerWidth;

      if (w >= 1280) {
        setCardsPerView(5);
        setScrollStep(1);
      } else if (w >= 1024) {
        setCardsPerView(5);
        setScrollStep(1);
      } else if (w >= 768) {
        setCardsPerView(3);
        setScrollStep(1);
      } else {
        setCardsPerView(2);
        setScrollStep(2);
      }
    };

    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  useEffect(() => {
    const updateBreakpoints = () => {
      const w = window.innerWidth;
      if (w >= 1280) { setCardsPerView(5); setScrollStep(1); }
      else if (w >= 1024) { setCardsPerView(5); setScrollStep(1); }
      else if (w >= 768) { setCardsPerView(3); setScrollStep(1); }
      else { setCardsPerView(2); setScrollStep(2); }
    };

    updateBreakpoints(); // call immediately
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  // ------------------ 4) RENDER PRODUCTS ------------------
  const shouldLoop = bestSellers.length > cardsPerView;

  // ------------------ 3) DOTS COUNT ------------------
  useEffect(() => {
    if (!shouldLoop) {
      setDotsCount(bestSellers.length);
      return;
    }

    setDotsCount(Math.ceil(bestSellers.length / scrollStep));
  }, [bestSellers.length, scrollStep, shouldLoop]);


  const renderProducts = useMemo(() => {
    return shouldLoop ? [...bestSellers, ...bestSellers] : bestSellers;
  }, [bestSellers, shouldLoop]);

  // ------------------ 5) CORE SLIDE FUNCTION ------------------
  const goToSlide = (index, withTransition = true) => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0];
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + GAP;
    trackRef.current.style.transition = withTransition
      ? "transform 0.45s ease"
      : "none";
    trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;

    slideIndexRef.current = index;
    setSlideIndex(index);
  };

  // ------------------ 6) NEXT ------------------
  const next = () => {
    if (!shouldLoop || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const newIndex = slideIndexRef.current + scrollStep;
    goToSlide(newIndex);

    if (newIndex >= bestSellers.length) {
      const onEnd = () => {
        trackRef.current.removeEventListener("transitionend", onEnd);
        requestAnimationFrame(() => {
          goToSlide(0, false);
          isAnimatingRef.current = false;
        });
      };
      trackRef.current.addEventListener("transitionend", onEnd);
    } else {
      setTimeout(() => (isAnimatingRef.current = false), 450);
    }
  };

  // ------------------ 7) PREV ------------------
  const prev = () => {
    if (!shouldLoop || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const firstCard = trackRef.current.children[0];
    const cardWidth = firstCard.offsetWidth + GAP;
    const newIndex = slideIndexRef.current - scrollStep;

    if (newIndex < 0) {
      const jumpIndex = bestSellers.length - scrollStep;

      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(-${jumpIndex * cardWidth}px)`;

      slideIndexRef.current = jumpIndex;
      setSlideIndex(jumpIndex);

      requestAnimationFrame(() => {
        goToSlide(jumpIndex - scrollStep);
        setTimeout(() => (isAnimatingRef.current = false), 450);
      });
      return;
    }

    goToSlide(newIndex);
    setTimeout(() => (isAnimatingRef.current = false), 450);
  };

  // ------------------ 8) AUTO SLIDE ------------------
  const startAutoSlide = () => {
    stopAutoSlide();
    if (!shouldLoop) return;
    autoSlideRef.current = setInterval(next, AUTO_DELAY);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideRef.current);
    autoSlideRef.current = null;
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [shouldLoop]);

  // ------------------ 9) ACTIVE DOT ------------------
  const getActiveDot = () => {
    if (!shouldLoop) return slideIndex;
    return Math.floor(slideIndex / scrollStep) % dotsCount;
  };


  // ------------------ 10) MOBILE SWIPE ------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !shouldLoop) return;

    let startX = 0;
    let dragging = false;

    const touchStart = e => {
      startX = e.touches[0].clientX;
      dragging = true;
      stopAutoSlide();
    };

    const touchMove = e => {
      if (!dragging) return;
      const diff = startX - e.touches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        dragging = false;
      }
    };

    const touchEnd = () => {
      dragging = false;
      startAutoSlide();
    };

    track.addEventListener("touchstart", touchStart);
    track.addEventListener("touchmove", touchMove);
    track.addEventListener("touchend", touchEnd);

    return () => {
      track.removeEventListener("touchstart", touchStart);
      track.removeEventListener("touchmove", touchMove);
      track.removeEventListener("touchend", touchEnd);
    };
  }, [shouldLoop]);

  // ------------------ 11) RENDER ------------------
  if (!bestSellers.length) return null;

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 py-10">
      <div className="mb-10">
        <Headings highlight="Best" heading="Sellers" />
      </div>
      <div className="w-full h-[300px] sm:h-[380px] md:h-[480px] lg:h-[640px]
            overflow-hidden rounded-2xl mb-12">
        <img
          src="/products/Gemini_Generated_Image_lux0r2lux0r2lux0.webp"
          alt="Best Sellers"
          className="w-full h-full object-cover object-center"
          loading="eager"  
          width={1200}    
          height={640}
        />
      </div>


      {/* HOVER / TOUCH STOP */}
      <div
        className="relative w-full"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {/* PREV BUTTON */}
        <button
          onClick={prev}
          className="hidden md:flex absolute -left-8 top-43 -translate-y-1/2 bg-white hover:bg-yellow-500 hover:text-white p-3 rounded-full shadow z-10"
        >
          <HiChevronLeft size={24} />
        </button>

        {/* NEXT BUTTON */}
        <button
          onClick={next}
          className="hidden md:flex absolute -right-8 top-43 -translate-y-1/2 bg-white hover:bg-yellow-500 hover:text-white p-3 rounded-full shadow z-10"
        >
          <HiChevronRight size={24} />
        </button>

        {/* TRACK */}
        <div className="overflow-hidden w-full">
          <div
            ref={trackRef}
            className="flex"
            style={{ columnGap: GAP, willChange: "transform" }}
          >
            {renderProducts.map((product, i) => (
              <ProductWrapper
                key={`${product.id}-${i}`}
                product={product}
                width={`calc((100% - ${(cardsPerView - 1) * GAP}px) / ${cardsPerView})`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: dotsCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i * scrollStep)}
            className={`w-3 h-3 rounded-full ${getActiveDot() === i ? "bg-yellow-400" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
