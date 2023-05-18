import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { Checkbox, Avatar, Button, Modal, Typography, Box, CircularProgress } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import Markdown from 'markdown-to-jsx';

import { deleteLike, deletePost, getPostBySlag, postLike } from '../../store/postSlice';
import { fetchArticleSingle } from '../../store/articleSlice';

import classes from './PostPage.module.scss';

export default function PostPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const post = useSelector((state) => state.posts.post);
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(false);

  useEffect(() => {
    dispatch(fetchArticleSingle(slug));
    dispatch(getPostBySlag(slug));
  }, [dispatch, likes, slug]);

  const onLikes = (event) => {
    setLikes(event.target.checked);
    if (event.target.checked) {
      dispatch(postLike(slug));
    } else {
      dispatch(deleteLike(slug));
    }
  };

  const onDelete = () => {
    dispatch(deletePost(slug)).then(() => navigate('/'));
  };

  return !post ? (
    <CircularProgress />
  ) : (
    <section className={classes.post}>
      <header className={classes.post_header}>
        <section className={classes.post_header_info}>
          <p>
            <Link className={classes.post_header_title}>{post?.title}</Link>
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              checked={post?.favorited}
              onChange={onLikes}
              color="warning"
            />
            <span>{post?.favoritesCount}</span>
          </p>

          <ul className={classes.post_header_tags}>
            {post?.tagList &&
              post?.tagList.map((tag, i) => {
                if (tag.trim()) {
                  return (
                    <li key={i}>
                      <span className={classes.post_header_tag}>{tag}</span>
                    </li>
                  );
                }
              })}
          </ul>

          <p className={classes.post_header_desc}>{post?.description}</p>
        </section>
        <div className={classes.post_block}>
          <section className={classes.post_data}>
            <article className={classes.post_data_autor}>
              <span className={classes.post_data_autor_name}>{post?.author.username}</span>
              <span className={classes.post_data_autor_date}>{format(parseISO(post?.updatedAt), 'MMMM d, yyyy')}</span>
            </article>
            {post?.author.image && <Avatar alt={post?.author.username} src={post?.author.image} />}
          </section>
          {user.username === post?.author.username && (
            <section className={classes.post_data_btns}>
              <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
                Delete
              </Button>
              <Modal open={open} onClose={() => setOpen(false)} aria-describedby="modal-description">
                <Box className={classes.modal}>
                  <Typography id="modal-description">Are you sure to delete this article?</Typography>
                  <div className={classes.modal_btns}>
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                      No
                    </Button>
                    <Button variant="contained" style={{ marginLeft: '10px' }} onClick={onDelete}>
                      Yes
                    </Button>
                  </div>
                </Box>
              </Modal>
              <Button variant="outlined" color="success">
                <Link to={`/${slug}/edit`}>Edit</Link>
              </Button>
            </section>
          )}
        </div>
      </header>
      <Markdown className={classes.post_content}>{post?.body}</Markdown>
    </section>
  );
}
