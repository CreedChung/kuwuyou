/**
 * 性能监控工具
 * 用于跟踪和记录应用性能指标
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // 最多保存1000条记录

  /**
   * 记录性能指标
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // 限制记录数量
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}: ${value}ms`, tags);
    }
  }

  /**
   * 测量函数执行时间
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>,
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(name, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(name, duration, { ...tags, error: "true" });
      throw error;
    }
  }

  /**
   * 测量同步函数执行时间
   */
  measureSync<T>(name: string, fn: () => T, tags?: Record<string, string>): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.record(name, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(name, duration, { ...tags, error: "true" });
      throw error;
    }
  }

  /**
   * 获取指标统计
   */
  getStats(name?: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    let filtered = this.metrics;
    if (name) {
      filtered = this.metrics.filter((m) => m.name === name);
    }

    if (filtered.length === 0) return null;

    const values = filtered.map((m) => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);

    const getPercentile = (p: number) => {
      const index = Math.ceil(count * p) - 1;
      return values[Math.max(0, index)];
    };

    return {
      count,
      avg: sum / count,
      min: values[0],
      max: values[count - 1],
      p50: getPercentile(0.5),
      p95: getPercentile(0.95),
      p99: getPercentile(0.99),
    };
  }

  /**
   * 获取所有指标名称
   */
  getMetricNames(): string[] {
    return Array.from(new Set(this.metrics.map((m) => m.name)));
  }

  /**
   * 清空所有指标
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * 导出指标数据
   */
  export(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// Web Vitals 监控（仅客户端）
if (typeof window !== "undefined") {
  // 监控 Largest Contentful Paint (LCP)
  const observeLCP = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        performanceMonitor.record("web-vitals.lcp", lastEntry.startTime);
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      // PerformanceObserver 不支持
    }
  };

  // 监控 First Input Delay (FID)
  const observeFID = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const delay = entry.processingStart - entry.startTime;
          performanceMonitor.record("web-vitals.fid", delay);
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
    } catch {
      // PerformanceObserver 不支持
    }
  };

  // 监控 Cumulative Layout Shift (CLS)
  const observeCLS = () => {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            performanceMonitor.record("web-vitals.cls", clsValue);
          }
        });
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch {
      // PerformanceObserver 不支持
    }
  };

  // 页面加载完成后开始监控
  if (document.readyState === "complete") {
    observeLCP();
    observeFID();
    observeCLS();
  } else {
    window.addEventListener("load", () => {
      observeLCP();
      observeFID();
      observeCLS();
    });
  }
}

// 辅助函数：创建性能标记
export function mark(name: string): () => void {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    performanceMonitor.record(name, duration);
  };
}
