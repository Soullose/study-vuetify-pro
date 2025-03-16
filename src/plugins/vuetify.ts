/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';

import { zhHans } from 'vuetify/locale';

// import 'unplugin-icons/'; // Iconify 图标样式

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'light'
  },
  locale: {
    locale: 'zhHans',
    messages: { zhHans }
  },
  icons: {
    aliases: {
      // // 自定义别名
      // search: 'mdi-magnify', // 使用默认 MDI 图标
      // home: 'icon-mdi:home', // 使用 Iconify 图标
      // user: 'icon-fa-solid:user' // 示例：FontAwesome 图标
    },
    sets: {
      // mdi: {
      //   component: 'i' // 默认 MDI 图标用 `i` 标签渲染
      // },
      // iconify: {
      //   component: (props) => {
      //     const { tag = 'span', icon, class: className, ...rest } = props;
      //     return h(tag, {
      //       ...rest,
      //       class: `${className} ${icon}`
      //     });
      //   }
      // }
    }
  }
});
