/**
 * @description 仪表盘模块 - 后台管理首页及数据概览
 * @author Architecture Team
 * @date 2026-04-05
 */

import type { ModuleConfig } from '@/core/types';

/**
 * 仪表盘模块配置
 *
 * 路由结构：
 * /dashboard          → 仪表盘首页
 */
const dashboardModule: ModuleConfig = {
  meta: {
    name: 'dashboard',
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    layout: 'admin',
    order: 1,
    description: '后台管理首页，展示数据概览和快捷操作'
  },
  routes: [
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
  ]
};

export default dashboardModule;
