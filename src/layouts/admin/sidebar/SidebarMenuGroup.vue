<!-- 菜单分组（带子菜单的组） -->
<template>
  <!-- Vuetify列表组，color=primary选中态蓝色，baseColor=on-sidebar-bg默认态文字颜色，流体宽度 -->
  <v-list-group color="primary" base-color="on-sidebar-bg" fluid>
    <!-- 激活器插槽：定义分组头部，绑定激活器属性，显示前置图标和标题 -->
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="prependIcon">
        <!-- 标题加粗 -->
        <v-list-item-title class="font-weight-bold">{{ title }}</v-list-item-title>
      </v-list-item>
    </template>
    <!-- 默认插槽：放置子菜单项 -->
    <slot />
  </v-list-group>
</template>

<script setup lang="ts">
// 定义组件属性：前置图标、分组标题
defineProps<{
  prependIcon?: string; // 分组图标（可选）
  title?: string; // 分组标题（可选）
}>();
</script>
