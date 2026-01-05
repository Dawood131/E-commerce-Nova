import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import Header from '../components/Header.jsx/Header'

const Contact = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
       <div className="md:hidden  w-full flex justify-center items-center py-2">
          <NavLink to="/">
            <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
          </NavLink>
        </div>
      <Header />
      <Footer />
    </div>

  )
}

export default Contact