/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { w2RouterStore } from '@/stores/router';

import { setupLayouts } from 'virtual:generated-layouts';
// import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';
// declare module 'vue-router' {
//   interface RouteMeta {
//     name?: string;
//     requiresAuth?: boolean;
//   }
// }
// routes.unshift({ path: '/', redirect: '/test' });
// routes.push({
//   path: import.meta.env.BASE_URL,
//   redirect: (to) => '/test/'
// });

routes.map((route) => {
  console.log('route:', route);
  if (route?.path === '/') {
    if (!route.meta) {
      route.meta = {};
    }
    route.meta.title = '首页';
  }
  // else if (route?.path === '/test') {
  //   if (!route.meta) {
  //     route.meta = {};
  //   }
  //   route.meta.title = '测试';
  // }
  // route.meta.requiresAuth = true;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes)
});

if (import.meta.hot) {
  handleHotUpdate(router);
}

router.isReady().then(() => {
  console.log('router ready');
  localStorage.removeItem('vuetify:dynamic-reload');
  const routerStore = w2RouterStore();
  routerStore.setRouter(routes);
  console.log('routes:', routes);
});

/// 导航守卫
/// to: 即将要进入的目标
/// from: 当前导航正要离开的路由
router.beforeEach((to, from, next) => {
  // console.log('to:', to);
  // console.log('to.name:', to.name);
  // console.log('to1:', router.getRoutes());
  // console.log('from:', from);

  const routeExists = router.getRoutes().some((route) => route.path === to.path);
  // console.log('routeExists:', routeExists);
  if (!routeExists && to.name === undefined) {
    next(Error('错误'));
  } else {
    next();
  }
  // if (to.name == '/') next({ name: '/test/' });
  // if (to.name !== '/') next({ name: '/' });
  // else next();
  // 返回 false 以取消导航
  // return false;
  // next();
});

/// 全局解析守卫
/**
 * 可以用 router.beforeResolve 注册一个全局守卫。
 * 这和 router.beforeEach 类似，因为它在每次导航时都会触发，
 * 不同的是，解析守卫刚好会在导航被确认之前、
 * 所有组件内守卫和异步路由组件被解析之后调用。
 * 这里有一个例子，根据路由在元信息中的 requiresCamera
 * 属性确保用户访问摄像头的权限：
 */
router.beforeResolve(async (to) => {
  console.log('requiresCamera:', to.meta.requiresCamera);
});

router.afterEach((to, from) => {
  console.log('afterEach-from:', from);
  console.log('afterEach-to:', to);
  if (to?.name === '/[...path]') {
    document.title = '404';
  } else if (to.meta.title) {
    console.log('to:', to);
    if (typeof to.meta.title === 'string') {
      document.title = to.meta.title;
    }
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
/// 路由导航异常会执行onError
router.onError((err, to) => {
  // console.log('onError:', err);
  if (err?.message?.includes?.('错误')) {
    console.log('onError-错误');
  }
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});
export default router;
