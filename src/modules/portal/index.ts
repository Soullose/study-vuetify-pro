/**
 * @description 门户模块 - 门户网站入口
 * @author Architecture Team
 * @date 2026-04-15
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 门户模块配置
 *
 * meta.order = 100，在业务模块之后注册
 * 使用 portal 布局
 */
const portalModule: ModuleConfig = {
  meta: {
    name: 'portal',
    title: '门户',
    icon: 'mdi-web',
    layout: 'portal',
    order: 100,
    description: '门户网站入口页面'
  },
  routes
};

export default portalModule;
