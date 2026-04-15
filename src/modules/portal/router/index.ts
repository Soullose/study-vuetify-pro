/**
 * @description 门户模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /platform/portal → 门户网站（portal 布局，需认证）
 *
 * ⚠️ 注意：/platform/:path(.*)* catch-all 路由已移至 error 模块，
 * 因为它需要 blank 布局，而 wrapModuleRoutes 为整个模块统一包裹布局。
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 门户模块路由
 */
const portalRoutes: ModuleRouteRecord[] = [
  {
    path: '/platform/portal',
    name: 'platform-portal',
    component: () => import('@/platform/pages/portal/index.vue'),
    meta: {
      title: '门户网站',
      requireAuth: true
    }
  }
];

export default portalRoutes;
