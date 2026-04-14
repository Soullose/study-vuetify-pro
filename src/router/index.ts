/**
 * router/index.ts
 * 路由配置 - 支持动态路由和完整的导航守卫
 *
 * 路由策略：
 * - 静态路由：手动定义的公共页面（首页、登录、错误页、测试页、portal 等）
 * - 模块路由：由 ModuleRegistry 扫描 src/modules 目录，用于业务模块（仪表盘、系统管理等）
 */

import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';
import { useTagsViewStore } from '@/stores/tagsView';
import { checkRoutePermission } from '@/utils/permission';
import { moduleRegistry } from '@/core/module-registry';

// ==================== 静态路由定义 ====================

/**
 * 手动定义的静态路由
 *
 * 对应 src/pages 和 src/platform/pages 目录下的页面组件。
 * 每条路由通过 meta.layout 指定布局，由 setupLayouts() 自动包裹布局组件。
 *
 * ⚠️ 注意：catch-all 路由（/:path(.*)*）必须放在数组最后，否则会拦截所有请求
 */
const staticRoutes: RouteRecordRaw[] = [
  // ---- 首页 ----
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
    meta: {
      title: '首页',
      layout: 'admin',
      requireAuth: true
    }
  },

  // ---- 登录页 ----
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录',
      layout: 'blank',
      requireAuth: false
    }
  },

  // ---- 错误页面 ----
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/403.vue'),
    meta: {
      title: '无访问权限',
      layout: 'blank',
      requireAuth: false
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: {
      title: '页面未找到',
      layout: 'blank',
      requireAuth: false
    }
  },

  // ---- 功能页面 ----
  {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test/index.vue'),
    meta: {
      title: '测试',
      layout: 'admin',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/pages/icon/index.vue'),
    meta: {
      title: '图标选择器',
      layout: 'admin',
      requireAuth: true
    }
  },

  // ---- 重定向中转页（用于页签刷新机制） ----
  {
    path: '/redirect/:path(.*)*',
    name: 'redirect',
    component: () => import('@/pages/redirect/[...path].vue'),
    meta: {
      requireAuth: false
    }
  },

  // ---- Portal 门户页面 ----
  {
    path: '/platform/portal',
    name: 'platform-portal',
    component: () => import('@/platform/pages/portal/index.vue'),
    meta: {
      title: '门户网站',
      layout: 'portal',
      requireAuth: true
    }
  },

  // ---- Platform catch-all（platform 目录下未匹配的路径） ----
  {
    path: '/platform/:path(.*)*',
    name: 'platform-catch-all',
    component: () => import('@/platform/pages/[...path].vue'),
    meta: {
      title: '页面未找到',
      layout: 'blank',
      requireAuth: false
    }
  },

  // ---- 全局 catch-all（⚠️ 必须放在最后） ----
  {
    path: '/:path(.*)*',
    name: 'catch-all',
    component: () => import('@/pages/[...path].vue'),
    meta: {
      title: '页面未找到',
      layout: 'admin',
      requireAuth: false
    }
  }
];

// ==================== 常量配置 ====================

/** 页面标题前缀 */
const TITLE_PREFIX = 'W3-';

/** 白名单路由（无需认证） */
const WHITE_LIST = ['/login', '/register', '/forgot-password', '/404', '/403'];

/** 默认首页（后续导航守卫中使用） */
const _DEFAULT_HOME = '/dashboard';
void _DEFAULT_HOME;

/** 标记是否已初始化 */
let isInitialized = false;

// ==================== 创建路由实例 ====================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(staticRoutes)],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  }
});

// ==================== 注册业务模块路由 ====================

// 通过 ModuleRegistry 扫描 src/modules 目录下的模块配置，
// 自动包裹布局并注册到路由实例
moduleRegistry.registerRoutes(router);

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
