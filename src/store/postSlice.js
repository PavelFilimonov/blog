import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const blog = axios.create({
  baseURL: 'https://blog.kata.academy/api/articles/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${Cookies.get('token_log')}`,
  },
});
const post = axios.create({
  baseURL: 'https://blog.kata.academy/api/',
});

export const getPosts = createAsyncThunk(
  'blog/getPosts',
  async (page, { rejectWithValue }) =>
    await blog
      .get(`?limit=5&offset=${(page - 1) * 5}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('token_log')}`,
        },
      })
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

export const getPostBySlag = createAsyncThunk(
  'blog/getPost',
  async (slug, { rejectWithValue }) =>
    await blog
      .get(slug, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('token_log')}`,
        },
      })
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async ({ title, description, body, tagList }, { rejectWithValue }) =>
    await post
      .post(
        'articles',
        { article: title, description, body, tagList },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${Cookies.get('token_log')}`,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (slug, { rejectWithValue }) =>
    await blog
      .delete(`${slug}`)
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

export const postLike = createAsyncThunk(
  'blog/postLike',
  async (slug, { rejectWithValue }) =>
    await blog
      .post(`${slug}/favorite`)
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

export const deleteLike = createAsyncThunk(
  'blog/deleteLike',
  async (slug, { rejectWithValue }) =>
    await blog
      .delete(`${slug}/favorite`)
      .then((response) => response.data)
      .catch((err) => rejectWithValue(err.message))
);

const postSlice = createSlice({
  name: 'blog',
  initialState: {
    dataOfPosts: {},
    posts: [],
    loading: false,
    error: null,
    slug: null,
    post: null,
  },
  reducers: {
    clickOnTitle(state, action) {
      state.slug = action.payload;
    },
    clickOnEdit(state, action) {
      state.post = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.dataOfPosts = action.payload;
      state.posts = action.payload.articles;
      state.error = null;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(getPostBySlag.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPostBySlag.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action.payload.article;
    });
    builder.addCase(getPostBySlag.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(postLike.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(postLike.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action.payload.article;
    });
    builder.addCase(postLike.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(deleteLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLike.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action.payload.article;
    });
    builder.addCase(deleteLike.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action.payload;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
  },
});

export const { clickOnTitle, clickOnEdit } = postSlice.actions;
export default postSlice.reducer;
