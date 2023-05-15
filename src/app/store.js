import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import modalSlice from "../features/modal/modalSlice";
import typesSlice from "../features/articleTypes/typesSlice";
import articleSlice from "../features/articles/articleSlice";
import recurrenciesSlice from "../features/recurrencies/recurrenciesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
    types: typesSlice,
    articles: articleSlice,
    recurrencies: recurrenciesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
