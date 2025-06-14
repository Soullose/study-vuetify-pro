// Plugins
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import { getFileBasedRouteName, VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
// import { ClientSideLayout } from 'vite-plugin-vue-layouts';
import { ClientSideLayout } from 'vite-plugin-vue-layouts-next';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// Utilities
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

import UnoCSS from 'unocss/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
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
        // 指定一个目录或者多个目录生成基于文件的路由，默认是src/pages
        routesFolder: [{ src: 'src/pages' }, { src: 'src/platform/pages', path: 'platform/' }],
        // 指定typed-router.d.ts的生成路径，如果项目中用到了typescript；可以通过false禁用
        dts: 'src/typed-router.d.ts',
        // 指定需要排除的目录，默认为空
        exclude: [],
        // 提供路由策略
        getRouteName: (route) => getFileBasedRouteName(route),
        /// 在配置文件中拓展路由,在组件内使用definePage将失效 https://uvr.esm.is/guide/extending-routes
        async extendRoute(route) {
          // console.log('path', route.path);
          // console.log('meta:', route.meta);
          // console.log('name', route.name);
          if (route.path === '/[name]') {
            console.log('route-name:', route.name);
            route.meta = {
              layout: 'home',
              name: route.name || '',
              title: route.meta?.title || route.name || '',
              requireAuth: route.meta?.requireAuth || false,
              keepAlive: route.meta?.keepAlive || false
            };
          } else if (route.path === '/platform') {
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
          // console.log('rootRoute:', rootRoute);
        },
        // 更改页面组件的导入模式，默认async sync
        importMode: 'sync'
      }),
      // Layouts({
      //   layoutsDirs: 'src/layouts',
      //   pagesDirs: ['src/pages', 'src/platform'],
      //   defaultLayout: 'home',
      //   importMode: () => 'sync'
      // }),
      ClientSideLayout({
        layoutDir: 'src/layouts',
        defaultLayout: 'home',
        importMode: 'sync'
      }),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          VueRouterAutoImports,
          {
            vuetify: ['useTheme', 'useRtl', 'useLocale', 'useDisplay', 'useLayout']
          }
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        },
        vueTemplate: true
      }),
      Components({
        dts: 'src/components.d.ts',
        resolvers: [
          IconsResolver({
            prefix: 'i-',
            alias: {
              md: 'material-design-icons-iconfont'
            }
          })
        ]
      }),
      Vue({
        include: ['**/*.vue', '*.vue'],
        template: { transformAssetUrls },
        features: {
          propsDestructure: true
        }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss'
        }
      }),
      Fonts({
        // google: {
        //   families: [
        //     {
        //       name: 'Roboto',
        //       styles: 'wght@100;300;400;500;700;900'
        //     }
        //   ]
        // }
        // Custom fonts.
        // custom: {
        //   /**
        //    * Fonts families lists
        //    */
        //   families: [
        //     {
        //       /**
        //        * Name of the font family.
        //        */
        //       name: 'Roboto',
        //       /**
        //        * Local name of the font. Used to add `src: local()` to `@font-rule`.
        //        */
        //       local: 'Roboto',
        //       /**
        //        * Regex(es) of font files to import. The names of the files will
        //        * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
        //        */
        //       src: './src/assets/fonts/*.ttf',
        //       /**
        //        * This function allow you to transform the font object before it is used
        //        * to generate the `@font-rule` and head tags.
        //        */
        //       transform(font) {
        //         if (font.basename === 'Roboto-Bold') {
        //           // update the font weight
        //           font.weight = 700;
        //         }
        //         // we can also return null to skip the font
        //         return font;
        //       }
        //     }
        //   ],
        //   /**
        //    * Defines the default `font-display` value used for the generated
        //    * `@font-rule` classes.
        //    */
        //   display: 'auto',
        //   /**
        //    * Using `<link rel="preload">` will trigger a request for the WebFont
        //    * early in the critical rendering path, without having to wait for the
        //    * CSSOM to be created.
        //    */
        //   preload: true,
        //   /**
        //    * Using `<link rel="prefetch">` is intended for prefetching resources
        //    * that will be used in the next navigation/page load
        //    * (e.g. when you go to the next page)
        //    *
        //    * Note: this can not be used with `preload`
        //    */
        //   prefetch: false,
        //   /**
        //    * define where the font load tags should be inserted
        //    * default: 'head-prepend'
        //    *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
        //    */
        //   injectTo: 'head-prepend'
        // }
      }),
      compression(),
      esToolkitPlugin(),
      Icons({
        compiler: 'vue3',
        autoInstall: true
      }),
      UnoCSS()
    ],
    base: '/',
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@iconify/json': fileURLToPath(new URL('./node_modules/@iconify/json/json', import.meta.url))
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
    // esbuild: {
    //   pure: ['console.log'], // 删除 console.log
    //   drop: ['debugger'] // 删除 debugger
    // },
    /// 构建选项
    build: {
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vuetify: ['vuetify'],
            utils: ['lodash-es']
          }
        }
      }
    }
  };
});
