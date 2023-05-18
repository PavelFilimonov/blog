import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { updateProfile } from '../../store/userSlice';

import classes from './EditProfile.module.scss';

const schema = yup
  .object({
    username: yup
      .string()
      .matches(/^[a-z][a-z0-9]*$/, 'Is not in correct format')
      .min(3)
      .max(20)
      .required(),
    email: yup.string().email().required(),
    password: yup.string().min(6, 'Your password needs to be at least 6 characters.').max(40),
    image: yup.string().url(),
  })
  .required();

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const email = useSelector((state) => state.user.email);
  const password = useSelector((state) => state.user.password);
  const image = useSelector((state) => state.user.image);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      username: username,
      email: email,
      image: image,
      password: password,
    },
  });

  const onUpdate = (event) => {
    const data = {
      username: event.username,
      email: event.email,
      password: event.password,
      bio: 'bio',
      image: event.image,
    };
    dispatch(updateProfile(data)).then(() => navigate('/'));
  };

  return (
    <Box id="editProfile" component="form" className={classes.editProfile} onSubmit={handleSubmit(onUpdate)}>
      <h2 className={classes.editProfile_title}>Edit Profile</h2>
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        className="edit-profile_form_item"
        error={errors?.username}
        helperText={errors?.username?.message}
        {...register('username')}
      />
      <TextField
        id="email"
        label="Email address"
        variant="outlined"
        className={classes.editProfile_form_item}
        error={errors?.email}
        helperText={errors?.email?.message}
        {...register('email')}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl variant="outlined" className={classes.editProfile_form_item} error={errors?.password} {...field}>
            <InputLabel htmlFor="outlined-adornment-password">New password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New password"
            />
            <FormHelperText id="component-helper-text" error={errors?.password}>
              {errors?.password?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <TextField
        id="image"
        label="Avatar image (url)"
        variant="outlined"
        className={classes.editProfile_form_item}
        error={errors?.image}
        helperText={errors?.image?.message}
        {...register('image')}
      />
      <Button type="submit" variant="contained" className={classes.editProfile_form_btn}>
        Save
      </Button>
    </Box>
  );
}
