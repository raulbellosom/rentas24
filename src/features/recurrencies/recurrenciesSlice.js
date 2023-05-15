import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recurrencies: [],
};

export const recurrenciesSlice = createSlice({
  name: "recurrencies",
  initialState,
  reducers: {
    getRecurrencies: (state, action) => {
      try {
        const { data } = action.payload;
        state.recurrencies = data.recurrencies;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const { getRecurrencies } = recurrenciesSlice.actions;

export default recurrenciesSlice.reducer;
