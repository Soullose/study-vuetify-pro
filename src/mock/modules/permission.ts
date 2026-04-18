/**
 * 权限相关 Mock API
 * 模拟用户路由配置、菜单数据、权限列表等接口
 *
 * 接口说明：
 * - GET /api/system/permission/routes  → 返回当前用户的动态路由配置
 * - GET /api/system/permission/menus   → 返回当前用户的菜单树形结构
 * - GET /api/system/permission/permissions → 返回当前用户的权限列表
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { ApiRouteConfig, MenuItem } from '@/api/modules/permission';

// ==================== Mock 数据定义 ====================

/**
 * 管理员角色的路由配置
 * 对应 src/pages/ 目录下的实际页面组件
 */
const adminRoutes: ApiRouteConfig[] = [
  {
    id: '1',
    name: 'dynamic-dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    meta: {
      title: '仪表盘',
      icon: 'mdi-view-dashboard',
      keepAlive: true,
      affix: true
    }
  },
  {
    id: '2',
    name: 'dynamic-system',
    path: '/system',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'mdi-cog'
    },
    children: [
      {
        id: '2-1',
        name: 'dynamic-system-user',
        path: 'user',
        component: 'system/user/index',
        parentId: '2',
        meta: {
          title: '用户管理',
          icon: 'mdi-account-multiple',
          keepAlive: true
        }
      },
      {
        id: '2-2',
        name: 'dynamic-system-role',
        path: 'role',
        component: 'system/role/index',
        parentId: '2',
        meta: {
          title: '角色管理',
          icon: 'mdi-shield-account',
          keepAlive: true
        }
      },
      {
        id: '2-3',
        name: 'dynamic-system-permission',
        path: 'permission',
        component: 'system/permission/index',
        parentId: '2',
        meta: {
          title: '权限管理',
          icon: 'mdi-lock',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: '3',
    name: 'dynamic-test',
    path: '/test',
    component: 'test/index',
    meta: {
      title: '测试页',
      icon: 'mdi-flask'
    }
  }
];

/**
 * 普通用户角色的路由配置（受限）
 */
const userRoutes: ApiRouteConfig[] = [
  {
    id: '1',
    name: 'dynamic-dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    meta: {
      title: '仪表盘',
      icon: 'mdi-view-dashboard',
      keepAlive: true,
      affix: true
    }
  }
];

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
 * 普通用户角色的菜单数据（受限）
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
 * 管理员权限列表
 */
const adminPermissions: string[] = ['*'];

/**
 * 普通用户权限列表
 */
const userPermissions: string[] = ['dashboard:view', 'profile:view', 'profile:edit'];

// ==================== 辅助函数 ====================

/**
 * 根据请求头中的 Token 判断当前用户角色
 * 从 Mock 登录接口返回的 token 格式中无法直接解析角色，
 * 因此简化处理：默认返回管理员角色
 *
 * @returns 'admin' | 'user'
 */
function getCurrentUserRole(): string {
  // Mock 环境下默认返回 admin，因为实际角色信息已在登录时由 auth store 保存
  return 'admin';
}

// ==================== Mock 接口定义 ====================

export default [
  /**
   * 获取用户路由配置
   * GET /api/system/permission/routes
   */
  {
    url: '/api/system/permission/routes',
    method: 'get',
    statusCode: 200,
    timeout: 300,
    response: () => {
      const role = getCurrentUserRole();
      const routes = role === 'admin' ? adminRoutes : userRoutes;

      return {
        code: 200,
        message: '成功',
        data: routes
      };
    }
  },

  /**
   * 获取用户菜单
   * GET /api/system/permission/menus
   */
  {
    url: '/api/system/permission/menus',
    method: 'get',
    statusCode: 200,
    timeout: 300,
    response: () => {
      const role = getCurrentUserRole();
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
    response: () => {
      const role = getCurrentUserRole();
      const permissions = role === 'admin' ? adminPermissions : userPermissions;

      return {
        code: 200,
        message: '成功',
        data: permissions
      };
    }
  }
] as MockMethod[];
