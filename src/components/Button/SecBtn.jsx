import React from 'react';

const secBtn = ({ text = "", onClick }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative group">
        
        <button
          onClick={onClick}
          className="
            relative inline-block overflow-hidden cursor-pointer
            bg-black text-white font-semibold 
            transition-all duration-300 
            active:scale-98
            shadow-lg hover:shadow-yellow-500/40
            rounded-md
            px-10 py-3
            whitespace-nowrap
            text-ellipsis
          "
        >

          {/* GOLD GLOW BORDER */}
          <span
            className="
              absolute inset-0 rounded-md
              border-2 border-yellow-500 
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]
            "
          ></span>

          {/* GOLD SHINE EFFECT */}
          <span
            className="
              absolute -left-20 top-0 w-20 h-full 
              bg-gradient-to-r from-yellow-500/0 via-yellow-500/40 to-yellow-500/0
              transform -skew-x-12
              opacity-0 group-hover:opacity-100
              transition-all duration-700
              group-hover:left-full
            "
          ></span>

          {/* Button Text */}
          <span className="relative z-10 block tracking-wide">
            {text}
          </span>

        </button>
      </div>
    </div>
  );
};

export default secBtn;
