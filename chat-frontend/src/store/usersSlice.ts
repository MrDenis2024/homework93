import {GlobalError, User, ValidationError} from '../types';
import {createSlice} from '@reduxjs/toolkit';
import {login, register} from './usersThunks';

export interface UsersState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
}

const initialState: UsersState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state: UsersState) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state: UsersState) => {
      state.registerLoading = true;
      state.registerError = null;
    }).addCase(register.fulfilled, (state: UsersState, {payload: user}) => {
      state.registerLoading = false;
      state.user = user;
    }).addCase(register.rejected, (state: UsersState, {payload: error}) => {
      state.registerLoading = false;
      state.registerError = error || null;
    });

    builder.addCase(login.pending, (state: UsersState) => {
      state.loginError = null;
      state.loginLoading = true;
    }).addCase(login.fulfilled, (state: UsersState, {payload: user}) => {
      state.loginLoading = false;
      state.user = user;
    }).addCase(login.rejected, (state: UsersState, {payload: error}) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });
  },
  selectors: {
    selectUser: (state: UsersState) => state.user,
    selectRegisterLoading: (state: UsersState) => state.registerLoading,
    selectRegisterError: (state: UsersState) => state.registerError,
    selectLoginLoading: (state: UsersState) => state.loginLoading,
    selectLoginError: (state: UsersState) => state.loginError,
  },
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser} = usersSlice.actions;
export const {
  selectUser,
  selectRegisterLoading,
  selectRegisterError,
  selectLoginLoading,
  selectLoginError,
} = usersSlice.selectors;