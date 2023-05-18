import { Routes, Route } from 'react-router-dom';

import './App.css';
import CreateNewArticle from './components/CreateNewArticle';
import EditArticle from './components/EditArticle';
import EditProfile from './components/EditProfile';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import PostPage from './components/PostPage';
import RequireAuth from './components/RequireAuth';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

export default function App() {
  const path = {
    mainPath: '/',
    post: '/:slug',
    post_edit: '/:slug/edit',
    new_post: 'new-article',
    login: 'login',
    registration: 'registration',
    profile_edit: 'edit-profile',
  };

  return (
    <div className="App">
      <Routes>
        <Route path={path.mainPath} element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={path.post} element={<PostPage />} />
          <Route
            path={path.post_edit}
            element={
              <RequireAuth>
                <EditArticle />
              </RequireAuth>
            }
          />
          <Route
            path={path.new_post}
            element={
              <RequireAuth>
                <CreateNewArticle />
              </RequireAuth>
            }
          />
          <Route path={path.login} element={<SignInPage />} />
          <Route path={path.registration} element={<SignUpPage />} />
          <Route
            path={path.profile_edit}
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
