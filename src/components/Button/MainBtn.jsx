// src/components/Button2.jsx
import React from "react";

const MainBtn = ({ children, text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        md:px-4 px-2 py-2.5 font-semibold shadow-md border-2 border-transparent 
        transition-all duration-300 cursor-pointer
        bg-black text-white
        hover:bg-yellow-500 hover:text-black hover:border-yellow-500 hover:scale-105
        active:bg-yellow-500 active:text-black active:border-yellow-500
        ${className}
      `}
    >
      {text || children}
    </button>
  );
};

export default MainBtn;
