// Plugins
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import Layouts, { ClientSideLayout } from 'vite-plugin-vue-layouts';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// Utilities
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

import { compression } from 'vite-plugin-compression2';
import esToolkitPlugin from 'vite-plugin-es-toolkit';

const envDir = path.resolve(__dirname, 'env');
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command:', command);

  const env = loadEnv(mode, envDir);
  return {
    envDir: envDir,
    esbuild: { drop: command === 'serve' ? [] : ['debugger', 'console'] },
    plugins: [
      VueRouter({
        importMode: 'async',
        dts: 'src/typed-router.d.ts',
        routesFolder: [
          { src: 'src/pages' }
          // , { src: 'src/layouts' }
        ],
        /// 在配置文件中拓展路由,在组件内使用definePage将失效 https://uvr.esm.is/guide/extending-routes
        async extendRoute(route) {
          // console.log('path', route.path);
          // console.log('name', route.name);
          if (route.path === '/') {
            // route.addAlias('/');
            route.meta = {
              layout: 'home',
              name: route.name || '',
              title: route.meta?.title || route.name || '',
              requireAuth: route.meta?.requireAuth || false,
              keepAlive: route.meta?.keepAlive || false
            };
          } else if (route.path === '/test') {
            // route.addAlias('/test');
            route.meta = {
              layout: 'default',
              name: route.name || '',
              title: route.meta?.title || route.name || '',
              requireAuth: route.meta?.requireAuth || false,
              keepAlive: route.meta?.keepAlive || false
            };
          }
        },

        // modify routes before writing
        async beforeWriteFiles(rootRoute) {
          // ...
        }
      }),
      Layouts({
        layoutsDirs: 'src/layouts',
        pagesDirs: ['src/pages'],
        defaultLayout: 'home',
        importMode: () => 'async'
      }),
      ClientSideLayout({
        layoutDir: 'src/layouts',
        defaultLayout: 'home',
        importMode: 'async'
      }),
      AutoImport({
        imports: [
          'vue',
          // {
          //   'vue-router/auto': ['useRoute', 'useRouter']
          // },
          'pinia',
          VueRouterAutoImports
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        },
        vueTemplate: true
      }),
      Components({
        dts: 'src/components.d.ts'
      }),
      Vue({
        include: ['**/*.vue', '*.vue'],
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss'
        }
      }),
      Fonts({
        google: {
          families: [
            {
              name: 'Roboto',
              styles: 'wght@100;300;400;500;700;900'
            }
          ]
        }
      }),
      compression(),
      esToolkitPlugin()
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      watch: {
        usePolling: true
      },
      hmr: true,
      /// 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
      strictPort: false,
      open: '/'
    },
    /// 构建选项
    build: {
      reportCompressedSize: true
    }
  };
});
