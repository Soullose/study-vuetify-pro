/**
 * @description 仪表盘模块 - 后台管理首页及数据概览
 * @author Architecture Team
 * @date 2026-04-05
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 仪表盘模块配置
 *
 * 路由定义已抽离至 ./router/index.ts
 */
const dashboardModule: ModuleConfig = {
  meta: {
    name: 'dashboard',
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    layout: 'admin',
    order: 10,
    description: '后台管理首页，展示数据概览和快捷操作'
  },
  routes
};

export default dashboardModule;
