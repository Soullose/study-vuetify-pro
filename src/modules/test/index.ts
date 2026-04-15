/**
 * @description 测试功能模块 - 测试页、图标选择器等开发辅助页面
 * @author Architecture Team
 * @date 2026-04-15
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 测试功能模块配置
 *
 * meta.order = 2，在认证模块之后注册
 */
const testModule: ModuleConfig = {
  meta: {
    name: 'test',
    title: '测试功能',
    icon: 'mdi-flask',
    layout: 'admin',
    order: 2,
    description: '测试页、图标选择器等开发辅助页面'
  },
  routes
};

export default testModule;
