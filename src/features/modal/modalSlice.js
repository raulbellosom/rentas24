import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  modalType: null,
  modalProps: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    getModal: (state, action) => {
      try {
        const { modal, modalType, modalProps } = action.payload;
        state.modal = modal;
        state.modalType = modalType;
        state.modalProps = modalProps;
      } catch (error) {
        console.log(error);
      }
    },
    closeModal: (state, action) => {
      try {
        state.modal = false;
        state.modalType = null;
        state.modalProps = {};
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const { getModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
