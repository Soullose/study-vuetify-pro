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
        使用 keep-alive 缓存已访问的页面组件，:include 绑定 tagsViewStore 的缓存列表。
        transition 包裹 keep-alive，确保过渡动画正常。
      -->
      <AppMain>
        <!-- 多页签栏：通过 settings.showTagsView 控制显隐 -->
        <TagsView v-if="settingsStore.layout.showTagsView" />

        <router-view v-slot="{ Component, route }">
          <v-slide-x-transition mode="out-in">
            <keep-alive :include="[...tagsViewStore.cachedViews]">
              <component :is="Component" :key="route.path + refreshSuffix" />
            </keep-alive>
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
import { useTagsViewStore } from '@/stores/tagsView'; // 多页签状态store
import AppSidebar from './admin/AppSidebar.vue'; // 侧边栏组件
import AppHeader from './admin/AppHeader.vue'; // 头部组件
import AppMain from './admin/AppMain.vue'; // 主内容容器
import AppFooter from './admin/AppFooter.vue'; // 页脚组件
import TagsView from '@/components/common/TagsView/index.vue'; // 多页签组件

const theme = useThemeStore(); // 获取主题store，管理rail（侧边栏折叠）状态
const settingsStore = useSettingsStore(); // 获取设置store，管理页签栏显隐等配置
const tagsViewStore = useTagsViewStore(); // 获取多页签store，管理页签数据和缓存列表
const { mobile: _mobile } = useDisplay(); // 获取移动端标志（本例未使用，保留以备后续响应式）

// 侧边栏显示状态（可见/隐藏），默认true
const drawerVisible = ref(true);

// ==================== 页签刷新机制 ====================

/** 刷新后缀，改变此值可强制 keep-alive 中的组件重建 */
const refreshSuffix = ref('');

/**
 * 刷新指定标签页
 * 通过改变 component 的 key 值强制组件销毁重建
 *
 * @param tag - 需要刷新的标签对象
 */
function refreshPage(tag: { name: string }): void {
  // 先从 keep-alive 缓存中移除
  tagsViewStore.refreshView(tag as import('@/stores/tagsView').TagView);
  // 改变 key 后缀触发组件重建
  refreshSuffix.value = `__refresh__${Date.now()}`;
  // 下一帧恢复，避免影响后续导航
  nextTick(() => {
    refreshSuffix.value = '';
  });
}

// 通过 provide 向 TagsView 组件注入刷新方法
provide('refreshPage', refreshPage);

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
