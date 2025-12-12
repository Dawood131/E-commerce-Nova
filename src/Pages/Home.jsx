import React from 'react'
import Navbar from '../components/Layout/Navbar'
import Carousel from '../components/Carousel/Carousel'
import Process from '../components/Process/Process'
import Footer from '../components/Layout/Footer'
import all_product from '../components/data/products'
import ProductCarousel from '../components/Carousel/ProductCarousel'

const Home = () => {
  const bestsellerProducts = all_product.filter(p => p.bestseller);
  return (
    <div>
      <Navbar />
      <Carousel />
       <ProductCarousel products={bestsellerProducts}/>
      <Process />
      <Footer />
    </div>
  )
}

export default Home
