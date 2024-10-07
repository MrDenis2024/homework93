import {createAsyncThunk} from '@reduxjs/toolkit';
import {GlobalError, LoginMutation, RegisterMutation, User, ValidationError} from '../types';
import {isAxiosError} from 'axios';
import axiosApi from '../axiosApi';
import {unsetUser} from './usersSlice';
import {RootState} from '../app/store';

export const register = createAsyncThunk<User, RegisterMutation, {rejectValue: ValidationError}>('users/register', async (registerMutation, {rejectWithValue}) => {
  try {
    const {data: user} = await axiosApi.post('/users', registerMutation);
    return user;
  } catch (e) {
    if(isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const login = createAsyncThunk<User, LoginMutation, {rejectValue: GlobalError}>('users/login', async (loginMutatin, {rejectWithValue}) => {
  try {
    const {data: user} = await axiosApi.post('/users/sessions', loginMutatin);
    return user;
  } catch (e) {
    if(isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const logout = createAsyncThunk<void, void, {state: RootState}>('users/logout', async (_arg, {dispatch, getState}) => {
  const token = getState().users.user?.token;
  await axiosApi.delete('/users/sessions', {headers: {'Authorization' : `Bearer ${token}`}});
  dispatch(unsetUser());
});