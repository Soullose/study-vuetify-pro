/**
 * 认证相关 Mock API
 * 模拟用户登录、登出、获取用户信息等接口
 */
import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import type { UserInfo } from '@/api/modules/auth';

/**
 * 模拟用户数据库
 * 可根据需要扩展更多测试账号
 */
const mockUsers: Array<UserInfo & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['*']
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    nickname: '普通用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    email: 'user@example.com',
    phone: '13800138001',
    roles: ['user'],
    permissions: ['dashboard:view', 'profile:view', 'profile:edit']
  }
];

/**
 * 生成 Mock Token
 */
function generateToken(): string {
  return Mock.Random.guid();
}

export default [
  /**
   * 用户登录接口
   * POST /api/auth/login
   */
  {
    url: '/api/auth/login',
    method: 'post',
    statusCode: 200,
    timeout: 500,
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body;
      console.log(`Mock 登录请求 - 用户名: ${username}, 密码: ${password}`);

      // 查找用户
      const user = mockUsers.find((u) => u.username === username && u.password === password);
      console.log('Mock 登录结果:', user ? '成功' : '失败');

      // 用户不存在或密码错误
      if (!user) {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null
        };
      }

      // 生成 Token
      const accessToken = generateToken();
      const refreshToken = generateToken();

      // 返回用户信息（排除密码）
      const { password: _, ...userInfo } = user;

      return {
        code: 200,
        message: '登录成功',
        data: {
          accessToken,
          refreshToken,
          expiresIn: 7200,
          userInfo
        }
      };
    }
  },

  /**
   * 用户登出接口
   * POST /api/auth/logout
   */
  {
    url: '/api/auth/logout',
    method: 'post',
    statusCode: 200,
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null
      };
    }
  },

  /**
   * 获取当前用户信息
   * GET /api/auth/user-info
   */
  {
    url: '/api/auth/user-info',
    method: 'get',
    statusCode: 200,
    response: () => {
      // 返回默认用户信息
      const defaultUser = mockUsers[0];
      const { password: _, ...userInfo } = defaultUser;

      return {
        code: 200,
        message: '成功',
        data: userInfo
      };
    }
  },

  /**
   * 刷新 Token
   * POST /api/auth/refresh
   */
  {
    url: '/api/auth/refresh',
    method: 'post',
    statusCode: 200,
    response: () => {
      return {
        code: 200,
        message: '刷新成功',
        data: {
          accessToken: generateToken(),
          refreshToken: generateToken(),
          expiresIn: 7200
        }
      };
    }
  },

  /**
   * 获取验证码
   * GET /api/auth/captcha
   */
  {
    url: '/api/auth/captcha',
    method: 'get',
    statusCode: 200,
    response: () => {
      // 生成简单的数学验证码
      const num1 = Mock.Random.integer(1, 9);
      const num2 = Mock.Random.integer(1, 9);
      const captchaKey = Mock.Random.guid();
      const captchaText = `${num1} + ${num2} = ?`;

      return {
        code: 200,
        message: '成功',
        data: {
          captchaKey,
          captchaImage: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#333">${captchaText}</text></svg>`)}`,
          // 存储答案用于验证（实际项目中应该存储在服务端）
          answer: num1 + num2
        }
      };
    }
  }
] as MockMethod[];
