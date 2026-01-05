import React, { useState, useEffect } from "react";
import TopbarTrackorder from "../TopbarTrackOrder/TopbarTrackorder";
import Navbar from "../Layout/Navbar";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 36) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Heights
    const topbarHeight = 36; // px
    const navbarHeight = 10; // px

    return (
        <div className="w-full relative">
            {/* Topbar only on desktop */}
            <div
                className={`transition-transform duration-200 ease-in-out ${scrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    }`}
            >
                <TopbarTrackorder />
            </div>

            {/* Navbar */}
            <div
                className={`w-full transition-all duration-200 ease-in-out ${scrolled ? "fixed top-0 z-50 shadow-md" : "relative shadow-none"
                    }`}
            >
                <Navbar />
            </div>

            {/* Spacer div for desktop only */}
            <div
                className="hidden md:block w-full"
                style={{ height: `${scrolled ? navbarHeight : topbarHeight + navbarHeight}px` }}
            ></div>
        </div >
    );
};

export default Header;
