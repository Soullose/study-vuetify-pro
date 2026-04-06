/**
 * main.ts
 *
 * 应用入口文件 - 初始化 Vuetify、路由、状态管理等插件并挂载应用
 * @author Architecture Team
 * @date 2026-04-05
 */

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import 'virtual:uno.css';
import { createApp } from 'vue';

const app = createApp(App);

/**
 * 开发环境下过滤 Vuetify 已知的 Vue 警告
 *
 * Vuetify 3 的 overlay 组件（v-menu、v-tooltip、v-dialog 等）在内部
 * 测量定位时会在渲染周期外调用插槽内容，触发 "Slot invoked outside
 * of the render function" 警告。这是 Vuetify 框架的已知行为，
 * 不影响功能正确性，此处统一过滤以保持控制台整洁。
 */
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, _instance, _trace) => {
    // 过滤 Vuetify overlay 组件的已知插槽警告
    if (typeof msg === 'string' && msg.includes('invoked outside of the render function')) {
      return;
    }
    // 其他警告正常输出到控制台
    console.warn(`[Vue warn]: ${msg}`);
  };
}

registerPlugins(app);

app.mount('#app');
