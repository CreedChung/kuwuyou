# 认证系统迁移文档

## 概述

本项目已将认证系统从 React Context API 完全迁移到 Zustand 状态管理库。

## 变更内容

### 1. 新增文件

- **`stores/authStore.ts`**: 使用 zustand 创建的认证状态管理 store
- **`components/auth/AuthInitializer.tsx`**: 用于初始化认证状态的组件
- **`hooks/useAuth.ts`**: 简化认证状态访问的自定义 hook

### 2. 删除文件

- **`contexts/AuthContext.tsx`**: 已删除，不再使用 React Context

### 3. 修改文件

- **`app/layout.tsx`**: 添加了 `AuthInitializer` 组件来初始化认证状态
- **`app/auth/login/page.tsx`**: 更新导入路径为 `@/hooks/useAuth`
- **`components/auth/RegisterForm.tsx`**: 更新导入路径为 `@/hooks/useAuth`
- **`components/ui/hero-with-image-text-and-two-buttons.tsx`**: 更新导入路径为 `@/hooks/useAuth`
- **`components/chat/Sidebar.tsx`**: 更新导入路径为 `@/hooks/useAuth`

### 4. 依赖变更

- 新增: `zustand@5.0.8`

## 使用方法

### 在组件中使用认证状态（推荐）

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();
  
  // 使用认证状态和方法
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      {user ? (
        <button onClick={() => signOut()}>退出登录</button>
      ) : (
        <button onClick={() => signIn(email, password)}>登录</button>
      )}
    </div>
  );
}
```

### 直接使用 Zustand Store（高级用法）

如果需要更精细的控制，可以直接使用 zustand store：

```tsx
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();
  
  // 只订阅需要的状态，避免不必要的重渲染
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  
  // 直接调用 store 方法需要传入 toast
  const handleSignOut = () => signOut(toast);
}
```

### 在非 React 组件中使用

```tsx
import { useAuthStore } from "@/stores/authStore";

// 获取当前状态
const currentUser = useAuthStore.getState().user;

// 订阅状态变化
const unsubscribe = useAuthStore.subscribe((state) => {
  console.log('用户状态变化:', state.user);
});

// 取消订阅
unsubscribe();
```

## 迁移优势

1. **更好的性能**: Zustand 使用更高效的订阅机制，减少不必要的重渲染
2. **更简洁的代码**: 不需要 Provider 包裹，减少了样板代码
3. **完整的 TypeScript 支持**: 完整的类型推断和类型安全
4. **更灵活**: 可以在 React 组件外部访问和修改状态
5. **更小的包体积**: Zustand 非常轻量（约 1KB gzipped）
6. **更好的调试体验**: 可以直接在控制台访问和修改状态

## 架构说明

### Store 结构

```
stores/authStore.ts
├── 状态 (State)
│   ├── user: 当前用户信息
│   ├── session: 当前会话信息
│   ├── loading: 加载状态
│   └── initialized: 初始化状态
│
└── 方法 (Actions)
    ├── initialize(): 初始化认证状态
    ├── signUp(): 用户注册
    ├── signIn(): 用户登录
    ├── signInWithProvider(): 第三方登录
    ├── signOut(): 退出登录
    ├── resetPassword(): 重置密码
    └── updatePassword(): 更新密码
```

### 初始化流程

1. `app/layout.tsx` 中渲染 `AuthInitializer` 组件
2. `AuthInitializer` 在挂载时调用 `store.initialize()`
3. `initialize()` 方法：
   - 获取 Supabase 会话信息
   - 设置用户和会话状态
   - 订阅认证状态变化
   - 标记为已初始化

## 注意事项

1. 确保 `AuthInitializer` 组件在应用的根部渲染（已在 `app/layout.tsx` 中完成）
2. 使用 `useAuth` hook 时，toast 会自动注入到认证方法中
3. 直接使用 store 时，需要手动传入 toast 函数
4. Store 的初始化是惰性的，首次调用 `initialize()` 时才会执行

## 最佳实践

1. **优先使用 useAuth hook**: 对于大多数场景，使用 `useAuth` hook 即可
2. **精细订阅**: 如果只需要特定状态，直接使用 `useAuthStore` 选择器
   ```tsx
   const user = useAuthStore((state) => state.user);
   ```
3. **避免重复初始化**: `initialize()` 方法内部已做防护，多次调用不会重复执行
4. **错误处理**: 所有认证方法都返回 `{ error }` 对象，记得检查错误

## 未来改进方向

- [ ] 添加持久化支持（使用 zustand/middleware）
- [ ] 集成 Redux DevTools 以便调试
- [ ] 添加更多的认证方法（如手机号登录）
- [ ] 实现自动刷新 token 机制
- [ ] 添加认证状态的乐观更新