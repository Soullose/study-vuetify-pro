import { get } from '../index';

/**
 * 菜单项
 *
 * 后端返回的扁平菜单结构，由前端 buildMenuTree 转为树形供侧边栏渲染。
 * 这是侧边栏菜单的唯一数据来源（经权限路由收敛后明确）。
 */
export interface MenuItem {
  /** 菜单 ID */
  id: string | number;
  /** 父级 ID（根菜单为 null 或缺省） */
  parentId?: string | number | null;
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon?: string;
  /** 排序（升序，缺省视为 0） */
  sort?: number;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 外链 */
  link?: string;
  /** 子菜单（由前端 buildMenuTree 填充） */
  children?: MenuItem[];
}

/**
 * 获取用户菜单
 *
 * 返回扁平菜单列表，前端用 buildMenuTree 转树形。
 * 后端依据当前用户角色返回不同数据，实现菜单级权限隔离。
 */
export function getUserMenus(): Promise<MenuItem[]> {
  return get<MenuItem[]>('/system/permission/menus');
}

/**
 * 获取用户权限列表
 *
 * 返回当前用户的按钮级权限码数组（如 ['user:edit']，admin 为 ['*']）。
 * 供 hasPermission() 做按钮级权限校验。
 */
export function getUserPermissions(): Promise<string[]> {
  return get<string[]>('/system/permission/permissions');
}
