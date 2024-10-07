import {User} from '../types';
import {createSlice} from '@reduxjs/toolkit';

export interface UsersState {
  user: User | null;
}

const initialState: UsersState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state: UsersState) => state.user,
  },
});

export const usersReducer = userSlice.reducer;
export const {
  selectUser,
} = userSlice.selectors;