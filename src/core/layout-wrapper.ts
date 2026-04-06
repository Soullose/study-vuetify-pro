/**
 * @description 布局包裹器 - 为动态路由提供布局组件包裹
 * @author Architecture Team
 * @date 2026-04-05
 *
 * 职责：
 * 1. 为模块路由包裹对应的布局组件
 * 2. 模拟 setupLayouts() 的行为，使 router.addRoute() 添加的路由也能使用布局
 * 3. 支持三种布局：admin（后台管理）、portal（门户网站）、blank（空白）
 */

import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import type { LayoutName, ModuleRouteRecord } from './types';

/**
 * 布局组件懒加载映射
 * 使用函数式导入确保按需加载，与 vite-plugin-vue-layouts-next 的行为一致
 */
const layoutComponents: Record<LayoutName, () => Promise<RouteComponent>> = {
  admin: () => import('@/layouts/admin.vue'),
  portal: () => import('@/layouts/portal.vue'),
  blank: () => import('@/layouts/blank.vue')
};

/**
 * 将模块路由记录转换为标准 RouteRecordRaw
 * 处理可选字段（redirect、children）的类型安全转换
 *
 * @param route - 模块路由记录
 * @param layout - 布局名称
 * @param basePath - 子路由基础路径（顶级包裹时为空字符串）
 * @returns 标准 Vue Router 路由记录
 */
function toRouteRecord(route: ModuleRouteRecord, layout: LayoutName, basePath: string): RouteRecordRaw {
  const meta = {
    ...route.meta,
    layout
  };

  // 有子路由时使用 RouteRecordSingleViewWithChildren
  if (route.children && route.children.length > 0) {
    return {
      path: basePath,
      name: route.name,
      component: route.component,
      meta,
      redirect: route.redirect,
      children: route.children.map((child) => toRouteRecord(child, layout, child.path))
    };
  }

  // 无子路由时使用 RouteRecordSingleView
  const record: RouteRecordRaw = {
    path: basePath,
    name: route.name,
    component: route.component,
    meta
  };

  // redirect 需要单独处理，因为 RouteRecordSingleView 没有 redirect
  if (route.redirect) {
    return {
      path: basePath,
      redirect: route.redirect,
      meta
    };
  }

  return record;
}

/**
 * 将单条模块路由包裹布局组件
 *
 * 包裹后的路由结构：
 * ```
 * {
 *   path: '/module-path',           ← 顶级路径
 *   component: LayoutComponent,     ← 布局组件（admin/portal/blank）
 *   children: [
 *     {
 *       path: '',                   ← 空路径，匹配父级
 *       name: 'original-name',      ← 保留原始路由名称
 *       component: PageComponent,   ← 实际页面组件
 *       children: [...]             ← 保留原始子路由嵌套
 *     }
 *   ]
 * }
 * ```
 *
 * @param route - 模块路由记录
 * @param layout - 布局名称
 * @returns 包裹布局后的标准路由记录
 */
export function wrapRouteWithLayout(route: ModuleRouteRecord, layout: LayoutName): RouteRecordRaw {
  const layoutLoader = layoutComponents[layout];

  return {
    path: route.path,
    component: layoutLoader,
    children: [toRouteRecord(route, layout, '')]
  };
}

/**
 * 批量包裹模块路由
 *
 * 将模块的所有路由逐一包裹布局组件，
 * 每个顶级路由独立包裹，确保路由隔离。
 * 单条路由可通过 meta.layout 覆盖模块默认布局。
 *
 * @param routes - 模块路由列表
 * @param defaultLayout - 模块默认布局
 * @returns 包裹后的路由记录数组，可直接传给 router.addRoute()
 */
export function wrapModuleRoutes(routes: ModuleRouteRecord[], defaultLayout: LayoutName): RouteRecordRaw[] {
  return routes.map((route) => {
    // 单条路由可通过 meta.layout 覆盖模块默认布局
    const routeLayout: LayoutName = route.meta?.layout || defaultLayout;
    return wrapRouteWithLayout(route, routeLayout);
  });
}
