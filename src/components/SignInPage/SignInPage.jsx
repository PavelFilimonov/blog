import React, { useState } from 'react';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { loginUser } from '../../store/userSlice';

import classes from './SignInPage.module.scss';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6, 'Your password needs to be at least 6 characters.').max(40).required(),
});

export default function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
  });

  const login = (event) => {
    dispatch(loginUser(event));
    navigate(location.state ? location.state.from.pathname : '/');
  };

  return (
    <div className={classes.singIn}>
      <Box component="form" className={classes.singIn_form} onSubmit={handleSubmit(login)}>
        <h2 className={classes.singIn_title}>Sign In</h2>
        <TextField
          id="email"
          label="Email address"
          variant="outlined"
          className={classes.singIn_form_item}
          error={errors?.email}
          helperText={errors?.email?.message}
          {...register('email')}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl variant="outlined" className={classes.singIn_form_item} error={errors?.password} {...field}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                label="Password"
              />
              <FormHelperText id="component-helper-text" error={errors?.password}>
                {errors?.password?.message}
              </FormHelperText>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
      <p className={classes.singIn_form_footer}>
        Don’t have an account? <Link to="/registration">Sign Up.</Link>
      </p>
    </div>
  );
}
