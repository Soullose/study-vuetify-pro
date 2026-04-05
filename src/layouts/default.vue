<template>
  <!-- 顶部导航栏 -->
  <v-app-bar flat border density="comfortable">
    <v-app-bar-title class="text-h6 font-weight-bold">
      <router-link to="/dashboard" class="text-decoration-none text-primary">W3 Admin</router-link>
    </v-app-bar-title>

    <v-spacer />

    <!-- 用户菜单 -->
    <UserMenu />
  </v-app-bar>

  <!-- 主内容区 -->
  <v-main>
    <router-view />
  </v-main>

  <!-- 页脚 -->
  <AppFooter />
</template>

<script lang="ts" setup>
/**
 * @description 默认布局 - 简单的顶部导航 + 内容区 + 页脚
 * @note 不包含 <v-app>，由 App.vue 统一提供
 */
import UserMenu from '@/components/common/UserMenu/index.vue';
</script>
