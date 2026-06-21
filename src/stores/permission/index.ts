import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MenuItem } from '@/api/modules/permission';
import * as permissionApi from '@/api/modules/permission';
import { buildMenuTree } from '@/utils/route-transform';

/**
 * 权限 Store
 *
 * 职责边界（经权限路由收敛后明确）：
 * - 仅负责「菜单数据」与「按钮级权限码」。
 * - 路由注册交由 ModuleRegistry 静态管理（src/core/module-registry.ts）。
 * - 菜单渲染以本 store 的 menus 为唯一数据源，由后端 getUserMenus() 返回，
 *   从而实现「不同登录用户看到不同菜单」的真实 RBAC。
 *
 * 历史背景：本 store 曾同时负责后端动态路由注册（generateRoutes/transformRoutes），
 * 但那套机制与静态模块路由在 path 上冲突且从不生效，已移除。
 */
export const usePermissionStore = defineStore('permission', () => {
  // ==================== State ====================

  /** 是否已加载菜单与权限数据 */
  const isLoaded = ref(false);

  /** 菜单列表（后端返回的扁平结构，经 buildMenuTree 转为树形） */
  const menus = ref<MenuItem[]>([]);

  /** 当前用户的权限码列表（用于按钮级权限校验） */
  const permissions = ref<string[]>([]);

  // ==================== Getters ====================

  /** 是否已加载 */
  const hasLoaded = computed(() => isLoaded.value);

  /** 获取菜单树 */
  const getMenuList = computed(() => menus.value);

  // ==================== Actions ====================

  /**
   * 生成菜单：从后端拉取扁平菜单，转为树形后存储
   */
  async function generateMenus(): Promise<MenuItem[]> {
    try {
      const apiMenus = await permissionApi.getUserMenus();
      // 转换为树形结构，按 sort 排序
      menus.value = buildMenuTree(apiMenus);
      return menus.value;
    } catch (error) {
      console.error('获取菜单失败:', error);
      return [];
    }
  }

  /**
   * 生成权限码：从后端拉取当前用户的权限列表
   */
  async function generatePermissions(): Promise<string[]> {
    try {
      permissions.value = await permissionApi.getUserPermissions();
      return permissions.value;
    } catch (error) {
      console.error('获取权限列表失败:', error);
      return [];
    }
  }

  /**
   * 初始化权限（登录后由路由守卫调用）
   *
   * 仅拉取菜单与权限码，不再注册路由。
   */
  async function initPermission(): Promise<void> {
    if (isLoaded.value) {
      return;
    }

    try {
      await Promise.all([generateMenus(), generatePermissions()]);
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
    isLoaded.value = false;
    menus.value = [];
    permissions.value = [];
  }

  /**
   * 检查是否拥有指定权限码（按钮级权限）
   *
   * @param code - 权限码，如 'user:edit'
   * @returns 是否拥有该权限（'*' 通配视为拥有全部权限）
   */
  function hasPermission(code: string): boolean {
    if (permissions.value.includes('*')) return true;
    return permissions.value.includes(code);
  }

  return {
    // State
    isLoaded,
    menus,
    permissions,

    // Getters
    hasLoaded,
    getMenuList,

    // Actions
    generateMenus,
    generatePermissions,
    initPermission,
    resetPermission,
    hasPermission
  };
});
