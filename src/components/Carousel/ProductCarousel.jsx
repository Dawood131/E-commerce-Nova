import React, { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import ProductCard from "../Products/ProductCard";
import Headings from "../Headings/Headings";

const ProductCarousel = ({ products }) => {
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const [cardsPerView, setCardsPerView] = useState(6);
  const [slideIndex, setSlideIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(products.length);
  const [scrollStep, setScrollStep] = useState(1);
  const slideIndexRef = useRef(0);

  const doubledProducts = [...products, ...products];

  /* ---------------- Responsive ---------------- */
  useEffect(() => {
    const updateBreakpoints = () => {
      const w = window.innerWidth;

      if (w >= 1280) {
        setCardsPerView(6);
        setScrollStep(1);
        setDotsCount(products.length);
      } else if (w >= 1024) {
        setCardsPerView(5);
        setScrollStep(1);
        setDotsCount(Math.ceil(products.length / 5));
      } else if (w >= 768) {
        setCardsPerView(3);
        setScrollStep(1);
        setDotsCount(Math.ceil(products.length / 3));
      } else {
        setCardsPerView(2);
        setScrollStep(2);
        setDotsCount(Math.ceil(products.length / 2));
      }
    };

    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, [products.length]);

  /* ---------------- Core Slide ---------------- */
  const goToSlide = (index, withTransition = true) => {
    if (!trackRef.current) return;

    const firstCard = trackRef.current.children[0];
    if (!firstCard) return;

    const gap = 20;
    const cardWidth = firstCard.offsetWidth + gap;

    trackRef.current.style.transition = withTransition
      ? "transform 0.45s ease"
      : "none";

    trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;

    slideIndexRef.current = index; // 🔥 IMPORTANT
    setSlideIndex(index);
  };


  /* ---------------- Next ---------------- */
  const next = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const currentIndex = slideIndexRef.current;
    const newIndex = currentIndex + scrollStep;

    goToSlide(newIndex);

    if (newIndex >= products.length) {
      const onEnd = () => {
        trackRef.current.removeEventListener("transitionend", onEnd);
        requestAnimationFrame(() => {
          goToSlide(0, false);
          isAnimatingRef.current = false;
        });
      };
      trackRef.current.addEventListener("transitionend", onEnd);
    } else {
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 450);
    }
  };


  /* ---------------- Prev ---------------- */
  const prev = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const firstCard = trackRef.current.children[0];
    const gap = 20;
    const cardWidth = firstCard.offsetWidth + gap;

    const currentIndex = slideIndexRef.current;
    const newIndex = currentIndex - scrollStep;

    if (newIndex < 0) {
      const jumpIndex = products.length - scrollStep;

      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(-${jumpIndex * cardWidth}px)`;

      slideIndexRef.current = jumpIndex;
      setSlideIndex(jumpIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          goToSlide(jumpIndex - scrollStep);
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 450);
        });
      });
      return;
    }

    goToSlide(newIndex);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 450);
  };


/* ---------------- Auto Slide ---------------- */
const startAutoSlide = () => {
  stopAutoSlide(); // 🔥 ALWAYS clear first
  autoSlideRef.current = setInterval(() => {
    next();
  }, 3000);
};


const stopAutoSlide = () => {
  clearInterval(autoSlideRef.current);
  autoSlideRef.current = null;
};

useEffect(() => {
  startAutoSlide();
  return stopAutoSlide;
}, []); 



/* ---------------- Active Dot ---------------- */
const getActiveDot = () => {
  if (cardsPerView >= 6) return slideIndex % products.length;
  return Math.floor(slideIndex / scrollStep);
};

/* ---------------- Mobile Swipe ---------------- */
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  let startX = 0;
  let dragging = false;

  const touchStart = e => {
    startX = e.touches[0].clientX;
    dragging = true;
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
  };

  track.addEventListener("touchstart", touchStart);
  track.addEventListener("touchmove", touchMove);
  track.addEventListener("touchend", touchEnd);

  return () => {
    track.removeEventListener("touchstart", touchStart);
    track.removeEventListener("touchmove", touchMove);
    track.removeEventListener("touchend", touchEnd);
  };
}, [slideIndex, scrollStep]);

return (
  <div className="w-full px-4 md:px-6 lg:px-10 py-10">
    <div className="mb-10">
      <Headings highlight="Best" heading="Sellers" />
    </div>

    <div
      className="relative w-full min-h-[340px] md:min-h-[480px] lg:min-h-[620px] mb-16 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('/products/Gemini_Generated_Image_lux0r2lux0r2lux0.png')",
      }}
    />

    <div
      className="relative w-full"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <button
        onClick={prev}
        className="hidden md:flex absolute -left-8 top-42 -translate-y-1/2 bg-white hover:bg-yellow-500 hover:text-white p-3 rounded-full shadow z-10"
      >
        <HiChevronLeft size={24} />
      </button>

      <button
        onClick={next}
        className="hidden md:flex absolute -right-8 top-42 -translate-y-1/2 bg-white hover:bg-yellow-500 hover:text-white p-3 rounded-full shadow z-10"
      >
        <HiChevronRight size={24} />
      </button>

      <div className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ columnGap: "20px", willChange: "transform" }}
        >
          {doubledProducts.map((product, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${(cardsPerView - 1) * 20}px) / ${cardsPerView})`,
              }}
            >
              <ProductCard product={product} small />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex justify-center gap-2 mt-10">
      {Array.from({ length: dotsCount }).map((_, i) => (
        <button
          key={i}
          onClick={() => {
            const targetIndex = cardsPerView >= 6 ? i : i * scrollStep;
            goToSlide(targetIndex);
          }}
          className={`w-3 h-3 rounded-full ${getActiveDot() === i ? "bg-yellow-400" : "bg-gray-300"
            }`}
        />
      ))}
    </div>
  </div>
);
};

export default ProductCarousel;
