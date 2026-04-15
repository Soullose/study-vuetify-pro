/**
 * @description 仪表盘模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /dashboard → 仪表盘首页（admin 布局，需认证）
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 仪表盘模块路由
 */
const dashboardRoutes: ModuleRouteRecord[] = [
  {
    path: '/dashboard',
    name: 'module-dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'mdi-view-dashboard',
      requireAuth: true,
      keepAlive: true,
      affix: true
    }
  }
];

export default dashboardRoutes;
