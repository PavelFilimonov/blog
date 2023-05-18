import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const users = axios.create({
  baseURL: 'https://blog.kata.academy/api/',
});
const user = axios.create({
  baseURL: 'https://blog.kata.academy/api/',
});

export const createUser = createAsyncThunk(
  'user/createUser',
  async ({ username, email, password }, { rejectWithValue }) =>
    await users
      .post('users', { user: { username, email, password } })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.message))
);
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) =>
    await users
      .post('users/login', { user: { email, password } })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.message))
);
export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) =>
    await user
      .get('user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('token_log')}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.message))
);
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ username, email, password, bio, image }, { rejectWithValue }) =>
    await user
      .put(
        'user',
        { user: { email, password, username, bio, image } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${Cookies.get('token_log')}`,
          },
        }
      )
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.message))
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null,
    email: null,
    password: null,
    image: null,
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    onLogout(state) {
      state.username = null;
      state.email = null;
      state.password = null;
      state.user = null;
      Cookies.remove('token_log');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      Cookies.set('token_reg', `${action.payload.user.token}`);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.image = action.payload.user.image;
      Cookies.set('token_log', `${action.payload.user.token}`);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      if (action.payload) {
        state.error = action.error.errors.message;
      } else {
        state.error = 'Unauthorized';
      }
    });
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      if (action.payload) {
        state.error = action?.payload?.errors?.body || { body: 'Unauthorized' };
      } else {
        state.error = null;
      }
    });
  },
});

export const { onLogout } = userSlice.actions;
export default userSlice.reducer;
