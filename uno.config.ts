import presetIcons from '@unocss/preset-icons';
import presetWebFonts from '@unocss/preset-web-fonts';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import { defineConfig, presetUno } from 'unocss';
export default defineConfig({
  presets: [
    presetUno({}), // 添加 UnoCSS 的默认样式预设
    presetIcons({
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
  ]
});
