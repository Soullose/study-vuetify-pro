/**
 * @description 错误页模块 - 403/404 错误页、重定向中转、catch-all 路由
 * @author Architecture Team
 * @date 2026-04-15
 *
 * ⚠️ 重要：本模块 meta.order = 9999，确保全局 catch-all 路由最后注册。
 * 所有路由使用 blank 布局。
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 错误页模块配置
 *
 * meta.order = 9999，确保在所有其他模块之后注册，
 * 这样全局 catch-all (/:path(.*)*) 才不会拦截正常路由
 */
const errorModule: ModuleConfig = {
  meta: {
    name: 'error',
    title: '错误页',
    icon: 'mdi-alert-circle',
    layout: 'blank',
    order: 9999,
    description: '403/404 错误页、重定向中转、catch-all 通配路由'
  },
  routes
};

export default errorModule;
