<!-- 单个菜单项组件 -->
<template>
  <!-- Vuetify列表项，color=primary选中态蓝色，baseColor=on-sidebar-bg默认态文字颜色 -->
  <v-list-item
    color="primary"
    base-color="on-sidebar-bg"
    :prepend-icon="prependIcon"
    :title="title"
    :subtitle="subtitle"
    :value="value"
    :to="to"
    :nav="nav"
    :link="!!to"
  >
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
