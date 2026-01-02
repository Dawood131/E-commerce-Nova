import React, { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import ProductCard from "../Products/ProductCard";
import Headings from "../Headings/Headings";

const ProductCarousel = ({ products }) => {
  const trackRef = useRef(null);

  const [cardsPerView, setCardsPerView] = useState(6);
  const [slideIndex, setSlideIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(products.length);
  const [scrollStep, setScrollStep] = useState(1); // desktop: 1, mobile: 2 etc
  const autoSlideRef = useRef(null);
  const doubledProducts = [...products, ...products]; // for infinite scroll

  // -------------------
  // Responsive breakpoints
  // -------------------
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
      setScrollStep(1); // mobile: 1 card swipe at a time
      setDotsCount(Math.ceil(products.length / 2));
    }
  };

  useEffect(() => {
    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, [updateBreakpoints]);

  // -------------------
  // Slide function
  // -------------------
  const goToSlide = (index) => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0];
    if (!firstCard) return;

    const gap = 20;
    const cardWidth = firstCard.offsetWidth + gap;

    trackRef.current.style.transition = "transform 0.45s ease";
    trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
    setSlideIndex(index);
  };

  // -------------------
  // Next (infinite)
  // -------------------
  const next = () => {
    let newIndex = slideIndex + scrollStep;
    goToSlide(newIndex);

    if (newIndex >= products.length) {
      setTimeout(() => {
        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = `translateX(0px)`;
        setSlideIndex(0);
      }, 470);
    }
  };

  // -------------------
  // Prev (infinite)
  // -------------------
  const prev = () => {
    let newIndex = slideIndex - scrollStep;
    if (newIndex < 0) {
      const firstCard = trackRef.current.children[0];
      const gap = 20;
      const cardWidth = firstCard.offsetWidth + gap;
      const jumpIndex = products.length - scrollStep;
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(-${jumpIndex * cardWidth}px)`;
      setSlideIndex(jumpIndex);
      setTimeout(() => {
        trackRef.current.style.transition = "transform 0.45s ease";
        goToSlide(jumpIndex - scrollStep);
      }, 20);
      return;
    }
    goToSlide(newIndex);
  };

  // -------------------
  // Auto slide
  // -------------------
  const startAutoSlide = () => {
    if (autoSlideRef.current) return;
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
    return () => stopAutoSlide();
  }, [slideIndex, scrollStep]);


  // -------------------
  // Active dot
  // -------------------
  const getActiveDot = () => {
    if (cardsPerView >= 6) return slideIndex % products.length;
    return Math.floor(slideIndex / scrollStep);
  };

  // -------------------
  // Mobile Swipe
  // -------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let isDragging = false;

    const touchStart = (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const touchMove = (e) => {
      if (!isDragging) return;
      const moveX = e.touches[0].clientX;
      const diff = startX - moveX;

      // threshold to swipe
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          next();
        } else {
          prev();
        }
        isDragging = false;
      }
    };

    const touchEnd = () => {
      isDragging = false;
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
    <div
      className="relative w-full py-10 overflow-hidden px-4 md:px-6 lg:px-10"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div className="mb-15">
        <Headings highlight="Best" heading="Sellers" />
      </div>

      {/* Buttons */}
      <button
        onClick={prev}
        className="absolute left-1 md:top-90 top-70 -translate-y-1/2 bg-white shadow p-3 rounded-full z-20 hover:bg-yellow-400 hover:text-white transition"
      >
        <HiChevronLeft size={24} />
      </button>

      <button
        onClick={next}
        className="absolute right-1 md:top-90 top-70 -translate-y-1/2 bg-white shadow p-3 rounded-full z-20 hover:bg-yellow-400 hover:text-white transition"
      >
        <HiChevronRight size={24} />
      </button>

      {/* Carousel Track */}
      <div className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ columnGap: "20px" }}
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

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: dotsCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const targetIndex = cardsPerView >= 6 ? i : i * scrollStep;
              goToSlide(targetIndex);
            }}
            className={`w-3 h-3 rounded-full transition ${getActiveDot() === i ? "bg-yellow-400" : "bg-gray-300"
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
