/**
 * router/index.ts
 * 路由配置 - 支持动态路由和完整的导航守卫
 */

import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';

import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';
import { useTagsViewStore } from '@/stores/tagsView';
import { checkRoutePermission } from '@/utils/permission';

// ==================== 常量配置 ====================

/** 页面标题前缀 */
const TITLE_PREFIX = 'W3-';

/** 白名单路由（无需认证） */
const WHITE_LIST = ['/login', '/register', '/forgot-password', '/404', '/403'];

/** 默认首页 */
const DEFAULT_HOME = '/dashboard';

/** 标记是否已初始化 */
let isInitialized = false;

// ==================== 创建路由实例 ====================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  }
});

// 热更新支持
if (import.meta.hot) {
  handleHotUpdate(router);
}

// ==================== 辅助函数 ====================

/**
 * 设置页面标题
 */
function setPageTitle(to: RouteLocationNormalized): void {
  const title = to.meta?.title;

  if (typeof title === 'string') {
    document.title = `${TITLE_PREFIX}${title}`;
  } else if (!to.matched.length) {
    document.title = `${TITLE_PREFIX}页面未找到`;
  } else {
    document.title = TITLE_PREFIX.replace(/-$/, '');
  }
}

/**
 * 检查是否为白名单路由
 */
function isWhiteListRoute(path: string): boolean {
  return WHITE_LIST.includes(path);
}

// ==================== 导航守卫 ====================

/**
 * 全局前置守卫
 *
 * 执行顺序：
 * 1. 设置页面标题
 * 2. 白名单检查
 * 3. 初始化/恢复登录状态
 * 4. 登录状态检查
 * 5. 用户信息验证
 * 6. 动态路由加载
 * 7. 权限检查
 */
router.beforeEach(async (to, from, next) => {
  // 1. 设置页面标题
  setPageTitle(to);

  // 2. 白名单路由直接放行
  if (isWhiteListRoute(to.path)) {
    next();
    return;
  }

  // 3. 检查路由是否需要认证
  if (to.meta?.requireAuth === false) {
    next();
    return;
  }

  // 4. 获取认证 Store
  const authStore = useAuthStore();

  // 5. 首次加载时初始化认证状态（从 localStorage/sessionStorage 恢复）
  if (!isInitialized) {
    isInitialized = true;
    authStore.initialize();
  }

  // 6. 检查登录状态
  if (!authStore.isLoggedIn) {
    // 未登录，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 7. 如果没有用户信息，尝试获取（验证 Token 有效性）
  if (!authStore.hasUserInfo) {
    try {
      await authStore.fetchUserInfo();
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // Token 无效，清除状态并跳转登录页
      authStore.clearAuthState();
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }

  // 8. 获取权限 Store
  const permissionStore = usePermissionStore();

  // 9. 检查是否已加载动态路由
  if (!permissionStore.hasLoaded) {
    try {
      // 初始化权限（加载动态路由）
      await permissionStore.initPermission();

      // 重新导航到目标路由
      next({ ...to, replace: true });
      return;
    } catch (error) {
      console.error('加载动态路由失败:', error);
      authStore.clearAuthState();
      permissionStore.resetPermission();
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }

  // 10. 检查路由是否存在
  if (!to.matched.length) {
    next('/404');
    return;
  }

  // 11. 检查权限
  if (!checkRoutePermission(to.meta)) {
    next('/403');
    return;
  }

  // 12. 添加标签页
  const tagsViewStore = useTagsViewStore();
  tagsViewStore.addView(to);

  // 13. 放行
  next();
});

/**
 * 全局解析守卫
 */
router.beforeResolve(async (to) => {
  // 可在此处处理数据预加载
  if (to.meta?.requireAuth) {
    // 验证 token 有效性等
  }
});

/**
 * 全局后置钩子
 */
router.afterEach((to, from) => {
  // 页面访问统计等
});

/**
 * 路由错误处理
 */
router.onError((error, to) => {
  console.error('路由错误:', error);

  // 处理动态导入失败
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('正在重新加载页面以修复动态导入错误');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('动态导入错误，重新加载页面未能修复', error);
    }
  }
});

/**
 * 重置路由初始化状态（用于登出后重新初始化）
 */
export function resetRouterInitState(): void {
  isInitialized = false;
}

export default router;
