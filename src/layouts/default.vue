<template>
  <v-app>
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
  </v-app>
</template>

<script lang="ts" setup>
import UserMenu from '@/components/common/UserMenu/index.vue';
</script>
