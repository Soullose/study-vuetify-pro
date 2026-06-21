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
export const mockUsers: Array<UserInfo & { password: string }> = [
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

/** 含密码的完整用户记录类型 */
type MockUserRecord = UserInfo & { password: string };

/**
 * 生成 Mock Token
 *
 * Token 格式：`mock-token-<username>-<random>`
 * 将 username 内嵌进 token，便于其他 Mock 接口（如权限/菜单）从请求头反查用户角色，
 * 使不同登录用户返回不同的菜单/权限数据，从而让 RBAC 在 Mock 层真实生效。
 *
 * @param username - 登录用户名
 */
function generateToken(username: string): string {
  return `mock-token-${username}-${Mock.Random.string('lower', 8)}`;
}

/**
 * Token 格式正则：匹配 `mock-token-<username>-<random>` 并捕获 username
 * 注意：username 不含连字符（当前测试账号 admin/user 均满足）
 */
const TOKEN_PATTERN = /^mock-token-([^-]+)-/;

/**
 * 从请求头解析当前用户
 *
 * 供 user-info、权限、菜单等需要识别"当前是谁"的 Mock 接口复用。
 * 解析失败时返回 undefined，调用方可按需回退（如返回默认用户）。
 *
 * @param headers - vite-plugin-mock 注入的请求头对象
 * @returns 匹配到的用户记录（含密码），未匹配返回 undefined
 */
export function resolveUserFromRequest(headers: Record<string, string> = {}): MockUserRecord | undefined {
  // 请求头字段名大小写不统一，需兼容 authorization / Authorization
  const authHeader = headers?.authorization || headers?.Authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const match = token.match(TOKEN_PATTERN);
  if (!match) return undefined;
  return mockUsers.find((u) => u.username === match[1]);
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

      // 生成 Token（内嵌 username，便于其他 Mock 接口反查用户角色）
      const accessToken = generateToken(user.username);
      const refreshToken = generateToken(user.username);

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
   *
   * 根据请求头 token 解析当前登录用户，返回对应用户信息。
   * 解析失败时回退到默认 admin 用户（仅作兜底，正常流程不会触发）。
   */
  {
    url: '/api/auth/user-info',
    method: 'get',
    statusCode: 200,
    response: ({ headers }: { headers: Record<string, string> }) => {
      // 优先按 token 解析当前用户；解析不到则回退默认用户
      const user = resolveUserFromRequest(headers) ?? mockUsers[0];
      const { password: _unused, ...userInfo } = user;

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
   *
   * 刷新时保留原 username（从 token 解析），保证刷新后权限链路不中断。
   */
  {
    url: '/api/auth/refresh',
    method: 'post',
    statusCode: 200,
    response: ({ headers }: { headers: Record<string, string> }) => {
      const user = resolveUserFromRequest(headers) ?? mockUsers[0];
      return {
        code: 200,
        message: '刷新成功',
        data: {
          accessToken: generateToken(user.username),
          refreshToken: generateToken(user.username),
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
