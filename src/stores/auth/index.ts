import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserInfo, LoginParams } from '@/api/modules/auth';
import * as authApi from '@/api/modules/auth';

// Token 存储 Key
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

export const useAuthStore = defineStore('auth', () => {
  // ==================== State ====================

  /** 访问令牌 */
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));

  /** 刷新令牌 */
  const refreshTokenValue = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));

  /** 用户信息 */
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null'));

  // ==================== Getters ====================

  /** 是否已登录 */
  const isLoggedIn = computed(() => !!token.value);

  /** 是否有用户信息 */
  const hasUserInfo = computed(() => !!userInfo.value);

  /** 用户角色列表 */
  const roles = computed(() => userInfo.value?.roles || []);

  /** 用户权限列表 */
  const permissions = computed(() => userInfo.value?.permissions || []);

  /** 用户显示名称 */
  const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.username || '未知用户';
  });

  /** 用户头像 */
  const avatar = computed(() => {
    return userInfo.value?.avatar || '/default-avatar.png';
  });

  // ==================== Actions ====================

  /**
   * 用户登录
   */
  async function login(params: LoginParams): Promise<void> {
    try {
      const result = await authApi.login(params);
      console.log('登录成功:', result);
      // 存储 Token
      setToken(result.accessToken, result.refreshToken);

      // 存储用户信息
      setUserInfo(result.userInfo);
    } catch (error) {
      clearAuthState();
      throw error;
    }
  }

  /**
   * 用户登出
   */
  async function logout(): Promise<void> {
    try {
      // 调用后端登出接口
      await authApi.logout();
    } catch (error) {
      console.warn('登出接口调用失败:', error);
    } finally {
      clearAuthState();
    }
  }

  /**
   * 刷新访问令牌
   */
  async function refreshAccessToken(): Promise<string | null> {
    if (!refreshTokenValue.value) {
      return null;
    }

    try {
      const result = await authApi.refreshToken(refreshTokenValue.value);
      setToken(result.accessToken, result.refreshToken);
      return result.accessToken;
    } catch (error) {
      clearAuthState();
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo(): Promise<UserInfo> {
    const info = await authApi.getUserInfo();
    setUserInfo(info);
    return info;
  }

  /**
   * 检查是否拥有指定权限
   */
  function hasPermission(permission: string | string[]): boolean {
    if (!permission) return true;
    const perms = Array.isArray(permission) ? permission : [permission];
    return perms.some((p) => permissions.value.includes(p));
  }

  /**
   * 检查是否拥有指定角色
   */
  function hasRole(role: string | string[]): boolean {
    if (!role) return true;
    const roleList = Array.isArray(role) ? role : [role];
    return roleList.some((r) => roles.value.includes(r));
  }

  /**
   * 检查是否拥有所有指定权限
   */
  function hasAllPermissions(permissionList: string[]): boolean {
    return permissionList.every((p) => permissions.value.includes(p));
  }

  /**
   * 检查是否拥有所有指定角色
   */
  function hasAllRoles(roleList: string[]): boolean {
    return roleList.every((r) => roles.value.includes(r));
  }

  // ==================== Helper Functions ====================

  /**
   * 设置 Token
   */
  function setToken(accessToken: string, refresh?: string): void {
    token.value = accessToken;
    localStorage.setItem(TOKEN_KEY, accessToken);

    if (refresh) {
      refreshTokenValue.value = refresh;
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  }

  /**
   * 设置用户信息
   */
  function setUserInfo(info: UserInfo): void {
    userInfo.value = info;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
  }

  /**
   * 清除认证状态
   */
  function clearAuthState(): void {
    token.value = null;
    refreshTokenValue.value = null;
    userInfo.value = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  return {
    // State
    token,
    refreshTokenValue,
    userInfo,

    // Getters
    isLoggedIn,
    hasUserInfo,
    roles,
    permissions,
    displayName,
    avatar,

    // Actions
    login,
    logout,
    refreshAccessToken,
    fetchUserInfo,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAllRoles,

    // Helper
    setToken,
    setUserInfo,
    clearAuthState
  };
});
