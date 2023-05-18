import { configureStore } from '@reduxjs/toolkit';

import articleSlice from './articleSlice';
import postSlice from './postSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    posts: postSlice,
    user: userSlice,
    articles: articleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
