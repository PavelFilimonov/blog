import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Avatar } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { v4 } from 'uuid';
import { format, parseISO } from 'date-fns';

import classes from './PostItem.module.scss';

export default function PostItem({
  title,
  description,
  tagList,
  author,
  updatedAt,
  favorited,
  favoritesCount,
  slug,
  onLikes,
}) {
  return (
    <li className={classes.postsItem}>
      <section className={classes.postsItem_content}>
        <span className={classes.postsItem_content_header}>
          <Link className={classes.postsItem_content_title} to={`/${slug}`}>
            {title}
          </Link>
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            color="warning"
            checked={favorited}
            onChange={(e) => onLikes(e, slug)}
          />
          <span>{favoritesCount}</span>
        </span>
        <ul className={classes.postsItem_content_tags}>
          {tagList &&
            tagList.map((tag) => {
              if (tag) {
                return (
                  <li key={v4()}>
                    <span className={classes.postsItem_content_tag}>{tag}</span>
                  </li>
                );
              }
            })}
        </ul>
        <p className={classes.postsItem_content_desc}>{description}</p>
      </section>
      <section className={classes.postsItem_data}>
        <article className={classes.postsItem_data_autor}>
          <span className={classes.postsItem_data_autor_name}>{author.username}</span>
          <span className={classes.postsItem_data_autor_date}>{format(parseISO(updatedAt), 'MMMM d, yyyy')}</span>
        </article>
        {author.image ? (
          <Avatar alt={author.username} src={author.image} />
        ) : (
          <div className={classes.postsItem_data_avatar} />
        )}
      </section>
    </li>
  );
}
