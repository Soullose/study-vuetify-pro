/**
 * 权限相关 Mock API
 * 模拟用户菜单数据、权限列表等接口
 *
 * 接口说明：
 * - GET /api/system/permission/menus        → 返回当前用户的菜单树形结构（扁平，前端 buildMenuTree 转树）
 * - GET /api/system/permission/permissions  → 返回当前用户的权限列表（按钮级权限码）
 *
 * 角色识别：通过请求头 Authorization 中的 token 反查用户（token 由 auth Mock 生成，
 * 格式 mock-token-<username>-<random>），从而让不同登录用户返回不同的菜单/权限，
 * 使 RBAC 在 Mock 层真实生效。
 *
 * 历史背景：本文件曾提供 GET /permission/routes（后端动态路由）。
 * 该机制与 ModuleRegistry 静态路由在 path 上冲突且从不生效，已移除。
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { MenuItem } from '@/api/modules/permission';
import { resolveUserFromRequest } from './auth';

// ==================== Mock 数据定义 ====================

/**
 * 管理员角色的菜单数据（扁平结构，由前端 buildMenuTree 转为树形）
 */
const adminMenus: MenuItem[] = [
  {
    id: '1',
    path: '/dashboard',
    name: 'dynamic-dashboard',
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    sort: 1
  },
  {
    id: '2',
    path: '/system',
    name: 'dynamic-system',
    title: '系统管理',
    icon: 'mdi-cog',
    sort: 2
  },
  {
    id: '2-1',
    parentId: '2',
    path: '/system/user',
    name: 'dynamic-system-user',
    title: '用户管理',
    icon: 'mdi-account-multiple',
    sort: 1
  },
  {
    id: '2-2',
    parentId: '2',
    path: '/system/role',
    name: 'dynamic-system-role',
    title: '角色管理',
    icon: 'mdi-shield-account',
    sort: 2
  },
  {
    id: '2-3',
    parentId: '2',
    path: '/system/permission',
    name: 'dynamic-system-permission',
    title: '权限管理',
    icon: 'mdi-lock',
    sort: 3
  },
  {
    id: '3',
    path: '/test',
    name: 'dynamic-test',
    title: '测试页',
    icon: 'mdi-flask',
    sort: 3
  }
];

/**
 * 普通用户角色的菜单数据（受限：仅仪表盘）
 */
const userMenus: MenuItem[] = [
  {
    id: '1',
    path: '/dashboard',
    name: 'dynamic-dashboard',
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    sort: 1
  }
];

/**
 * 管理员权限列表（'*' 通配，拥有全部权限）
 */
const adminPermissions: string[] = ['*'];

/**
 * 普通用户权限列表
 */
const userPermissions: string[] = ['dashboard:view', 'profile:view', 'profile:edit'];

// ==================== 辅助函数 ====================

/**
 * 根据请求头中的 Token 解析当前用户角色
 *
 * Token 由 auth Mock 生成，格式为 `mock-token-<username>-<random>`。
 * 通过 `resolveUserFromRequest` 反查用户记录，取其 roles[0] 作为当前角色。
 * 解析失败时回退到 'admin'（兜底，正常登录流程不会触发）。
 *
 * @param headers - vite-plugin-mock 注入的请求头对象
 * @returns 'admin' | 'user'
 */
function getCurrentUserRole(headers: Record<string, string> = {}): string {
  const user = resolveUserFromRequest(headers);
  if (user && user.roles.length > 0) {
    return user.roles[0];
  }
  // 兜底：无法识别用户时返回 admin，保证接口可用
  return 'admin';
}

// ==================== Mock 接口定义 ====================

export default [
  /**
   * 获取用户菜单
   * GET /api/system/permission/menus
   */
  {
    url: '/api/system/permission/menus',
    method: 'get',
    statusCode: 200,
    timeout: 300,
    response: ({ headers }: { headers: Record<string, string> }) => {
      const role = getCurrentUserRole(headers);
      const menus = role === 'admin' ? adminMenus : userMenus;

      return {
        code: 200,
        message: '成功',
        data: menus
      };
    }
  },

  /**
   * 获取用户权限列表
   * GET /api/system/permission/permissions
   */
  {
    url: '/api/system/permission/permissions',
    method: 'get',
    statusCode: 200,
    timeout: 200,
    response: ({ headers }: { headers: Record<string, string> }) => {
      const role = getCurrentUserRole(headers);
      const permissions = role === 'admin' ? adminPermissions : userPermissions;

      return {
        code: 200,
        message: '成功',
        data: permissions
      };
    }
  }
] as MockMethod[];
