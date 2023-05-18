import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchEditArticle } from '../../store/articleSlice';
import { getPostBySlag } from '../../store/postSlice';
import ArticleForm from '../ArticleForm';

export default function EditArticle() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => state.posts.post);
  const loading = useSelector((state) => state.posts.loading);

  useEffect(() => {
    dispatch(getPostBySlag(slug));
  }, [dispatch, slug]);

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <ArticleForm
        title="Edit article"
        submit={(data) => dispatch(fetchEditArticle(data)).then(() => navigate('/'))}
        article={post}
      />
      ;
    </>
  );
}
