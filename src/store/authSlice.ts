import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api, TOKEN_STORAGE_KEY } from '@/lib/api';
import { ApiResponse, User } from '@/types/api';

interface AuthState {
  token: string | null;
  user: User | null;
  loggedIn: boolean;
  hydrated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loggedIn: false,
  hydrated: false,
  status: 'idle',
  error: null,
};

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  occupation: string;
  email: string;
  password: string;
}

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const response = await api.get<ApiResponse<User>>('/api/v1/users/fetch');
  return response.data.data;
});

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { dispatch }) => {
    const response = await api.post<ApiResponse<User>>('/api/v1/sessions', payload);
    const token = response.data.data.token as string;

    dispatch(setToken(token));
    await dispatch(fetchCurrentUser());

    return token;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { dispatch }) => {
    const response = await api.post<ApiResponse<User>>('/api/v1/users', payload);
    const token = response.data.data.token as string;

    dispatch(setToken(token));
    await dispatch(fetchCurrentUser());

    return token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.loggedIn = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, action.payload);
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.loggedIn = false;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
    hydrateFromStorage(state, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.token = action.payload;
        state.loggedIn = true;
      }
      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Register failed';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setToken, setUser, logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;
