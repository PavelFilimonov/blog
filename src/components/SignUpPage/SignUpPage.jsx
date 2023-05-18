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
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { createUser } from '../../store/userSlice';

import classes from './SignUpPage.module.scss';

const schema = yup
  .object({
    username: yup
      .string()
      .matches(/^[a-z][a-z0-9]*$/, 'Is not in correct format')
      .min(3)
      .max(20)
      .required(),
    email: yup.string().email().required(),
    password: yup.string().min(6, 'Your password needs to be at least 6 characters.').max(40).required(),
    checkpass: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required(),
  })
  .required();

export default function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const onCreateNew = (event) => {
    const data = {
      username: event.username,
      email: event.email,
      password: event.password,
    };
    dispatch(createUser(data)).then(() => navigate('/login'));
  };

  return (
    <Box id="createNew" component="form" className={classes.createNewAcc} onSubmit={handleSubmit(onCreateNew)}>
      <h2 className={classes.createNewAcc_title}>Create new account</h2>
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        className={classes.createNewAcc_form_item}
        error={errors?.username}
        helperText={errors?.username?.message}
        {...register('username')}
      />
      <TextField
        id="email"
        label="Email address"
        variant="outlined"
        className={classes.createNewAcc_form_item}
        error={errors?.email}
        helperText={errors?.email?.message}
        {...register('email')}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            className={classes.createNewAcc_form_item}
            error={errors?.password}
            {...field}
          >
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
      <Controller
        name="checkpass"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            className={classes.createNewAcc_form_item}
            error={errors?.checkpass}
            {...field}
          >
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
            <FormHelperText id="component-helper-text" error={errors?.checkpass}>
              {errors?.checkpass?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <FormGroup>
        <FormControlLabel
          control={<Checkbox defaultChecked {...register('checkbox')} />}
          label="I agree to the processing of my personal 
  information"
          className={classes.createNewAcc_form_checkbox}
        />
      </FormGroup>
      <Button type="submit" variant="contained" className={classes.createNewAcc_form_item}>
        Create
      </Button>
      <p className={classes.createNewAcc_form_footer}>
        Already have an account? <Link to="/login">Sign In.</Link>
      </p>
    </Box>
  );
}
