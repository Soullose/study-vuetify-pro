/**
 * @description 认证模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /login → 登录页（blank 布局，无需认证）
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 认证模块路由
 */
const authRoutes: ModuleRouteRecord[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录',
      requireAuth: false
    }
  }
];

export default authRoutes;
