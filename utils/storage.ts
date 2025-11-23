export interface PendingLogin {
  email: string;
  password: string;
  timestamp: number;
}

const PENDING_LOGIN_KEY = "pending_login";

export function savePendingLogin(email: string, password: string): void {
  const data: PendingLogin = {
    email,
    password,
    timestamp: Date.now(),
  };
  localStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(data));
}

export function getPendingLogin(): PendingLogin | null {
  const data = localStorage.getItem(PENDING_LOGIN_KEY);
  if (!data) return null;

  try {
    const pendingLogin: PendingLogin = JSON.parse(data);
    // 检查是否过期（30分钟）
    if (Date.now() - pendingLogin.timestamp > 30 * 60 * 1000) {
      clearPendingLogin();
      return null;
    }
    return pendingLogin;
  } catch {
    return null;
  }
}

export function clearPendingLogin(): void {
  localStorage.removeItem(PENDING_LOGIN_KEY);
}