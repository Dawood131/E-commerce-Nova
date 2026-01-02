import React, { useEffect } from 'react'
import Carousel from '../components/Carousel/Carousel'
import Process from '../components/Process/Process'
import Footer from '../components/Layout/Footer'
import all_product from '../components/data/products'
import ProductCarousel from '../components/Carousel/ProductCarousel'
import Header from '../components/Header.jsx/Header'

const Home = () => {
  const bestsellerProducts = all_product.filter(p => p.bestseller);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div>
      <Header />
      <Carousel />
      <ProductCarousel products={bestsellerProducts} />
      <Process />
      <Footer />
    </div>
  )
}

export default Home
