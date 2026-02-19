import { useAuthStore } from '@/stores/auth';
import type { RouteMeta } from 'vue-router';

/**
 * 检查用户是否拥有指定权限
 * @param value 权限标识或权限列表
 * @returns 是否拥有权限
 */
export function checkPermission(value: string | string[]): boolean {
  const authStore = useAuthStore();
  return authStore.hasPermission(value);
}

/**
 * 检查用户是否拥有指定角色
 * @param value 角色标识或角色列表
 * @returns 是否拥有角色
 */
export function checkRole(value: string | string[]): boolean {
  const authStore = useAuthStore();
  return authStore.hasRole(value);
}

/**
 * 检查路由权限
 * @param meta 路由元信息
 * @returns 是否有权限访问
 */
export function checkRoutePermission(meta?: RouteMeta): boolean {
  if (!meta) return true;

  const authStore = useAuthStore();

  // 无权限要求
  if (!meta.permissions?.length && !meta.roles?.length) {
    return true;
  }

  // 检查权限
  if (meta.permissions?.length && !authStore.hasPermission(meta.permissions)) {
    return false;
  }

  // 检查角色
  if (meta.roles?.length && !authStore.hasRole(meta.roles)) {
    return false;
  }

  return true;
}

/**
 * 权限指令值类型
 */
export type PermissionValue = string | string[] | { permission?: string | string[]; role?: string | string[] };

/**
 * 解析权限指令值
 */
export function parsePermissionValue(value: PermissionValue): {
  permissions?: string[];
  roles?: string[];
} {
  if (typeof value === 'string') {
    return { permissions: [value] };
  }

  if (Array.isArray(value)) {
    return { permissions: value };
  }

  return {
    permissions: value.permission ? (Array.isArray(value.permission) ? value.permission : [value.permission]) : undefined,
    roles: value.role ? (Array.isArray(value.role) ? value.role : [value.role]) : undefined
  };
}
