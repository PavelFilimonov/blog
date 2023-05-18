import React, { useEffect } from 'react';
import { Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchCreateArticle, setNotCreateArticle } from '../../store/articleSlice';
import ArticleForm from '../ArticleForm';

export default function CreateNewArticle() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.articles.status);
  const err = useSelector((state) => state.articles.error);
  const isCreateArticle = useSelector((state) => state.articles.isCreateArticle);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'resolved' && isCreateArticle) {
      navigate('/', { replace: true });
      dispatch(setNotCreateArticle());
    }
  }, [isCreateArticle, status, navigate, dispatch]);

  return (
    <>
      {status === 'rejected' && <Alert type="error" message={`${err}`} />}
      <ArticleForm submit={(data) => dispatch(fetchCreateArticle(data))} />
    </>
  );
}
