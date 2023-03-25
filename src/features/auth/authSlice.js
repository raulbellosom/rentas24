import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getSignIn: (state, action) => {
      try {
        const { data } = action.payload;
        state.token = data.token;
        state.user = data.user;
      } catch (error) {
        console.log(error);
      }
    },
    getSignUp: (state, action) => {
      try {
        const { data } = action.payload;
        state.token = data.token;
        state.user = data.user;
      } catch (error) {
        console.log(error);
      }
    },
    getProfile: (state, action) => {
      try {
        const data = action.payload;
        state.user = data.user;
      } catch (error) {
        console.log(error);
      }
    },
    getSignOut: (state, action) => {
      try {
        state.token = null;
        state.user = {};
        window.localStorage.removeItem("user");
      } catch (error) {
        console.log(error);
      }
    },
    getUpdateProfile: (state, action) => {
      try {
        const { data } = action.payload;
        state.user = data.user;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const {
  getSignIn,
  getSignOut,
  getProfile,
  getSignUp,
  getUpdateProfile,
} = authSlice.actions;

export default authSlice.reducer;
