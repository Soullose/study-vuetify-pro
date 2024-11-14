/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
// import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';
import router from '../router';
import pinia from '../stores';
import vuetify from './vuetify';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    // .use(DataLoaderPlugin, { router })
    .use(router)
    .use(pinia);
}
