import presetIcons from '@unocss/preset-icons';
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
    })
  ]
});
