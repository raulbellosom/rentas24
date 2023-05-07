import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import modalSlice from "../features/modal/modalSlice";
import typesSlice from "../features/articleTypes/typesSlice";
import articleSlice from "../features/articles/articleSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
    types: typesSlice,
    articles: articleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
