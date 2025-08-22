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
/// 标题前缀
const titlePrefix = 'W3-';

routes.map((route) => {
  console.log('route1:', route);
  if (route?.path === '/w3') {
    if (!route.meta) {
      route.meta ??= {};
    }
    route.meta.title = '首页';
  }
  if (route?.path === '/login') {
    if (route.meta) {
      route.meta.layout = 'default';
      route.meta.isLayout = false;
    }
  }
  if (route?.path === '/login/') {
    if (route.meta) {
      route.meta.layout = 'default';
      route.meta.isLayout = false;
    }
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)]
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
router.beforeEach(async (to, from, next) => {
  console.log('to1:', to);
  // redirect login page
  // const redirectData: { path: string; replace: boolean; query?: any } = {
  //   path: '',
  //   replace: true
  // };
  if (true && to.path !== '/login') {
    // if (!to.meta?.requireAuth) {
    //   next();
    //   // return;
    // }

    next({ path: '/login', replace: true });
  } else {
    next();
  }
  // const routeExists = router.getRoutes().some((route) => route.path === to.path);
  // console.log('routeExists:', routeExists);
  // if (!to.matched.length && !to.name) {
  //   next(Error('错误'));
  // }
  // if (to.path === '/platform/portal') {
  //   next();
  // }
  // if (to.path === '/dashboard') {
  //   router.replace('/platform/portal');
  //   // next();
  // }
  // else if (to.path === '/') {
  //   router.replace('/w3');
  // }
  // else {
  //   next();
  // }
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
  if (to.meta?.requireAuth) {
    console.log('beforeResolve', to.fullPath);
  }
});

router.afterEach((to, from) => {
  console.log('afterEach-from:', from);
  console.log('afterEach-to:', to);
  if (to?.name === '/[...path]') {
    document.title = titlePrefix + '404';
  } else if (to.meta.title) {
    console.log('to2:', to);
    if (typeof to.meta.title === 'string') {
      document.title = titlePrefix + to.meta.title;
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
