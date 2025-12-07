/**
 * 新手教程管理工具
 */

const TUTORIAL_STORAGE_KEY = "chat-tutorial-completed";

/**
 * 检查用户是否已完成新手教程
 */
export function hasTutorialCompleted(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
}

/**
 * 标记新手教程为已完成
 */
export function markTutorialCompleted(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
}

/**
 * 重置新手教程状态（用于设置页面）
 */
export function resetTutorial(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
}
