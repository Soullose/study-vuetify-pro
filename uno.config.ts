import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
// import presetIcons from '@unocss/preset-icons/browser';
import presetWebFonts from '@unocss/preset-web-fonts';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import { defineConfig, presetUno } from 'unocss';

const iconSets = ['carbon', 'mdi', 'fa'] as const;

const safelist: any = [...iconSets.flatMap((iconSet) => [`i-${iconSet}:*`, new RegExp(`^i-${iconSet}:.*`)])];
export default defineConfig({
  content: {
    pipeline: {
      include: [
        // 默认
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // 包括 js/ts 文件
        'src/**/*.{js,ts}'
      ]
      // 排除文件
      // exclude: []
    }
  },
  presets: [
    presetUno({}), // 添加 UnoCSS 的默认样式预设
    presetAttributify({
      /* preset options */
    }),
    presetIcons({
      scale: 1.2,
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
        // ...
      },
      autoInstall: true,
      collections: {
        carbon: () => import('@iconify/json/json/carbon.json').then((i) => i.default),
        mdi: () => import('@iconify/json/json/mdi.json').then((i) => i.default),
        fa: () => import('@iconify/json/json/fa.json').then((i) => i.default)
        // logos: () => import('@iconify/json/json/logos.json').then((i) => i.default)
      }
    }),
    presetWebFonts({
      /* options */
      provider: 'google', // default provider
      fonts: {
        // these will extend the default theme
        sans: 'Roboto',
        mono: ['Fira Code', 'Fira Mono:400,700'],
        // custom ones
        lobster: 'Lobster',
        lato: [
          {
            name: 'Lato',
            weights: ['400', '700'],
            italic: true
          },
          {
            name: 'sans-serif',
            provider: 'none'
          }
        ]
      },
      processors: createLocalFontProcessor({
        // Directory to cache the fonts
        cacheDir: 'node_modules/.cache/unocss/fonts',

        // Directory to save the fonts assets
        fontAssetsDir: 'public/assets/fonts',

        // Base URL to serve the fonts from the client
        fontServeBaseUrl: '/assets/fonts'
      })
    })
  ],
  safelist: [['carbon', 'mdi', 'fa'].map((iconSet) => `i-${iconSet}:*`) as any]
});
