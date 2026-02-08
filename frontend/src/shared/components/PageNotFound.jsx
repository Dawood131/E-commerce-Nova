import React from "react";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-500 mb-4 animate-bounce">
        404
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
       We can't find the page you're looking for.
      </p>
      <NavLink
        to="/"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-yellow-500 text-black transition-colors font-semibold shadow-md"
      >
        Go Back Home
      </NavLink>
    </div>
  );
};

export default PageNotFound;
