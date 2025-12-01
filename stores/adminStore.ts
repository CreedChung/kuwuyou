import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalMessages: number;
  userGrowth: number;
  activeGrowth: number;
  revenueGrowth: number;
  messageGrowth: number;
}

export interface SystemStatus {
  server: 'normal' | 'warning' | 'error';
  database: 'normal' | 'warning' | 'error';
  api: 'normal' | 'warning' | 'error';
  uptime: string;
  dbResponseTime: string;
}

interface AdminState {
  // 管理员信息
  adminUser: AdminUser | null;
  isAdmin: boolean;
  
  // 系统统计
  systemStats: SystemStats;
  systemStatus: SystemStatus;
  
  // 操作方法
  setAdminUser: (user: AdminUser | null) => void;
  updateSystemStats: (stats: Partial<SystemStats>) => void;
  updateSystemStatus: (status: Partial<SystemStatus>) => void;
  logout: () => void;
}

const defaultSystemStats: SystemStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalRevenue: 0,
  totalMessages: 0,
  userGrowth: 0,
  activeGrowth: 0,
  revenueGrowth: 0,
  messageGrowth: 0,
};

const defaultSystemStatus: SystemStatus = {
  server: 'normal',
  database: 'normal',
  api: 'normal',
  uptime: '0天 0小时',
  dbResponseTime: '0ms',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminUser: null,
      isAdmin: false,
      systemStats: defaultSystemStats,
      systemStatus: defaultSystemStatus,

      setAdminUser: (user) =>
        set({
          adminUser: user,
          isAdmin: user !== null,
        }),

      updateSystemStats: (stats) =>
        set((state) => ({
          systemStats: { ...state.systemStats, ...stats },
        })),

      updateSystemStatus: (status) =>
        set((state) => ({
          systemStatus: { ...state.systemStatus, ...status },
        })),

      logout: () =>
        set({
          adminUser: null,
          isAdmin: false,
        }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAdmin: state.isAdmin,
      }),
    }
  )
);