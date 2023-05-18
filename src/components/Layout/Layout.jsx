import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Avatar } from '@mui/material';

import { getUser, onLogout } from '../../store/userSlice';

import 'react-toastify/dist/ReactToastify.css';

import classes from './Layout.module.scss';

export default function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.posts.error);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const onClickHandler = () => {
    dispatch(onLogout());
  };
  if (error) {
    toast.error(error.body);
  }
  return (
    <>
      <header className={classes.header}>
        <Link to="/" className={classes.header_logo}>
          Realworld Blog
        </Link>
        {!user ? (
          <section className={classes.header_login}>
            <Link to="/login" className={classes.header_login_signIn} state={{ from: location }}>
              Sign In
            </Link>
            <Link to="/registration" className={classes.header_login_signUp}>
              Sign Up
            </Link>
          </section>
        ) : (
          <section className={classes.header_login}>
            <Link className={classes.header_login_createPost} to="/new-article">
              Create article
            </Link>
            <article className={classes.header_login_user} onClick={() => navigate('/edit-profile')}>
              <span className={classes.header_login_user_name}>{user.username}</span>
              <Avatar alt={user.username} src={user.image} />
            </article>
            <Link className={classes.header_login_logOut} onClick={onClickHandler}>
              Log Out
            </Link>
          </section>
        )}
      </header>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main className={classes.main}>
        <Outlet />
      </main>
    </>
  );
}
