<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// 公共布局 - 用于登录、注册等无需侧边栏的页面
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}
</style>
