import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { v4 } from 'uuid';
import classNames from 'classnames';

import classes from './ArticleForm.module.scss';

export default function ArticleForm({ title = 'Create new article', submit, article }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: article?.title,
      description: article?.description,
      body: article?.body,
    },
  });

  const onSubmit = (data) => {
    const dataForm = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== undefined) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    submit(dataForm);
  };

  const [tagList, setTagList] = useState(
    article?.tagList.map((tag) => ({ body: tag, id: v4() })) || [{ body: '', id: v4() }]
  );

  const addTag = () => {
    setTagList((state) => [...state, { body: '', id: v4() }]);
  };

  const deleteTag = (id) => {
    setTagList((state) => state.filter((tag) => tag.id !== id));
    resetField(`${id}`);
  };

  const elements = tagList.map((tag) => (
    <Tag key={tag.id} deleteTag={() => deleteTag(tag.id)} register={register} id={tag.id} text={tag.body} />
  ));

  const btnClass = classNames({
    [`${classes.btn}`]: elements.length,
    [`${classes['btn-empty']}`]: !elements.length,
  });

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 3,
          }}
          {...register('title', { required: 'Поле Title должно быть заполнено' })}
          error={!!errors?.title}
          helperText={errors?.title?.message}
        />
        <TextField
          id="description"
          label="Short description"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 3,
          }}
          {...register('description', { required: 'Поле Short description должно быть заполнено' })}
          error={!!errors?.shortDescription}
          helperText={errors?.shortDescription?.message}
        />
        <TextField
          id="body"
          label="Text"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          minRows={6}
          sx={{
            mb: 3,
          }}
          {...register('body', { required: 'Поле Text должно быть заполнено' })}
          error={!!errors?.body}
          helperText={errors?.body?.message}
        />
        <div className={classes['tag-container']}>
          <div>{elements}</div>
          <Button
            className={btnClass}
            variant="outlined"
            size="small"
            onClick={addTag}
            sx={{
              height: 42,
            }}
          >
            Add tag
          </Button>
        </div>
        <div>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

const Tag = ({ deleteTag, register, id, text }) => {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        id={id}
        label="Tag"
        variant="outlined"
        size="small"
        defaultValue={text}
        {...register(id)}
        sx={{
          mb: 3,
          width: 300,
        }}
      />
      <Button
        variant="outlined"
        size="small"
        color="error"
        onClick={deleteTag}
        sx={{
          height: 42,
        }}
      >
        Delete
      </Button>
    </Stack>
  );
};
