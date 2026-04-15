/**
 * @description 系统管理模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /system             → 系统管理（重定向到用户管理）
 * /system/user        → 用户管理
 * /system/role        → 角色管理
 * /system/permission  → 权限管理
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 系统管理模块路由
 */
const systemRoutes: ModuleRouteRecord[] = [
  {
    path: '/system',
    name: 'module-system',
    redirect: '/system/user',
    component: () => import('@/components/common/RouterViewWrapper/index.vue'),
    meta: {
      title: '系统管理',
      icon: 'mdi-cog',
      requireAuth: true
    },
    children: [
      {
        path: 'user',
        name: 'module-system-user',
        component: () => import('@/pages/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'mdi-account-multiple',
          requireAuth: true,
          keepAlive: true
        }
      },
      {
        path: 'role',
        name: 'module-system-role',
        component: () => import('@/pages/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'mdi-shield-account',
          requireAuth: true,
          keepAlive: true
        }
      },
      {
        path: 'permission',
        name: 'module-system-permission',
        component: () => import('@/pages/system/permission/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'mdi-lock',
          requireAuth: true,
          keepAlive: true
        }
      }
    ]
  }
];

export default systemRoutes;
