/**
 * @description 首页模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * / → 首页（admin 布局，需认证）
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 首页模块路由
 */
const homeRoutes: ModuleRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
    meta: {
      title: '首页',
      requireAuth: true
    }
  }
];

export default homeRoutes;
