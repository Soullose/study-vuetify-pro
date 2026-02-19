import { get } from '../index';

/**
 * 后端返回的路由配置
 */
export interface ApiRouteConfig {
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 路由重定向 */
  redirect?: string;
  /** 组件路径（相对于 src/pages） */
  component?: string;
  /** 路由元信息 */
  meta?: ApiRouteMeta;
  /** 子路由 */
  children?: ApiRouteConfig[];
  /** 是否隐藏菜单 */
  hidden?: boolean;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 父级 ID */
  parentId?: string | number | null;
  /** ID */
  id?: string | number;
  /** 排序 */
  sort?: number;
}

/**
 * 后端路由元信息
 */
export interface ApiRouteMeta {
  /** 页面标题 */
  title: string;
  /** 菜单图标 */
  icon?: string;
  /** 是否隐藏菜单 */
  hidden?: boolean;
  /** 是否缓存页面 */
  keepAlive?: boolean;
  /** 是否固定在 tab 上 */
  affix?: boolean;
  /** 外链地址 */
  link?: string;
  /** 所需权限 */
  permissions?: string[];
  /** 所需角色 */
  roles?: string[];
  /** 面包屑 */
  breadcrumb?: boolean;
}

/**
 * 菜单项
 */
export interface MenuItem {
  /** 菜单 ID */
  id: string | number;
  /** 父级 ID */
  parentId?: string | number | null;
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon?: string;
  /** 排序 */
  sort?: number;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 外链 */
  link?: string;
  /** 子菜单 */
  children?: MenuItem[];
}

/**
 * 获取用户路由配置
 */
export function getUserRoutes(): Promise<ApiRouteConfig[]> {
  return get<ApiRouteConfig[]>('/system/permission/routes');
}

/**
 * 获取用户菜单
 */
export function getUserMenus(): Promise<MenuItem[]> {
  return get<MenuItem[]>('/system/permission/menus');
}

/**
 * 获取用户权限列表
 */
export function getUserPermissions(): Promise<string[]> {
  return get<string[]>('/system/permission/permissions');
}
