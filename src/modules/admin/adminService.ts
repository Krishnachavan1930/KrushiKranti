import api from '../../services/api';
import type { AdminUser } from './types';

// Helper to extract error message from API errors
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message || err.message || defaultMsg;
};

export interface PaginatedUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export const adminService = {
  /**
   * Get paginated list of all users (Admin only)
   */
  async getAllUsers(page: number = 0, size: number = 20): Promise<PaginatedUsersResponse> {
    try {
      const response = await api.get<{
        data: {
          content: Array<{
            id: number;
            name: string;
            email: string;
            firstName: string;
            lastName: string;
            phone?: string;
            profileImageUrl?: string;
            role: string;
            status: string;
            createdAt: string;
            lastLogin?: string;
          }>;
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
        };
      }>(`/v1/users?page=${page}&size=${size}`);

      const pageData = response.data.data;
      return {
        users: pageData.content.map((u) => ({
          id: String(u.id),
          name: u.name || `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role as AdminUser['role'],
          status: u.status as AdminUser['status'],
          createdAt: u.createdAt,
          lastLogin: u.lastLogin,
        })),
        total: pageData.totalElements,
        page: pageData.number,
        size: pageData.size,
        totalPages: pageData.totalPages,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch users'));
    }
  },

  /**
   * Ban a user (Admin only)
   */
  async banUser(userId: string): Promise<AdminUser> {
    try {
      const response = await api.put<{
        data: {
          id: number;
          name: string;
          email: string;
          role: string;
          status: string;
          createdAt: string;
          lastLogin?: string;
        };
      }>(`/v1/users/${userId}/ban`);

      const u = response.data.data;
      return {
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role as AdminUser['role'],
        status: u.status as AdminUser['status'],
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to ban user'));
    }
  },

  /**
   * Unban a user (Admin only)
   */
  async unbanUser(userId: string): Promise<AdminUser> {
    try {
      const response = await api.put<{
        data: {
          id: number;
          name: string;
          email: string;
          role: string;
          status: string;
          createdAt: string;
          lastLogin?: string;
        };
      }>(`/v1/users/${userId}/unban`);

      const u = response.data.data;
      return {
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role as AdminUser['role'],
        status: u.status as AdminUser['status'],
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to unban user'));
    }
  },

  /**
   * Delete a user (Admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/v1/users/${userId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete user'));
    }
  },

  async getAdminLogs(
    page: number = 0,
    size: number = 20,
    search?: string,
    type?: string,
  ): Promise<{
    logs: Array<{
      id: number;
      adminId: number;
      adminName: string;
      action: string;
      target: string;
      type: string;
      createdAt: string;
    }>;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      if (search) params.set('search', search);
      if (type) params.set('type', type);

      const response = await api.get(`/v1/admin/logs?${params.toString()}`);
      const pageData = response.data.data;
      return {
        logs: pageData.content,
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages,
        number: pageData.number,
        size: pageData.size,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch admin logs'));
    }
  },
};
