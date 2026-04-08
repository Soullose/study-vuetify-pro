<!-- 头部Logo组件 -->
<template>
  <!-- 可点击的链接，返回到首页，移除默认下划线样式，左侧内边距和左边距 -->
  <a class="d-flex ps-2 ml-3" style="text-decoration: none" href="/">
    <!-- 响应式容器，宽度固定128px，最大宽度128px -->
    <v-responsive style="width: 128px" max-width="128">
      <!-- Vuetify图片组件，展示Logo图片（浅色主题的Vuetify Logo） -->
      <v-img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify-logo-light.png" />
    </v-responsive>
  </a>
</template>

<script setup lang="ts">
// 该组件无额外脚本逻辑，仅作为纯展示组件，用于在头部显示Logo并链接到首页
</script>
