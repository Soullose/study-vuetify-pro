/**
 * @description 菜单状态管理 - 从模块注册中心获取菜单数据
 * @author Architecture Team
 * @date 2026-04-05
 */

import { defineStore } from 'pinia';
import { moduleRegistry } from '@/core/module-registry';
import type { MenuItem } from '@/core/types';

/**
 * 菜单 Store
 *
 * 数据来源：ModuleRegistry 扫描 src/modules 目录下的模块配置
 * 使用方式：在布局组件中调用 useMenuStore() 获取菜单列表
 */
export const useMenuStore = defineStore('menu', () => {
  /** 所有菜单项（已排序） */
  const menuItems = computed<MenuItem[]>(() => {
    return moduleRegistry.getMenuItems();
  });

  /** 后台管理布局的菜单 */
  const adminMenus = computed<MenuItem[]>(() => {
    return moduleRegistry.getMenuByLayout('admin');
  });

  /** 门户网站布局的菜单 */
  const portalMenus = computed<MenuItem[]>(() => {
    return moduleRegistry.getMenuByLayout('portal');
  });

  return {
    menuItems,
    adminMenus,
    portalMenus
  };
});
