import React from 'react';
import Headings from '../Headings/Headings';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled, TbHexagonNumber4Filled } from "react-icons/tb";
import { PiFactory } from "react-icons/pi";
import { GiClothes } from "react-icons/gi";
import { SlBadge } from "react-icons/sl";
import { TbTruckDelivery } from "react-icons/tb";

// HexNumber Component - larger React Icon
const HexNumber = ({ Icon, size = 80 }) => {
    const stroke = "#facc15"; 
    const strokeWidth = 3;

    return (
        <div className="flex items-center justify-center mb-6" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon
                    points="50,4 88,26 88,74 50,96 12,74 12,26"
                    fill="#ffffff"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <foreignObject x="0" y="0" width="100" height="100">
                    <div className="w-full h-full flex items-center justify-center">
                        <Icon className="text-zinc-800 text-5xl md:text-6xl lg:text-7xl" /> 
                    </div>
                </foreignObject>
            </svg>
        </div>
    );
};

const steps = [
    {
        id: 1,
        number: TbHexagonNumber1Filled,
        title: "Fabric Sourcing",
        para: "High-quality fabrics from trusted suppliers.",
        icon: <GiClothes className="text-2xl" />
    },
    {
        id: 2,
        number: TbHexagonNumber2Filled,
        title: "Production",
        para: "Expert craftsmanship for perfect fits.",
        icon: <PiFactory className="text-2xl" />
    },
    {
        id: 3,
        number: TbHexagonNumber3Filled,
        title: "Quality Check",
        para: "Every item inspected for flawlessness.",
        icon: <SlBadge className="text-2xl" />
    },
    {
        id: 4,
        number: TbHexagonNumber4Filled,
        title: "Delivery",
        para: "Fast and safe shipping to your door.",
        icon: <TbTruckDelivery className="text-2xl" />
    },
];

const Process = () => {
    return (
        <section>
            <div className='max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-20 py-10'>
                <div className='w-full text-center'>
                    <Headings highlight="Our" heading="Process" />
                </div>

                <div className='flex flex-wrap items-stretch justify-center gap-y-[68px] md:gap-y-[80px] md:mt-10 mt-10 md:pt-40'>
                    {steps.map((Item) => (
                        <div
                            key={Item.id}
                            className={`flex-1 min-w-[280px] md:basis-[300px] flex flex-col items-center
                            ${Item.id % 2 === 0 ? "md:-mt-[100px]" : ""}`}
                        >
                            {/* Hex Number using React Icon */}
                            <HexNumber Icon={Item.number} />

                            {/* Content */}
                            <div className='flex items-center gap-4 mt-0'>
                                <span className='flex bg-gradient-to-b from-yellow-500 to-yellow-600 text-white w-[60px] h-[60px] text-2xl rounded-full justify-center items-center'>
                                    {Item.icon}
                                </span>
                                <div className='flex-1'>
                                    <h4 className='text-zinc-800 text-2xl font-bold'>{Item.title}</h4>
                                    <p className='text-zinc-600 mt-2'>{Item.para}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
