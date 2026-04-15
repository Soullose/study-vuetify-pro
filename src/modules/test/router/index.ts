/**
 * @description 测试功能模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /test → 测试页（admin 布局）
 * /icon → 图标选择器（admin 布局）
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 测试功能模块路由
 */
const testRoutes: ModuleRouteRecord[] = [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test/index.vue'),
    meta: {
      title: '测试',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/pages/icon/index.vue'),
    meta: {
      title: '图标选择器',
      requireAuth: true
    }
  }
];

export default testRoutes;
