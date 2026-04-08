<!-- 全局头部组件 -->
<template>
  <!-- Vuetify应用栏，背景色为background，带阴影，底部边框，舒适密度 -->
  <v-app-bar color="background" elevation="2" border="b" density="comfortable">
    <!-- 前置区域插槽：包含导航菜单图标和Logo -->
    <template #prepend>
      <!-- 点击触发toggle-sidebar事件，用于侧边栏折叠 -->
      <v-app-bar-nav-icon @click.stop="$emit('toggle-sidebar')" />
      <HeaderLogo />
    </template>

    <!-- 后置区域插槽：包含两个通知菜单和用户菜单 -->
    <template #append>
      <!-- 消息中心菜单，使用邮件图标 -->
      <NotificationMenu icon="mdi-email-outline" title="消息中心" :items="messages" />
      <!-- 系统通知菜单，使用铃铛图标 -->
      <NotificationMenu icon="mdi-bell-outline" title="系统通知" :items="notifications" />
      <UserMenu />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import HeaderLogo from './header/HeaderLogo.vue'; // 导入头部Logo组件
import NotificationMenu from './header/NotificationMenu.vue'; // 导入通知菜单组件
import UserMenu from '@/components/common/UserMenu/index.vue'; // 导入用户菜单组件

// 定义组件可触发的事件：切换侧边栏
defineEmits<{
  'toggle-sidebar': [];
}>();

// 定义通知项数据结构
interface NotificationItem {
  title: string;
  subtitle?: string;
}

// 消息列表（实际数据应由父组件通过provide/inject或props传递，此处为空数组占位）
const messages = ref<NotificationItem[]>([]);
// 通知列表
const notifications = ref<NotificationItem[]>([]);
</script>
