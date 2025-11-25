/**
 * 防抖和节流工具
 * 用于优化高频事件处理
 */

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * 规定时间内只执行一次
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * 请求防抖（带取消功能）
 * 用于API请求去重
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number = 300
): {
  execute: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  cancel: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;
  let resolveList: Array<(value: any) => void> = [];
  let rejectList: Array<(reason?: any) => void> = [];

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    rejectList.forEach(reject => reject(new Error('Cancelled')));
    resolveList = [];
    rejectList = [];
  };

  const execute = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      resolveList.push(resolve);
      rejectList.push(reject);

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        timeout = null;
        try {
          const result = await func(...args);
          resolveList.forEach(res => res(result));
        } catch (error) {
          rejectList.forEach(rej => rej(error));
        } finally {
          resolveList = [];
          rejectList = [];
        }
      }, wait);
    });
  };

  return { execute, cancel };
}

/**
 * 批量请求处理
 * 将多个请求合并为一个
 */
export class RequestBatcher<T, R> {
  private queue: Array<{
    args: T;
    resolve: (value: R) => void;
    reject: (reason?: any) => void;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchFn: (items: T[]) => Promise<R[]>;
  private wait: number;

  constructor(batchFn: (items: T[]) => Promise<R[]>, wait: number = 50) {
    this.batchFn = batchFn;
    this.wait = wait;
  }

  add(args: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ args, resolve, reject });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.flush();
      }, this.wait);
    });
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const items = [...this.queue];
    this.queue = [];
    this.timeout = null;

    try {
      const args = items.map(item => item.args);
      const results = await this.batchFn(args);
      
      items.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      items.forEach(item => {
        item.reject(error);
      });
    }
  }
}

/**
 * React Hook: 防抖
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React Hook: 节流
 */
export function useThrottle<T>(value: T, limit: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// 导入 React hooks
import { useState, useEffect, useRef } from 'react';