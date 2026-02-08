import React from 'react';

const Headings = (props) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="text-center text-zinc-800 text-4xl md:text-5xl font-bold">
        <span className="text-yellow-500">{props.highlight}</span> {props.heading}
        <div className="w-32 md:w-40 h-1 bg-yellow-500 mt-2 md:mt-5 mx-auto"></div>
      </div>
    </div>
  );
};

export default Headings;
