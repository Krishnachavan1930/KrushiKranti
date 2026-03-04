import type { LoginCredentials, RegisterData, AuthResponse, User } from './types';
import { googleLogout } from '@react-oauth/google';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers: User[] = [
  {
    id: '1',
    email: 'farmer@example.com',
    name: 'Ramesh Kumar',
    role: 'farmer',
    phone: '+91 9876543210',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'wholesaler@example.com',
    name: 'Suresh Traders',
    role: 'wholesaler',
    phone: '+91 9876543211',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+91 9876543212',
    createdAt: new Date().toISOString(),
  },
];

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000);

    const user = mockUsers.find(u => u.email === credentials.email);

    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return { user, token };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000);

    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    return { user: newUser, token };
  },

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    await delay(1000);

    // In a real app:
    // const response = await api.post('/auth/google', { token: googleToken });
    // return response.data;

    console.log('Google Auth flow active with token:', googleToken.substring(0, 10) + '...');

    const user: User = {
      id: 'google-user-123',
      email: 'googleuser@example.com',
      name: 'Google User',
      role: '' as any, // Role-less user to trigger role selection
      createdAt: new Date().toISOString(),
    };

    // Return a mock JWT
    const token = `mock-backend-jwt-${user.id}-${Date.now()}`;

    return { user, token };
  },

  async logout(): Promise<void> {
    await delay(300);
    googleLogout(); // Revoke Google session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(500);

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
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
