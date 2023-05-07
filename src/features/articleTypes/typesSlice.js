import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articleTypes: [],
  articleType: {},
  error: null,
};

export const typesSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    getTypes: (state, action) => {
      try {
        const { data } = action.payload;
        state.articleTypes = data.types;
      } catch (error) {
        console.log(error);
      }
    },
    getType: (state, action) => {
      try {
        const { data } = action.payload;
        state.articleType = data.types;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const { getTypes, getType } = typesSlice.actions;

export default typesSlice.reducer;
