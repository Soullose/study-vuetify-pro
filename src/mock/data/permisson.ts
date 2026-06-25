import type { MenuItem } from '@/api/modules/permission';

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

export { adminMenus, userMenus };
