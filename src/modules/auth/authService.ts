import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  RegisterResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginApiResponse,
  ForgotPasswordResponse,
  VerifyResetOtpResponse,
  ResetPasswordResponse,
  Role,
  UpdateAdminPasswordRequest,
  UpdateAdminPasswordResponse,
} from "./types";
import { googleLogout } from "@react-oauth/google";
import api from "../../services/api";

// Helper to convert backend role to frontend role
const normalizeRole = (backendRole: string): Role => {
  const roleMap: Record<string, Role> = {
    ROLE_USER: "user",
    ROLE_FARMER: "farmer",
    ROLE_WHOLESALER: "wholesaler",
    ROLE_ADMIN: "admin",
  };
  return roleMap[backendRole] || "user";
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: LoginApiResponse;
      }>("/v1/auth/login", credentials);

      const loginData = response?.data?.data;
      if (!loginData) {
        throw new Error("Invalid login response");
      }

      // Transform backend response to frontend AuthResponse
      const user: User = {
        id: loginData.userId,
        email: loginData.email,
        name: `${loginData.firstName} ${loginData.lastName}`,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        role: normalizeRole(loginData.role),
      };

      const authData: AuthResponse = {
        user,
        token: loginData.accessToken,
        refreshToken: loginData.refreshToken,
      };

      // Store auth data on successful login
      this.setAuthData(authData.token, authData.user);
      return authData;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "Login failed",
      );
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const payload: Record<string, string> = {
        firstName: data.name.split(" ")[0],
        lastName:
          data.name.split(" ").slice(1).join(" ") || data.name.split(" ")[0],
        email: data.email,
        password: data.password,
        role: `ROLE_${data.role.toUpperCase()}`,
      };
      if (data.phone) {
        payload.phone = data.phone;
      }
      console.log("Register payload:", payload);
      const response = await api.post<{ data: string }>(
        "/v1/auth/register",
        payload,
      );
      return {
        message: response.data.data,
        email: data.email,
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "Registration failed",
      );
    }
  },

  async verifyOtp(data: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    try {
      const response = await api.post<{ data: string }>(
        "/v1/auth/verify-otp",
        data,
      );
      return { message: response.data.data };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "OTP verification failed",
      );
    }
  },

  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await api.post<{ data: string }>(
        "/v1/auth/resend-otp",
        data,
      );
      return { message: response.data.data };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "Failed to resend OTP",
      );
    }
  },

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<{ data: AuthResponse }>(
        "/v1/auth/google",
        { token: googleToken },
      );
      const authData = response.data.data;
      this.setAuthData(authData.token, authData.user);
      return authData;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "Google login failed",
      );
    }
  },

  async logout(): Promise<void> {
    googleLogout(); // Revoke Google session
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ data: User }>("/v1/auth/me");
      return response.data.data;
    } catch {
      // If API fails, try to get from localStorage
      return this.getStoredUser();
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem("token");
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setAuthData(token: string, user: User): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: string;
      }>("/v1/auth/forgot-password", { email });
      return {
        success: response.data.success,
        message:
          response.data.message ||
          response.data.data ||
          "OTP sent to your email",
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset OTP",
      );
    }
  },

  async verifyResetOtp(
    email: string,
    otp: string,
  ): Promise<VerifyResetOtpResponse> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: { resetToken: string };
      }>("/v1/auth/verify-reset-otp", { email, otp });
      return {
        success: response.data.success,
        message: response.data.message,
        resetToken: response.data.data?.resetToken,
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message || err.message || "Invalid or expired OTP",
      );
    }
  },

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/v1/auth/reset-password",
        {
          email,
          resetToken,
          newPassword,
        },
      );
      return {
        success: response.data.success,
        message: response.data.message || "Password reset successful",
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password",
      );
    }
  },

  async createAdmin(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    try {
      const response = await api.post<{ data: string }>(
        "/v1/auth/create-admin",
        data,
      );
      return { message: response.data.data || "Admin created successfully" };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create admin account",
      );
    }
  },

  async updateAdminPassword(
    data: UpdateAdminPasswordRequest,
  ): Promise<UpdateAdminPasswordResponse> {
    try {
      const response = await api.put<{ success: boolean; message: string }>(
        "/admin/change-password",
        data,
      );
      return { message: response.data.message || "Password updated successfully" };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password",
      );
    }
  },
};
