/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
// import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';
import router from '../router';
import pinia from '../stores';
import './grid';
import vuetify from './vuetify';
// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  app
    .use(pinia) // Pinia 必须在 Router 之前注册，因为导航守卫中使用了 Store
    .use(vuetify)
    // .use(DataLoaderPlugin, { router })
    .use(router);
}
