/**
 * @description 首页模块 - 应用入口页面
 * @author Architecture Team
 * @date 2026-04-15
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 首页模块配置
 *
 * meta.order = 0，确保首页路由最先注册
 */
const homeModule: ModuleConfig = {
  meta: {
    name: 'home',
    title: '首页',
    icon: 'mdi-home',
    layout: 'admin',
    order: 0,
    description: '应用首页'
  },
  routes
};

export default homeModule;
