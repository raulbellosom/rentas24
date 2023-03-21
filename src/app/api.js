import axios from "axios";

export const urlEnv = import.meta.env.VITE_APP_API_URL;

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

export const handleSignUp = async (data) => {
  try {
    const res = await axios.post(`${urlEnv}auth/signup`, data, config);
    return res;
  } catch (error) {
    return error;
  }
};

export const handleSignIn = async (data) => {
  try {
    const res = await axios.post(`${urlEnv}auth/signin`, data, config);
    return res;
  } catch (error) {
    return error.response;
  }
};
