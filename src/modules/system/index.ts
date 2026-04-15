/**
 * @description 系统管理模块 - 用户、角色、权限管理
 * @author Architecture Team
 * @date 2026-04-05
 */

import type { ModuleConfig } from '@/core/types';
import routes from './router';

/**
 * 系统管理模块配置
 *
 * 路由定义已抽离至 ./router/index.ts
 */
const systemModule: ModuleConfig = {
  meta: {
    name: 'system',
    title: '系统管理',
    icon: 'mdi-cog',
    layout: 'admin',
    order: 20,
    description: '系统设置、用户角色权限管理'
  },
  routes
};

export default systemModule;
