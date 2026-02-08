import { createSlice } from "@reduxjs/toolkit";

const uiModalSlice = createSlice({
  name: "uiModal",
  initialState: {
    isOpen: false,
    type: null, 
    product: null, 
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;  
      state.product = action.payload.product || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.product = null;
    },
  },
});

export const { openModal, closeModal } = uiModalSlice.actions;
export default uiModalSlice.reducer;
