import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginCredentials, RegisterData, Role, OtpVerifyRequest, ResendOtpRequest } from './types';
import { authService } from './authService';

interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OTP verification states
  registerLoading: boolean;
  otpLoading: boolean;
  otpVerified: boolean;
  otpError: string | null;
  pendingVerificationEmail: string | null;
}

const isDev = import.meta.env.MODE === 'development';

const getInitialAuthState = (): AuthState => {
  const storedUser = authService.getStoredUser();
  const storedToken = authService.getStoredToken();

  // Dev mode bypass
  if (isDev && !storedUser) {
    console.log('--- DEV MODE ADMIN BYPASS ACTIVE ---');
    const devAdmin: User = {
      id: 'dev-admin',
      name: 'Dev Admin',
      email: 'admin@dev.local',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    return {
      user: devAdmin,
      token: 'dev-token',
      role: 'admin',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      // OTP verification states
      registerLoading: false,
      otpLoading: false,
      otpVerified: false,
      otpError: null,
      pendingVerificationEmail: null,
    };
  }

  return {
    user: storedUser,
    token: storedToken,
    role: storedUser?.role || null,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
    // OTP verification states
    registerLoading: false,
    otpLoading: false,
    otpVerified: false,
    otpError: null,
    pendingVerificationEmail: null,
  };
};

const initialState: AuthState = getInitialAuthState();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // authService.login() already stores auth data in localStorage
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const googleAuth = createAsyncThunk(
  'auth/google',
  async (token: string, { rejectWithValue }) => {
    try {
      // authService.googleLogin() already stores auth data in localStorage
      const response = await authService.googleLogin(token);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: OtpVerifyRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data: ResendOtpRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOtpError: (state) => {
      state.otpError = null;
    },
    setPendingVerificationEmail: (state, action: PayloadAction<string | null>) => {
      state.pendingVerificationEmail = action.payload;
    },
    resetOtpState: (state) => {
      state.otpLoading = false;
      state.otpVerified = false;
      state.otpError = null;
      state.pendingVerificationEmail = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        console.log('Login successful. State:', { role: state.role, auth: state.isAuthenticated });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.pendingVerificationEmail = action.payload.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload as string;
      })
      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpVerified = true;
        state.pendingVerificationEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
      .addCase(googleAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearOtpError, setPendingVerificationEmail, resetOtpState, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
