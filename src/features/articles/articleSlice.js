import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [],
  ownerArticles: [],
  article: {},
  error: null,
};

export const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    getOwnerArticles: (state, action) => {
      try {
        const data = action.payload;
        state.ownerArticles = data.articles;
      } catch (error) {
        console.log(error);
      }
    },
    getArticles: (state, action) => {
      try {
        const { data } = action.payload;
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
  getOwnerArticles,
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = articleSlice.actions;

export default articleSlice.reducer;
