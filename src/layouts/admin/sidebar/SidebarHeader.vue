<!-- 侧边栏头部用户信息组件 -->
<template>
  <!-- 列表容器，baseColor=on-sidebar-bg确保用户信息文字颜色跟随主题 -->
  <v-list density="default" base-color="on-sidebar-bg">
    <!-- 紧凑型列表项，显示用户头像、副标题、标题，并预留append插槽用于额外操作 -->
    <v-list-item slim :prepend-avatar="avatar" :subtitle="subtitle" :title="title">
      <!-- 附加内容插槽，可用于放置折叠按钮等 -->
      <template #append>
        <slot name="append" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
// 定义组件属性：头像URL、标题、副标题（均为可选）
defineProps<{
  avatar?: string; // 用户头像图片地址
  title?: string; // 用户姓名
  subtitle?: string; // 用户邮箱或角色
}>();
</script>
