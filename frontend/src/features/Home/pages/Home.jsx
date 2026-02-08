import React, { useEffect } from 'react'
import Carousel from '../../../shared/components/Carousel'
import Process from '../../../shared/components/Process'
import Footer from '../../../shared/Layout/Footer'
import all_product from '../../Products/data/products'
import ProductCarousel from '../../Products/components/ProductCarousel'
import Header from '../../../shared/components/Header'

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
