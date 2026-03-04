import type { Role } from '../auth/types';

export type UserStatus = 'active' | 'banned' | 'pending';
export type ProductApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  farmerName: string;
  farmerId: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
  image: string;
  approvalStatus: ProductApprovalStatus;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalWholesalers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingApprovals: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
  farmers: number;
  wholesalers: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface CommissionData {
  id: string;
  orderId: string;
  orderAmount: number;
  commissionAmount: number;
  farmerName: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface FraudAlert {
  id: string;
  type: 'suspicious_pricing' | 'abnormal_transaction';
  severity: 'low' | 'medium' | 'high';
  message: string;
  targetId: string;
  targetName: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface CitySalesData {
  name: string;
  value: number;
}

export interface TopFarmerData {
  name: string;
  sales: number;
  revenue: number;
  rating: number;
}
