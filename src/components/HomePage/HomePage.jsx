import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Pagination } from '@mui/material';

import { deleteLike, getPosts, postLike } from '../../store/postSlice';
import PostItem from '../PostItem';
import classes from './HomePage.module.scss';

export default function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const dataOfPosts = useSelector((state) => state.posts.dataOfPosts);
  const user = useSelector((state) => state.user.user);
  const [page, setPage] = useState(1);
  const loading = useSelector((state) => state.posts.loading);

  useEffect(() => {
    dispatch(getPosts(page));
  }, [dispatch, page, user]);

  const onLikes = (event, slug) => {
    if (event.target.checked) {
      dispatch(postLike(slug));
    } else {
      dispatch(deleteLike(slug));
    }
  };

  return (
    posts && (
      <>
        {loading && <CircularProgress />}

        <ul className={classes.posts}>
          {posts && posts.map((post) => <PostItem {...post} key={post.slug} onLikes={onLikes} />)}
        </ul>
        <Pagination
          count={dataOfPosts.articlesCount ? Math.ceil(dataOfPosts.articlesCount / 5) : 0}
          style={{ paddingBottom: 20 }}
          page={page}
          color="primary"
          shape="rounded"
          onChange={(e, numberOfPage) => setPage(numberOfPage)}
        />
      </>
    )
  );
}
