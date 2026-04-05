<template>
  <v-app-bar color="background" elevation="2" border="b" density="comfortable">
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="$emit('toggle-sidebar')" />
      <HeaderLogo />
    </template>

    <template #append>
      <NotificationMenu icon="mdi-email-outline" title="消息中心" :items="messages" />
      <NotificationMenu icon="mdi-bell-outline" title="系统通知" :items="notifications" />
      <UserMenu />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import HeaderLogo from './header/HeaderLogo.vue';
import NotificationMenu from './header/NotificationMenu.vue';
import UserMenu from '@/components/common/UserMenu/index.vue';

defineEmits<{
  'toggle-sidebar': [];
}>();

interface NotificationItem {
  title: string;
  subtitle?: string;
}

const messages = ref<NotificationItem[]>([]);
const notifications = ref<NotificationItem[]>([]);
</script>
