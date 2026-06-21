/**
 * @description 首页模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * / → 重定向到 /dashboard（admin 布局，需认证）
 *
 * 说明：根路径默认进入仪表盘，与登录后默认跳转（/dashboard）保持一致。
 *      hidden=true 避免在侧边栏菜单中产生与"仪表盘"重复的菜单项。
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 首页模块路由
 */
const homeRoutes: ModuleRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard',
    component: () => import('@/pages/index.vue'),
    meta: {
      title: '首页',
      requireAuth: true,
      hidden: true
    }
  }
];

export default homeRoutes;
