import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseApi = 'https://blog.kata.academy/api/';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page, { rejectWithValue }) =>
  axios
    .get(`${baseApi}articles?offset=${(page - 1) * 5}&limit=5`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      return rejectWithValue(err.message);
    })
);

export const fetchArticleSingle = createAsyncThunk(
  'articles/fetchArticleSingle',
  async (slug, { rejectWithValue }) =>
    await axios
      .get(`${baseApi}articles/${slug}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.message))
);

export const fetchCreateArticle = createAsyncThunk(
  'articles/fetchCreateArticle',
  async ({ title, description, body, ...tags }, { rejectWithValue }) => {
    const tagList = Object.values(tags);
    return axios
      .post(
        `${baseApi}articles`,
        {
          article: {
            title,
            description,
            body,
            tagList,
          },
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` } }
      )
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.message));
  }
);

export const fetchEditArticle = createAsyncThunk(
  'articles/fetchEditArticle',
  async ({ title, description, body, ...tags }, { rejectWithValue, getState }) => {
    const tagList = Object.values(tags);
    const slug = getState().articles.articleSingle.slug;
    return await axios
      .put(
        `${baseApi}articles/${slug}`,
        {
          article: {
            title,
            description,
            body,
            tagList,
          },
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` } }
      )
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.message));
  }
);

export const fetchDeleteArticle = createAsyncThunk(
  'articles/fetchDeleteArticle',
  async (_, { rejectWithValue, getState }) => {
    const slug = getState().articles.articleSingle.slug;
    return axios
      .delete(`${baseApi}articles/${slug}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.message));
  }
);

export const fetchFavorites = createAsyncThunk('articles/fetchFavorites', async (slug, { rejectWithValue }) => {
  return axios
    .post(
      `${baseApi}articles/${slug}/favorite`,
      {},
      {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` },
      }
    )
    .then((res) => res.data)
    .catch((err) => rejectWithValue(err.message));
});

export const fetchDeleteFavorites = createAsyncThunk(
  'articles/fetchDeleteFavorites',
  async (slug, { rejectWithValue }) => {
    return axios
      .delete(`${baseApi}articles/${slug}/favorite`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${Cookies.get('token_log')}` },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.message));
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    articleSingle: null,
    isCreateArticle: false,
    count: 0,
    status: 'loading',
    error: null,
  },
  reducers: {
    setNotCreateArticle(state) {
      state.isCreateArticle = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.articles = action.payload.articles;
      state.count = action.payload.articlesCount;
      state.status = 'resolved';
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchArticleSingle.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchArticleSingle.fulfilled, (state, action) => {
      state.status = 'resolved';
      state.articleSingle = action.payload.article;
    });
    builder.addCase(fetchArticleSingle.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchCreateArticle.pending, (state) => {
      state.status = 'loading';
      state.error = null;
      state.isCreateArticle = false;
    });
    builder.addCase(fetchCreateArticle.fulfilled, (state) => {
      state.status = 'resolved';
      state.isCreateArticle = true;
    });
    builder.addCase(fetchCreateArticle.rejected, (state, action) => {
      state.isCreateArticle = false;
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchEditArticle.pending, (state) => {
      state.status = 'loading';
      state.error = null;
      state.isCreateArticle = false;
    });
    builder.addCase(fetchEditArticle.fulfilled, (state) => {
      state.status = 'resolved';
      state.isCreateArticle = true;
    });
    builder.addCase(fetchEditArticle.rejected, (state, action) => {
      state.isCreateArticle = false;
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchDeleteArticle.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchDeleteArticle.fulfilled, (state) => {
      state.status = 'resolved';
    });
    builder.addCase(fetchDeleteArticle.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchFavorites.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(fetchDeleteFavorites.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
  },
});

export const { setNotCreateArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
