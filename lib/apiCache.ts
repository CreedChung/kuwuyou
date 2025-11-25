/**
 * API 缓存工具
 * 使用内存缓存来减少重复请求
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * 获取缓存数据
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * 设置缓存数据
   */
  set<T>(key: string, data: T, expiresIn: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * 请求去重：如果相同的请求正在进行中，直接返回该请求的 Promise
   */
  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // 检查是否有正在进行的相同请求
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    // 创建新请求
    const promise = fetcher().finally(() => {
      // 请求完成后清理
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * 带缓存的请求：先检查缓存，没有则发起请求并缓存结果
   */
  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    expiresIn: number = 60000
  ): Promise<T> {
    // 先检查缓存
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 使用去重功能发起请求
    const data = await this.dedupe(key, fetcher);
    
    // 缓存结果
    this.set(key, data, expiresIn);
    
    return data;
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// 导出单例
export const apiCache = new ApiCache();

// 定期清理过期缓存（每5分钟）
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of apiCache['cache'].entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        apiCache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}