/**
 * @description 认证模块 - 登录、注册等认证相关页面
 * @author Architecture Team
 * @date 2026-04-15
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 认证模块配置
 *
 * meta.order = 1，在首页之后注册
 * 使用 blank 布局（无侧边栏、无导航栏）
 */
const authModule: ModuleConfig = {
  meta: {
    name: 'auth',
    title: '认证',
    icon: 'mdi-login',
    layout: 'blank',
    order: 1,
    description: '登录、注册等认证相关页面'
  },
  routes
};

export default authModule;
