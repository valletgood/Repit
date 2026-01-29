import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  userId: string | null;
  name: string | null;
  gender: string | null;
  lastLoginAt: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: null,
  userId: null,
  name: null,
  gender: null,
  lastLoginAt: null,
  isLoggedIn: false,
};

export interface LoginPayload {
  id: string;
  userId: string;
  name: string;
  gender: string;
  lastLoginAt: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.id = action.payload.id;
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.gender = action.payload.gender;
      state.lastLoginAt = action.payload.lastLoginAt;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.id = null;
      state.userId = null;
      state.name = null;
      state.gender = null;
      state.lastLoginAt = null;
      state.isLoggedIn = false;
    },
    updateUser: (state, action: PayloadAction<Partial<LoginPayload>>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.gender) state.gender = action.payload.gender;
      if (action.payload.lastLoginAt) state.lastLoginAt = action.payload.lastLoginAt;
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
