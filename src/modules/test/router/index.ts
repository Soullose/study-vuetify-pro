/**
 * @description 测试功能模块路由定义
 * @author Architecture Team
 * @date 2026-05-07
 *
 * 路由结构：
 * /test          → 测试页（admin 布局）
 * /icon          → 图标选择器（admin 布局）
 * /grid-demo     → ProGrid 基础演示（admin 布局）
 * /grid-demo-full → ProGrid 完整功能演示（admin 布局）
 */

import type { ModuleRouteRecord } from '@/core/types'

const testRoutes: ModuleRouteRecord[] = [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test/index.vue'),
    meta: {
      title: '测试',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/pages/icon/index.vue'),
    meta: {
      title: '图标选择器',
      requireAuth: true
    }
  },
  {
    path: '/grid-demo',
    name: 'grid-demo',
    component: () => import('@/pages/test/grid-demo.vue'),
    meta: {
      title: 'ProGrid 基础演示',
      requireAuth: true
    }
  },
  {
    path: '/grid-demo-full',
    name: 'grid-demo-full',
    component: () => import('@/pages/test/grid-demo-full.vue'),
    meta: {
      title: 'ProGrid 完整功能演示',
      requireAuth: true
    }
  }
]

export default testRoutes
