<template>
  <v-main class="public-layout-main">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
/**
 * @description 空白布局 - 用于登录、注册等无需侧边栏和导航的页面
 * @note 不包含 <v-app>，由 App.vue 统一提供
 */
</script>

<style scoped>
.public-layout-main {
  min-height: 100vh;
}
</style>
