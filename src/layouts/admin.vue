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
        路由出口启用 keep-alive 页面缓存（见下方注释，未使用 transition）。
      -->
      <AppMain>
        <!-- 多页签栏：通过 settings.showTagsView 控制显隐 -->
        <TagsView v-if="settingsStore.layout.showTagsView" />

        <!--
          路由出口 + keep-alive 缓存。

          keep-alive 的 include 按「组件 name」匹配，取自 tagsViewStore.cachedViews
          （其中只含 meta.keepAlive === true 的路由 name）。被缓存的页面在页签切换时
          保留组件状态（列表筛选、表单草稿、滚动位置等）。

          缓存前提：被缓存页面的组件须通过 defineOptions({ name }) 显式设置与路由
          name 一致的组件名（见 src/pages/dashboard、system/user 等页面）。

          过渡动画：保留 v-slide-x-transition。若实测出现「切换空白」竞态，
          备选方案是移除 transition（保 keep-alive，牺牲动画换状态保留）。
        -->
        <router-view v-slot="{ Component, route }">
          <!--
            页面缓存：keep-alive 的 include 按「组件 name」匹配 cachedViews
            （只含 meta.keepAlive === true 的路由 name），被缓存页面切换时保留状态。

            为何不再使用 v-slide-x-transition：
            Vuetify 的 transition 组件要求直接子节点是带真实 DOM 的元素，而 keep-alive
            是不渲染 DOM 的抽象组件。两者嵌套时 transition 拿不到可过渡的 DOM，
            会导致页面空白。因此按「状态保留优先于切换动画」的取舍，移除 transition。

            key 拼接 refreshKey：triggerRefresh() 递增 refreshKey → key 变化 →
            Vue 销毁旧实例并重建，实现页面刷新（替代原 redirect 中转页机制）。
          -->
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="`${route.path}-${tagsViewStore.refreshKey}`" />
          </keep-alive>
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
import { useTagsViewStore } from '@/stores/tagsView'; // 多页签状态store

const theme = useThemeStore(); // 获取主题store，管理rail（侧边栏折叠）状态
const settingsStore = useSettingsStore(); // 获取设置store，管理页签栏显隐等配置
const tagsViewStore = useTagsViewStore(); // 获取多页签store，用于读取 refreshKey 实现页面刷新
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

