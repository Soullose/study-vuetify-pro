/**
 * @description 错误页模块路由定义
 * @author Architecture Team
 * @date 2026-04-15
 *
 * 路由结构：
 * /403                  → 无访问权限（blank 布局）
 * /404                  → 页面未找到（blank 布局）
 * /redirect/:path(.*)*  → 重定向中转页（用于页签刷新机制）
 * /platform/:path(.*)*  → Platform catch-all（blank 布局）
 * /:path(.*)*           → 全局 catch-all（⚠️ 必须在数组最后）
 *
 * ⚠️ 重要：全局 catch-all (/:path(.*)*) 必须放在数组最后，
 * 否则会拦截所有请求。本模块 meta.order = 9999 确保最后注册。
 */

import type { ModuleRouteRecord } from '@/core/types';

/**
 * 错误页模块路由
 *
 * 所有路由使用 blank 布局（无侧边栏、无导航栏）
 */
const errorRoutes: ModuleRouteRecord[] = [
  // ---- 403 无访问权限 ----
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/403.vue'),
    meta: {
      title: '无访问权限',
      requireAuth: false
    }
  },

  // ---- 404 页面未找到 ----
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: {
      title: '页面未找到',
      requireAuth: false
    }
  },

  // ---- 重定向中转页（用于页签刷新机制） ----
  {
    path: '/redirect/:path(.*)*',
    name: 'redirect',
    component: () => import('@/pages/redirect/[...path].vue'),
    meta: {
      requireAuth: false
    }
  },

  // ---- Platform catch-all（platform 目录下未匹配的路径） ----
  {
    path: '/platform/:path(.*)*',
    name: 'platform-catch-all',
    component: () => import('@/platform/pages/[...path].vue'),
    meta: {
      title: '页面未找到',
      requireAuth: false
    }
  },

  // ---- 全局 catch-all（⚠️ 必须放在数组最后） ----
  {
    path: '/:path(.*)*',
    name: 'catch-all',
    component: () => import('@/pages/[...path].vue'),
    meta: {
      title: '页面未找到',
      requireAuth: false
    }
  }
];

export default errorRoutes;
