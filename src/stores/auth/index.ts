import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserInfo, LoginParams } from '@/api/modules/auth';
import * as authApi from '@/api/modules/auth';

// ==================== 存储常量 ====================

/** Token 存储 Key */
const TOKEN_KEY = 'access_token';
/** 刷新 Token 存储 Key */
const REFRESH_TOKEN_KEY = 'refresh_token';
/** 用户信息存储 Key */
const USER_INFO_KEY = 'user_info';
/** Token 过期时间存储 Key */
const TOKEN_EXPIRES_KEY = 'token_expires';
/** 记住我标识 Key */
const REMEMBER_ME_KEY = 'remember_me';
/** 记住的用户名 Key */
const REMEMBERED_USERNAME_KEY = 'remembered_username';

/** Token 刷新阈值（5分钟前刷新） */
const REFRESH_THRESHOLD = 5 * 60 * 1000;
/** 检查间隔（每分钟检查一次） */
const CHECK_INTERVAL = 60 * 1000;

// ==================== 模块级变量 ====================

/** Token 刷新定时器 */
let refreshTimer: ReturnType<typeof setInterval> | null = null;

/** Token 过期时间 */
let tokenExpiresAt: number | null = null;

export const useAuthStore = defineStore('auth', () => {
  // ==================== State ====================

  /** 访问令牌 */
  const token = ref<string | null>(null);

  /** 刷新令牌 */
  const refreshTokenValue = ref<string | null>(null);

  /** 用户信息 */
  const userInfo = ref<UserInfo | null>(null);

  /** 是否记住我 */
  const isRememberMe = ref(false);

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
   * 初始化认证状态
   * 从存储中恢复登录状态
   */
  function initialize(): boolean {
    // 检查是否记住我
    isRememberMe.value = getStorageItem(REMEMBER_ME_KEY) === 'true';

    // 根据记住我选择存储方式
    const storage = isRememberMe.value ? localStorage : sessionStorage;

    const savedToken = storage.getItem(TOKEN_KEY);
    const savedUserInfo = storage.getItem(USER_INFO_KEY);
    const savedExpiresAt = storage.getItem(TOKEN_EXPIRES_KEY);

    if (savedToken) {
      token.value = savedToken;
      refreshTokenValue.value = storage.getItem(REFRESH_TOKEN_KEY);

      if (savedUserInfo) {
        try {
          userInfo.value = JSON.parse(savedUserInfo);
        } catch {
          clearAuthState();
          return false;
        }
      }

      // 检查 Token 是否过期
      if (savedExpiresAt) {
        tokenExpiresAt = parseInt(savedExpiresAt, 10);
        if (Date.now() >= tokenExpiresAt) {
          // Token 已过期
          clearAuthState();
          return false;
        }
        // 启动刷新定时器
        startRefreshTimer();
      }

      return true;
    }

    return false;
  }

  /**
   * 用户登录
   * @param params 登录参数
   * @param rememberMe 是否记住我
   */
  async function login(params: LoginParams, rememberMe: boolean = false): Promise<void> {
    try {
      const result = await authApi.login(params);

      // 设置记住我状态
      isRememberMe.value = rememberMe;
      setStorageItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');

      // 处理记住的用户名
      if (rememberMe) {
        setStorageItem(REMEMBERED_USERNAME_KEY, params.username);
      } else {
        removeStorageItem(REMEMBERED_USERNAME_KEY);
      }

      // 存储 Token 和用户信息
      setToken(result.accessToken, result.refreshToken, result.expiresIn);
      setUserInfo(result.userInfo);

      // 启动 Token 刷新定时器
      startRefreshTimer();
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
      setToken(result.accessToken, result.refreshToken, result.expiresIn);
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
   * 验证 Token 有效性
   */
  async function validateToken(): Promise<boolean> {
    if (!token.value) return false;

    try {
      await fetchUserInfo();
      return true;
    } catch {
      clearAuthState();
      return false;
    }
  }

  /**
   * 获取记住的用户名
   */
  function getRememberedUsername(): string | null {
    if (localStorage.getItem(REMEMBER_ME_KEY) === 'true') {
      return localStorage.getItem(REMEMBERED_USERNAME_KEY);
    }
    return null;
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
   * 获取存储项（根据记住我选择存储方式）
   */
  function getStorageItem(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   * 设置存储项（根据记住我选择存储方式）
   */
  function setStorageItem(key: string, value: string): void {
    const storage = isRememberMe.value ? localStorage : sessionStorage;
    storage.setItem(key, value);
  }

  /**
   * 移除存储项（同时清除两种存储）
   */
  function removeStorageItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /**
   * 设置 Token
   */
  function setToken(accessToken: string, refresh?: string, expiresIn?: number): void {
    const storage = isRememberMe.value ? localStorage : sessionStorage;

    token.value = accessToken;
    storage.setItem(TOKEN_KEY, accessToken);

    if (refresh) {
      refreshTokenValue.value = refresh;
      storage.setItem(REFRESH_TOKEN_KEY, refresh);
    }

    // 存储过期时间
    if (expiresIn) {
      const expiresAt = Date.now() + expiresIn * 1000;
      storage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
      tokenExpiresAt = expiresAt;
    }
  }

  /**
   * 设置用户信息
   */
  function setUserInfo(info: UserInfo): void {
    userInfo.value = info;
    const storage = isRememberMe.value ? localStorage : sessionStorage;
    storage.setItem(USER_INFO_KEY, JSON.stringify(info));
  }

  /**
   * 清除认证状态
   */
  function clearAuthState(): void {
    // 停止刷新定时器
    stopRefreshTimer();

    // 重置状态
    token.value = null;
    refreshTokenValue.value = null;
    userInfo.value = null;
    tokenExpiresAt = null;

    // 清除 localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);

    // 清除 sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRES_KEY);
  }

  /**
   * 启动 Token 刷新定时器
   */
  function startRefreshTimer(): void {
    stopRefreshTimer();

    const storage = isRememberMe.value ? localStorage : sessionStorage;
    const expiresAt = storage.getItem(TOKEN_EXPIRES_KEY);
    if (!expiresAt) return;

    tokenExpiresAt = parseInt(expiresAt, 10);

    const checkAndRefresh = async () => {
      if (!tokenExpiresAt || !token.value) return;

      const now = Date.now();
      const timeUntilExpiry = tokenExpiresAt - now;

      if (timeUntilExpiry <= REFRESH_THRESHOLD && timeUntilExpiry > 0) {
        // 即将过期，刷新 Token
        try {
          console.log('Token 即将过期，正在刷新...');
          await refreshAccessToken();
          console.log('Token 刷新成功');
        } catch (error) {
          console.error('Token 刷新失败:', error);
          clearAuthState();
          // 跳转到登录页
          window.location.href = '/login';
        }
      } else if (timeUntilExpiry <= 0) {
        // Token 已过期
        console.log('Token 已过期');
        clearAuthState();
        window.location.href = '/login';
      }
    };

    // 立即检查一次
    checkAndRefresh();

    // 设置定时检查
    refreshTimer = setInterval(checkAndRefresh, CHECK_INTERVAL);
  }

  /**
   * 停止刷新定时器
   */
  function stopRefreshTimer(): void {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  return {
    // State
    token,
    refreshTokenValue,
    userInfo,
    isRememberMe,

    // Getters
    isLoggedIn,
    hasUserInfo,
    roles,
    permissions,
    displayName,
    avatar,

    // Actions
    initialize,
    login,
    logout,
    refreshAccessToken,
    fetchUserInfo,
    validateToken,
    getRememberedUsername,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAllRoles,

    // Helper
    setToken,
    setUserInfo,
    clearAuthState,
    startRefreshTimer,
    stopRefreshTimer
  };
});
