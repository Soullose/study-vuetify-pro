import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { MenuItem } from '@/api/modules/permission';
import * as permissionApi from '@/api/modules/permission';
import { transformRoutes, buildMenuTree } from '@/utils/route-transform';
import router from '@/router';

export const usePermissionStore = defineStore('permission', () => {
  // ==================== State ====================

  /** 是否已加载动态路由 */
  const isLoaded = ref(false);

  /** 动态路由列表 */
  const dynamicRoutes = ref<RouteRecordRaw[]>([]);

  /** 菜单列表 */
  const menus = ref<MenuItem[]>([]);

  // ==================== Getters ====================

  /** 是否已加载 */
  const hasLoaded = computed(() => isLoaded.value);

  /** 获取菜单 */
  const getMenuList = computed(() => menus.value);

  /** 获取动态路由 */
  const getDynamicRoutes = computed(() => dynamicRoutes.value);

  // ==================== Actions ====================

  /**
   * 生成路由
   */
  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    try {
      // 从后端获取路由配置
      const apiRoutes = await permissionApi.getUserRoutes();

      // 转换为前端路由格式
      const routes = transformRoutes(apiRoutes);

      // 保存动态路由
      dynamicRoutes.value = routes;

      return routes;
    } catch (error) {
      console.error('获取动态路由失败:', error);
      // 失败时返回空数组，使用静态路由
      return [];
    }
  }

  /**
   * 生成菜单
   */
  async function generateMenus(): Promise<MenuItem[]> {
    try {
      // 从后端获取菜单
      const apiMenus = await permissionApi.getUserMenus();

      // 转换为树形结构
      const menuTree = buildMenuTree(apiMenus);

      // 保存菜单
      menus.value = menuTree;

      return menuTree;
    } catch (error) {
      console.error('获取菜单失败:', error);
      return [];
    }
  }

  /**
   * 初始化权限（加载动态路由和菜单）
   */
  async function initPermission(): Promise<void> {
    if (isLoaded.value) {
      return;
    }

    try {
      // 1. 生成动态路由
      const routes = await generateRoutes();

      // 2. 动态添加路由（作为顶级路由）
      // 注意：此处暂不包裹布局组件，完整的布局包裹将在模块注册中心（阶段三）中实现
      routes.forEach((route) => {
        router.addRoute(route);
      });

      // 3. 生成菜单
      await generateMenus();

      // 4. 标记已加载
      isLoaded.value = true;
    } catch (error) {
      console.error('初始化权限失败:', error);
      throw error;
    }
  }

  /**
   * 重置权限（登出时调用）
   */
  function resetPermission(): void {
    // 先移除动态添加的路由（在清空数组之前）
    dynamicRoutes.value.forEach((route) => {
      if (route.name) {
        router.removeRoute(route.name);
      }
    });

    // 再清空状态
    isLoaded.value = false;
    dynamicRoutes.value = [];
    menus.value = [];
  }

  /**
   * 检查路由是否存在
   */
  function hasRoute(name: string): boolean {
    return router.hasRoute(name) || dynamicRoutes.value.some((r) => r.name === name);
  }

  return {
    // State
    isLoaded,
    dynamicRoutes,
    menus,

    // Getters
    hasLoaded,
    getMenuList,
    getDynamicRoutes,

    // Actions
    generateRoutes,
    generateMenus,
    initPermission,
    resetPermission,
    hasRoute
  };
});
