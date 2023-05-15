import axios from "axios";

export const urlEnv = import.meta.env.VITE_APP_API_URL;

let config = {
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

export const handleProfile = async (token) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.get(`${urlEnv}auth/profile`, config);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdateUser = async (token, data) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.patch(
      `${urlEnv}auth/profile/${data.id}`,
      data,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdatePassword = async (token, data) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.patch(
      `${urlEnv}auth/updatePassword/${data.id}`,
      data,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdatePhotoProfile = async (token, body, id) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.patch(
      `${urlEnv}auth/updatePhotoProfile/${id}`,
      body,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleDisableUser = async (token, id, body) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.patch(
      `${urlEnv}auth/disableUser/${id}`,
      body,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

// Article Types

export const handleGetTypes = async () => {
  try {
    const res = await axios.get(`${urlEnv}types`);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleGetType = async (id) => {
  try {
    const res = await axios.get(`${urlEnv}types/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};

// Articles

export const handleGetArticles = async () => {
  try {
    const res = await axios.get(`${urlEnv}articles`);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleGetArticle = async (id) => {
  try {
    const res = await axios.get(`${urlEnv}articles/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleCreateArticle = async (token, data) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.post(`${urlEnv}articles`, data, config);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdateArticle = async (token, id, data) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.patch(`${urlEnv}articles/${id}`, data, config);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteArticle = async (token, id) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.delete(`${urlEnv}articles/${id}`, config);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleGetArticlesByType = async (id) => {
  try {
    const res = await axios.get(`${urlEnv}articles/type/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleGetArticlesByUserId = async (token, id) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.get(`${urlEnv}articles/user/${id}`, config);
    return res;
  } catch (error) {
    return error.response;
  }
};
export const handleGetArticleById = async (token, id) => {
  config.headers["x-access-token"] = token;
  try {
    const res = await axios.get(`${urlEnv}articles/article/${id}`, config);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const handleGetAnnounce = async (id) => {
  try {
    const res = await axios.get(`${urlEnv}articles/anuncio/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};
