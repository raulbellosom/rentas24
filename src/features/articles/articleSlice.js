import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [],
  article: {},
  error: null,
};

export const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    getArticles: (state, action) => {
      try {
        const data = action.payload;
        state.articles = data.articles;
      } catch (error) {
        console.log(error);
      }
    },
    getArticle: (state, action) => {
      try {
        const { data } = action.payload;
        state.article = data.article;
      } catch (error) {
        console.log(error);
      }
    },
    createArticle: (state, action) => {
      try {
        const { data } = action.payload;
        state.articles.push(data.article);
      } catch (error) {
        console.log(error);
      }
    },
    updateArticle: (state, action) => {
      try {
        const { data } = action.payload;
        state.articles = state.articles.map((article) =>
          article._id === data.article._id ? data.article : article
        );
      } catch (error) {
        console.log(error);
      }
    },
    deleteArticle: (state, action) => {
      try {
        const { data } = action.payload;
        state.articles = state.articles.filter(
          (article) => article._id !== data.article._id
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = articleSlice.actions;

export default articleSlice.reducer;
