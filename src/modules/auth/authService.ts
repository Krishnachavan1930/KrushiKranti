import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  RegisterResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ResendOtpRequest,
  ResendOtpResponse
} from './types';
import { googleLogout } from '@react-oauth/google';
import api from '../../services/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<{ data: AuthResponse }>('/v1/auth/login', credentials);
      const authData = response.data.data;
      // Store auth data on successful login
      this.setAuthData(authData.token, authData.user);
      return authData;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Login failed');
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const payload: Record<string, string> = {
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0],
        email: data.email,
        password: data.password,
        role: `ROLE_${data.role.toUpperCase()}`
      };
      if (data.phone) {
        payload.phone = data.phone;
      }
      console.log('Register payload:', payload);
      const response = await api.post<{ data: string }>('/v1/auth/register', payload);
      return { 
        message: response.data.data, 
        email: data.email 
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Registration failed');
    }
  },

  async verifyOtp(data: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    try {
      const response = await api.post<{ data: string }>('/v1/auth/verify-otp', data);
      return { message: response.data.data };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'OTP verification failed');
    }
  },

  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await api.post<{ data: string }>('/v1/auth/resend-otp', data);
      return { message: response.data.data };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Failed to resend OTP');
    }
  },

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<{ data: AuthResponse }>('/v1/auth/google', { token: googleToken });
      const authData = response.data.data;
      this.setAuthData(authData.token, authData.user);
      return authData;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Google login failed');
    }
  },

  async logout(): Promise<void> {
    googleLogout(); // Revoke Google session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ data: User }>('/v1/auth/me');
      return response.data.data;
    } catch {
      // If API fails, try to get from localStorage
      return this.getStoredUser();
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
