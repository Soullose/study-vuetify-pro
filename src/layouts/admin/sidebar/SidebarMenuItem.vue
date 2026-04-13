<!-- 单个菜单项组件 -->
<template>
  <!-- Vuetify列表项，支持图标、标题、副标题、值、路由跳转、导航模式、链接状态 -->
  <v-list-item color="background" :prepend-icon="prependIcon" :title="title" :subtitle="subtitle" :value="value" :to="to" :nav="nav" :link="!!to">
    <!-- 默认插槽，用于自定义内容 -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <!-- 前置插槽，用于自定义前置区域 -->
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
// 定义菜单项属性
defineProps<{
  prependIcon?: string; // 前置图标
  title?: string; // 主标题
  subtitle?: string; // 副标题
  value?: string; // 项的值（用于选中状态）
  to?: string; // 路由跳转路径
  nav?: boolean; // 是否为导航模式（影响激活样式）
}>();
</script>
