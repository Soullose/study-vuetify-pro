<template>
  <!-- 门户网站布局 - 顶部导航 + 内容区 + 页脚 -->
  <v-app-bar flat border density="comfortable" color="white">
    <v-app-bar-title class="text-h6 font-weight-bold">
      <router-link to="/platform/portal" class="text-decoration-none text-primary">Portal</router-link>
    </v-app-bar-title>

    <v-spacer />

    <!-- 门户导航菜单 -->
    <v-btn variant="text" to="/platform/portal">首页</v-btn>
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
 * @description 门户网站布局 - 顶部导航栏 + 内容区 + 页脚
 * @note 不包含 <v-app>，由 App.vue 统一提供
 */
import AppFooter from '@/components/AppFooter.vue';
</script>
