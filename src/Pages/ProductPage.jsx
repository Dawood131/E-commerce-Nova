import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header/Header";
import Footer from "../components/Layout/Footer";
import { addToCart } from "../redux/cartSlice";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import MainBtn from "../components/Button/MainBtn";
import ProductCard from "../components/Products/ProductCard";
import { openModal } from "../redux/uiModalSlice";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useSwipeable } from "react-swipeable";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  // MOBILE VIEWER
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => window.scrollTo(0, 0), []);

  const products = useSelector((s) => s.products.items || []);
  const product = products.find((p) => p.id === id);

  if (!product) return <p className="py-20 text-center">Product not found</p>;

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const mainImage = activeImage || images[activeIndex];

  const categoryKey = product.category?.toLowerCase();
  const subCategoryKey = product.subCategory?.toLowerCase();
  const staticDesc = staticProductInfo[categoryKey]?.[subCategoryKey]?.description ||
    "High-quality product for everyday use.";
  const keyPoints = staticProductInfo[categoryKey]?.[subCategoryKey]?.keyPoints || [];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        qty,
        selectedSize: selectedSize,
      })
    );

    dispatch(
      openModal({
        type: "cart",
        product: product,
      })
    );
  };

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleQuantityChange = (newQty) => {
    if (newQty < 1 || newQty > 5) return;
    setQty(newQty);
  };

  return (
    <>
      <Header />
      <div className="md:hidden w-full flex justify-center items-center py-2 -mb-17 ">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* LEFT – Thumbnails */}
          <div className="order-2 md:order-1 flex flex-col gap-6 md:mt-8 -mt-15">
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)} // <-- this updates the main image
                  className="relative rounded-lg overflow-hidden transition-all duration-200"
                >
                  <img
                    src={img}
                    alt={`thumbnail-${i}`}
                    className={`w-full h-full object-cover aspect-square transition-transform duration-300 hover:scale-105
          ${i === activeIndex ? "ring-2 ring-yellow-500" : ""}`} // highlight active
                  />
                </button>
              ))}
            </div>

            <div className="md:flex flex-col gap-6 order-3 md:order-1 hidden">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  Product Details
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{staticDesc}</p>
                {keyPoints.length > 0 && (
                  <ul className="space-y-2">
                    {keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 mt-2 rounded-full bg-yellow-500 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3 md:hidden mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className="relative rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${i}`}
                      className="w-full h-full object-cover aspect-square transition-transform duration-300 hover:scale-105"
                    />
                    {mainImage === img && (
                      <span className="absolute inset-0 bg-yellow-300/7 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER – Main Image */}
          <div className="order-1 md:order-2 flex justify-center items-start relative w-full max-w-[420px] mt-0 md:mt-8">

            <div className="relative w-full max-w-[420px] mx-auto">
              {/* DESKTOP IMAGE + ZOOM */}
              <div className="hidden md:block w-full h-[500px] relative">
                <img
                  src={images[activeIndex]}
                  alt={`product-${activeIndex}`}
                  className="w-full h-full object-contain rounded-xl -mt-8 select-none"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${images[activeIndex]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: zoomStyle.backgroundPosition ? "200%" : "contain",
                    backgroundPosition: zoomStyle.backgroundPosition || "center",
                    transition: "background-position 0.1s",
                  }}
                />
                <div
                  className="absolute inset-0 cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomStyle({})}
                />
              </div>

              {/* MOBILE IMAGE → Click fullscreen */}
              <div
                className="md:hidden w-full aspect-[3/4] relative cursor-pointer"
                onClick={() => {
                  setViewerIndex(activeIndex);
                  setIsViewerOpen(true);
                }}
              >
                <img
                  src={images[activeIndex]}
                  alt={`product-${activeIndex}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              {/* LEFT / RIGHT BUTTONS (Mobile + Desktop) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/60 w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-white/80 hover:text-yellow-500 transition cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/60 w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-white/80 hover:text-yellow-500 transition cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT – Product Info */}
          <div className="order-3 flex flex-col gap-6 -mt-7 md:mt-7">
            <h1 className="text-xl md:text-2xl font-light tracking-wide text-gray-900 leading-snug">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide md:mt-0 -mt-4">
              $ {product.price.toLocaleString()}
            </p>

            {product.sizes?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 md:mt-0 -mt-3">
                  Select Size
                </p>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200
                ${selectedSize === size ? "bg-yellow-500 text-white shadow-lg scale-105" : "bg-white text-gray-800 border border-gray-300 hover:border-yellow-500 hover:text-yellow-600"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(qty - 1)}
                    disabled={qty === 1}
                    className={`px-3 py-2 transition bg-gray-100 ${qty === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-yellow-500"}`}
                  >
                    <AiOutlineMinus size={16} />
                  </button>
                  <span className="px-4 text-sm font-semibold text-gray-900">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(qty + 1)}
                    disabled={qty === 5}
                    className={`px-3 py-2 transition bg-gray-100 ${qty === 5 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-yellow-500"}`}
                  >
                    <AiOutlinePlus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <NavLink>
              <MainBtn text={"ADD TO BAG"} onClick={handleAddToCart} className="w-full font-medium tracking-wide" />
            </NavLink>

          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN VIEWER */}
      {isViewerOpen && (
        <MobileImageViewer
          images={images}
          index={viewerIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      {/* YOU MAY ALSO LIKE */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">You May Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;

// ================= MOBILE FULLSCREEN VIEWER =================
const MobileImageViewer = ({ images, index, onClose }) => {
  const [current, setCurrent] = useState(index);
  const [zoomActive, setZoomActive] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => !zoomActive && setCurrent(p => (p === images.length - 1 ? 0 : p + 1)),
    onSwipedRight: () => !zoomActive && setCurrent(p => (p === 0 ? images.length - 1 : p - 1)),
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-centermd:hidden">

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-4xl font-bold rounded-full p-2 transition z-50"
      >
        ✕
      </button>

      {/* IMAGE SWIPE + ZOOM */}
      <div className="relative w-full flex-1 flex items-center justify-center px-4 mt-4" {...handlers}>
        <TransformWrapper
          centerOnInit={true}
          minScale={1}
          maxScale={2}
          onZoomChange={({ scale }) => setZoomActive(scale > 1)}
        >
          {({ zoomIn, resetTransform, state }) => (
            <TransformComponent>
              <img
                src={images[current]}
                alt={`product-${current}`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg select-none mt-8"
                onDoubleClick={() => {
                  state.scale > 1 ? resetTransform() : zoomIn(2);
                }}
              />
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>

      {/* IMAGE COUNTER / DOTS */}
      <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto px-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`preview-${i}`}
            className={`w-16 h-16 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 mb-5
        ${i === current ? "scale-105" : "opacity-70 hover:opacity-100"}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export const staticProductInfo = {
  men: {
    topwear: {
      description:
        "Stylish men’s topwear crafted from premium fabrics. Perfect for casual outings, office wear, or formal occasions. Designed to provide comfort, durability, and a modern fit that complements any style.",
      keyPoints: [
        "Premium soft cotton & blended fabrics",
        "Breathable and lightweight for all-day comfort",
        "Available in multiple modern colors",
        "Slim and tailored fit for a polished look",
        "Durable stitching ensures long-lasting wear",
      ],
    },
    bottomwear: {
      description:
        "Men’s bottomwear designed for comfort, style, and versatility. Ideal for daily wear, office, or casual occasions. Offers a perfect balance of flexibility and durability.",
      keyPoints: [
        "Comfortable fit for all-day wear",
        "High-quality, fade-resistant material",
        "Easy to wash and maintain",
        "Available in multiple sizes and colors",
        "Reinforced stitching for durability",
      ],
    },
    winterwear: {
      description:
        "Warm and stylish men’s winterwear to keep you comfortable in cold weather. Ideal for outdoor activities, travel, or casual winter outings.",
      keyPoints: [
        "Thick, insulating material for ultimate warmth",
        "Modern and versatile designs for everyday wear",
        "Multiple color options to suit your style",
        "Durable stitching for long-lasting use",
        "Comfortable fit for layering over other clothing",
      ],
    },
  },
  women: {
    topwear: {
      description:
        "Trendy women’s tops made from soft, breathable fabrics. Perfect for casual outings, office, or daily wear, combining style, comfort, and a flattering fit.",
      keyPoints: [
        "Lightweight, soft, and breathable materials",
        "Modern cuts for a flattering silhouette",
        "Available in multiple vibrant colors",
        "Easy to care and maintain",
        "Durable stitching for long-lasting use",
      ],
    },
    bottomwear: {
      description:
        "Stylish women’s bottoms designed for everyday comfort and elegance. Perfect for casual, office, or semi-formal wear.",
      keyPoints: [
        "Comfortable and flexible fit",
        "High-quality, fade-resistant fabric",
        "Easy maintenance and care",
        "Multiple colors and sizes available",
        "Durable stitching for long-term use",
      ],
    },
  },
  kids: {
    topwear: {
      description:
        "Comfortable and fun kids’ tops made with soft cotton. Ideal for school, playtime, or casual wear, providing freedom of movement and durability.",
      keyPoints: [
        "Soft, breathable cotton for sensitive skin",
        "Fun and playful designs and colors",
        "Easy to wear and remove",
        "Durable stitching for active kids",
        "Lightweight and comfortable for daily wear",
      ],
    },
    winterwear: {
      description:
        "Warm and cozy kids’ winterwear perfect for outdoor activities or colder days. Designed to keep children comfortable while allowing freedom to play.",
      keyPoints: [
        "Thick and insulating fabrics for warmth",
        "Vibrant colors and fun designs kids love",
        "Durable stitching to withstand active play",
        "Comfortable fit for layering over other clothing",
        "Easy to wash and maintain",
      ],
    },
  },
};

