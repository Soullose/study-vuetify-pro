import type { RouteRecordRaw, RouteComponent } from 'vue-router';
import type { ApiRouteConfig } from '@/api/modules/permission';

// 组件映射表（用于动态导入）
const modules = import.meta.glob('../pages/**/*.vue');

/**
 * 将后端路由配置转换为前端路由配置
 */
export function transformRoutes(routes: ApiRouteConfig[]): RouteRecordRaw[] {
  return routes.map((route) => transformRoute(route)).filter(Boolean) as RouteRecordRaw[];
}

/**
 * 转换单个路由
 */
function transformRoute(route: ApiRouteConfig): RouteRecordRaw | null {
  // 过滤隐藏的路由
  if (route.hidden) {
    return null;
  }

  const result: RouteRecordRaw = {
    path: route.path,
    name: route.name,
    meta: {
      title: route.meta?.title,
      icon: route.meta?.icon,
      hidden: route.meta?.hidden,
      keepAlive: route.meta?.keepAlive ?? route.keepAlive,
      affix: route.meta?.affix,
      link: route.meta?.link,
      permissions: route.meta?.permissions,
      roles: route.meta?.roles,
      breadcrumb: route.meta?.breadcrumb
    }
  } as RouteRecordRaw;

  // 处理重定向
  if (route.redirect) {
    result.redirect = route.redirect;
  }

  // 处理组件
  if (route.component) {
    result.component = loadComponent(route.component);
  }

  // 处理子路由
  if (route.children && route.children.length > 0) {
    result.children = transformRoutes(route.children);
  }

  return result;
}

/**
 * 动态加载组件
 */
function loadComponent(component: string): RouteComponent | undefined {
  // 构建组件路径
  const componentPath = `../pages/${component}.vue`;

  // 检查组件是否存在
  if (modules[componentPath]) {
    return modules[componentPath] as RouteComponent;
  }

  console.warn(`组件不存在: ${componentPath}`);
  return undefined;
}

/**
 * 将菜单列表转换为树形结构
 */
export function buildMenuTree<T extends { id: string | number; parentId?: string | number | null }>(items: T[], parentId: string | number | null = null): T[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => ((a as any).sort ?? 0) - ((b as any).sort ?? 0))
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id)
    })) as T[];
}

/**
 * 将扁平路由列表转换为树形结构
 */
export function buildRouteTree(routes: ApiRouteConfig[], parentId: string | number | null = null): ApiRouteConfig[] {
  return routes
    .filter((route) => route.parentId === parentId)
    .map((route) => ({
      ...route,
      children: buildRouteTree(routes, route.id as string | number)
    }));
}
