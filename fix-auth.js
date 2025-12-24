#!/usr/bin/env node

/**
 * 认证问题修复脚本
 * 运行方式: node fix-auth.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 认证问题修复脚本\n');

// 1. 检查环境变量
console.log('1. 检查环境变量配置...');
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasTursoUrl = envContent.includes('TURSO_DATABASE_URL=');
    const hasTursoToken = envContent.includes('TURSO_AUTH_TOKEN=');
    
    console.log(`   ✓ TURSO_DATABASE_URL: ${hasTursoUrl ? '已配置' : '未配置'}`);
    console.log(`   ✓ TURSO_AUTH_TOKEN: ${hasTursoToken ? '已配置' : '未配置'}`);
    
    if (!hasTursoUrl || !hasTursoToken) {
      console.log('   ❌ 环境变量配置不完整，请检查.env文件');
    } else {
      console.log('   ✓ 环境变量配置正常');
    }
  } else {
    console.log('   ❌ .env文件不存在');
  }
} catch (error) {
  console.log('   ❌ 检查环境变量时出错:', error.message);
}

console.log('\n---\n');

// 2. 检查关键文件
console.log('2. 检查关键文件...');
const keyFiles = [
  'stores/authStore.ts',
  'components/auth/LoginPageContent.tsx',
  'src/app/api/auth/login.ts',
  'src/app/api/auth/signup.ts'
];

keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${file}: 存在`);
  } else {
    console.log(`   ❌ ${file}: 不存在`);
  }
});

console.log('\n---\n');

// 3. 提供修复建议
console.log('3. 修复建议...');
console.log(`
如果遇到登录401错误，请按以下步骤操作：

A. 浏览器端清理：
   1. 打开浏览器开发者工具 (F12)
   2. 在Console中执行：
      localStorage.clear();
      sessionStorage.clear();
      location.reload();

B. 重新启动应用：
   1. 停止当前运行的开发服务器 (Ctrl+C)
   2. 运行: npm run dev
   3. 打开浏览器访问: http://localhost:3000

C. 测试认证功能：
   1. 访问登录页面
   2. 查看浏览器控制台日志
   3. 尝试注册新用户
   4. 尝试登录

D. 检查网络请求：
   1. 打开开发者工具的Network面板
   2. 尝试登录操作
   3. 查看/api/auth/login请求的状态和响应

如果问题仍然存在，请查看 LOGIN_TROUBLESHOOTING.md 文档。
`);

console.log('🔧 修复脚本执行完成！');