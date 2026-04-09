<!-- 后台管理主布局组件 -->
<template>
  <!-- 全高度弹性盒子布局，垂直方向填充 -->
  <div class="fill-height d-flex">
    <!-- 侧边栏组件，v-model绑定drawerVisible，:rail绑定theme.rail，监听更新事件 -->
    <AppSidebar v-model="drawerVisible" :expand-on-hover="theme.rail" :rail="theme.asideMenuFolded" @update:rail="theme.setRail" />

    <!-- 右侧内容区域：头部 + 主内容 + 页脚 -->
    <div class="d-flex flex-column flex-grow-1" style="min-width: 0">
      <!-- 头部组件，监听toggle-sidebar事件以切换侧边栏折叠（通过theme.toggleAsideMenuFolded） -->
      <AppHeader @toggle-sidebar="theme.toggleAsideMenuFolded" />

      <!--
        AppMain 内部使用 <slot/> 渲染下方内容。
        v-app-bar 默认 fixed 定位，v-main 会自动为其预留 padding-top，
        因此 TagsView 必须放在 AppMain（v-main）内部，才能在 app bar 下方正确显示。
        使用 v-slide-x-transition 实现页面切换水平滑动过渡动画。
        不使用 keep-alive，避免与 Vuetify transition 组件不兼容导致页面空白。
      -->
      <AppMain>
        <!-- 多页签栏：通过 settings.showTagsView 控制显隐 -->
        <TagsView v-if="settingsStore.layout.showTagsView" />

        <!--
          使用 Vuetify v-slide-x-transition 实现水平滑动过渡。
          mode="out-in"：旧组件滑出完成后再滑入新组件，避免两个组件同时显示。
          不使用 keep-alive，组件每次切换都会重新创建。
        -->
        <router-view v-slot="{ Component, route }">
          <v-slide-x-transition mode="out-in">
            <component :is="Component" :key="route.path" />
          </v-slide-x-transition>
        </router-view>
      </AppMain>

      <!-- 全局页脚 -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @description 后台管理布局 - 侧边栏 + 顶部导航 + 多页签 + 内容区 + 页脚
 * @note 不包含 <v-app>，由 App.vue 统一提供
 */
import { useDisplay } from 'vuetify'; // Vuetify响应式显示工具
import { useThemeStore } from '@/stores/framework/theme'; // 主题/布局状态store
import { useSettingsStore } from '@/stores/settings'; // 设置状态store
import AppSidebar from './admin/AppSidebar.vue'; // 侧边栏组件
import AppHeader from './admin/AppHeader.vue'; // 头部组件
import AppMain from './admin/AppMain.vue'; // 主内容容器
import AppFooter from './admin/AppFooter.vue'; // 页脚组件
import TagsView from '@/components/common/TagsView/index.vue'; // 多页签组件

const theme = useThemeStore(); // 获取主题store，管理rail（侧边栏折叠）状态
const settingsStore = useSettingsStore(); // 获取设置store，管理页签栏显隐等配置
const { mobile: _mobile } = useDisplay(); // 获取移动端标志（本例未使用，保留以备后续响应式）

// 侧边栏显示状态（可见/隐藏），默认true
const drawerVisible = ref(true);

// 消息类型定义（用于provide传递数据给AppHeader）
interface MessageItem {
  title: string;
  subtitle: string;
}

// 消息列表（实际应由业务逻辑填充，此处为空数组）
const messages = ref<MessageItem[]>([]);
// 通知列表
const notifications = ref<MessageItem[]>([]);

// 计算属性：将消息列表转换为通知菜单所需的格式（目前只是映射，保持结构一致）
const messageItems = computed(() =>
  messages.value.map((item) => ({
    title: item.title,
    subtitle: item.subtitle
  }))
);

// 计算属性：将通知列表转换为通知菜单所需的格式
const notificationItems = computed(() =>
  notifications.value.map((item) => ({
    title: item.title,
    subtitle: item.subtitle
  }))
);

// 通过provide向下传递消息和通知数据，供AppHeader及其子组件（NotificationMenu）使用
provide('messages', messageItems);
provide('notifications', notificationItems);
</script>

<style lang="scss" scoped>
// 引入测试样式文件（用于布局调试或自定义样式）
@use '@/styles/test';
</style>
