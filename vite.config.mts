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
import { viteMockServe } from 'vite-plugin-mock';
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
        /// 在配置文件中拓展路由 https://uvr.esm.is/guide/extending-routes
        /// 注意：如果页面组件中使用了 definePage 设置 meta，extendRoute 中不应覆盖已有值
        async extendRoute(route) {
          // 保留已有的 meta（来自 definePage 或 <route> 块），仅补充默认值
          const existingMeta = route.meta || {};

          // 根据路由路径特征确定默认布局
          let defaultLayout = 'home'; // 后台管理布局（默认）
          let defaultRequireAuth = true;

          if (route.path === '/login' || route.path === '/login/') {
            // 登录页使用空白布局
            defaultLayout = 'public';
            defaultRequireAuth = false;
          } else if (typeof route.name === 'string' && route.name.startsWith('/platform')) {
            // platform 目录下的页面使用空白布局（后续阶段将改为 portal 布局）
            defaultLayout = 'public';
            defaultRequireAuth = false;
          } else if (route.path === '/404' || route.path === '/403') {
            // 错误页面使用 home 布局
            defaultLayout = 'home';
            defaultRequireAuth = false;
          }

          // 合并 meta：已有值优先，缺失的使用默认值
          route.meta = {
            ...existingMeta,
            layout: existingMeta.layout || defaultLayout,
            title: existingMeta.title || '',
            requireAuth: existingMeta.requireAuth !== undefined ? existingMeta.requireAuth : defaultRequireAuth,
            keepAlive: existingMeta.keepAlive || false
          };
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
          },
          'vitest'
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
      UnoCSS(),
      // Mock 服务 - 仅在开发环境启用
      viteMockServe({
        mockPath: 'src/mock/modules',
        enable: command === 'serve',
        watchFiles: true,
        logger: true,
        cors: true
      })
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
            vue: ['vue'],
            pinia: ['pinia'],
            vuetify: ['vuetify'],
            'lodash-es': ['lodash-es'],
            'vue-router': ['vue-router'],
            'ag-grid-vue3': ['ag-grid-vue3'],
            'es-toolkit': ['es-toolkit'],
            'roboto-fontface': ['roboto-fontface']
          }
        }
      }
    },
    test: {
      include: ['test/**/*.test.ts']
    }
  };
});
