// TanStack Start 认证系统
export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
}

/**
 * 验证管理员权限
 */
export async function verifyAdminAuth(): Promise<AdminUser | null> {
  try {
    // 在 TanStack Start 中，我们可以使用 localStorage 或其他客户端存储
    // 或者通过 API 调用来验证 token

    // 临时实现：检查 localStorage 中的 token
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        // 这里应该验证 token 的有效性
        return {
          id: "1",
          email: "admin@example.com",
          role: "admin",
        };
      }
    }

    return null;
  } catch (error) {
    console.error("验证管理员权限失败:", error);
    return null;
  }
}

/**
 * 检查是否有管理员权限
 */
export async function isAdmin(): Promise<boolean> {
  const admin = await verifyAdminAuth();
  return admin !== null;
}

/**
 * 检查是否有超级管理员权限
 */
export async function isSuperAdmin(): Promise<boolean> {
  const admin = await verifyAdminAuth();
  return admin?.role === "super_admin";
}
