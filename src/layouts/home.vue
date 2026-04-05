<template>
  <div class="fill-height d-flex">
    <AppSidebar v-model="drawerVisible" :rail="theme.getRail" @update:rail="theme.setRail" />

    <AppHeader @toggle-sidebar="theme.toggleAsideMenuFolded" />

    <!--
      AppMain 内部使用 <slot/> 渲染下方内容，
      <router-view> 是唯一的页面渲染出口
    -->
    <AppMain>
      <router-view v-slot="{ Component, route }">
        <v-slide-x-transition mode="out-in">
          <component :is="Component" :key="route.path" />
        </v-slide-x-transition>
      </router-view>
    </AppMain>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
/**
 * @description 后台管理布局 - 侧边栏 + 顶部导航 + 内容区 + 页脚
 * @note 不包含 <v-app>，由 App.vue 统一提供
 */
import { useDisplay } from 'vuetify';
import { themeStore } from '@/stores/framework/theme';
import AppSidebar from './home/AppSidebar.vue';
import AppHeader from './home/AppHeader.vue';
import AppMain from './home/AppMain.vue';
import AppFooter from './home/AppFooter.vue';

const theme = themeStore();
const { mobile: _mobile } = useDisplay();

// 侧边栏显示状态
const drawerVisible = ref(true);

// 消息类型定义
interface MessageItem {
  title: string;
  subtitle: string;
}

// 消息列表
const messages = ref<MessageItem[]>([]);
const notifications = ref<MessageItem[]>([]);

// 消息数据
const messageItems = computed(() =>
  messages.value.map((item) => ({
    title: item.title,
    subtitle: item.subtitle
  }))
);

// 通知数据
const notificationItems = computed(() =>
  notifications.value.map((item) => ({
    title: item.title,
    subtitle: item.subtitle
  }))
);

// 消息数据传递给 AppHeader
provide('messages', messageItems);
provide('notifications', notificationItems);
</script>

<style lang="scss" scoped>
@use '@/styles/test';
</style>
