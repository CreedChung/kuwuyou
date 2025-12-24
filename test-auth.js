// 认证功能测试脚本
// 运行方式: node test-auth.js

const testAuth = async () => {
  console.log('开始测试认证功能...\n');

  // 测试1: 检查数据库连接
  console.log('1. 测试数据库连接...');
  try {
    const dbTestResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      }),
    });
    
    console.log(`数据库连接状态: ${dbTestResponse.status}`);
    const dbTestData = await dbTestResponse.json();
    console.log('数据库响应:', dbTestData);
  } catch (error) {
    console.error('数据库连接失败:', error.message);
  }

  console.log('\n---\n');

  // 测试2: 检查注册API
  console.log('2. 测试注册API...');
  try {
    const signupResponse = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpassword123',
        username: 'testuser'
      }),
    });
    
    console.log(`注册API状态: ${signupResponse.status}`);
    const signupData = await signupResponse.json();
    console.log('注册响应:', signupData);
  } catch (error) {
    console.error('注册API失败:', error.message);
  }

  console.log('\n---\n');

  // 测试3: 检查登录API
  console.log('3. 测试登录API...');
  try {
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpassword123'
      }),
    });
    
    console.log(`登录API状态: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('登录响应:', loginData);
  } catch (error) {
    console.error('登录API失败:', error.message);
  }

  console.log('\n测试完成!');
};

// 如果在Node.js环境中运行
if (typeof window === 'undefined') {
  // 使用node-fetch或其他方式
  global.fetch = global.fetch || require('node-fetch');
  testAuth().catch(console.error);
}