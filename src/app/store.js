import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import modalSlice from "../features/modal/modalSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
