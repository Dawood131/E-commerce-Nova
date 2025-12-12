import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/Products/ProductCard";
import productsData from "../components/data/products";
import Navbar from "../components/Layout/Navbar";

const CartPage = () => {
  const cart = useSelector(state => state.cart.items);
  const cartProducts = productsData.filter(p => cart[p.id] > 0);

  if (!cartProducts.length)
    return <p className="text-center mt-10 text-gray-500">Cart is empty</p>;

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {cartProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CartPage;
