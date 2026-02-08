// redux/productsSlice.js
import { createSlice } from "@reduxjs/toolkit"
import { products } from "../Products/data/products"

const initialState = {
  items: products 
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload)
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    }
  }
})

export const { addProduct, removeProduct } = productsSlice.actions
export default productsSlice.reducer
