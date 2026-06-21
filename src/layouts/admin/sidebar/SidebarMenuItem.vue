<!--
  单个菜单项组件（递归）

  支持任意层级嵌套：
  - 当 item.children 非空时，渲染 v-list-group，并在内部对每个子节点递归引用本组件；
  - 当无 children 时，渲染叶子 v-list-item。

  通过组件 name 自引用实现递归（<SidebarMenuItem>）。
-->
<template>
  <!-- 有子菜单：渲染为可折叠分组，递归渲染子节点 -->
  <v-list-group v-if="hasChildren" :value="item.path">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="item.icon">
        <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </template>

    <!-- 递归渲染每个子菜单项 -->
    <SidebarMenuItem
      v-for="child in item.children"
      :key="child.path || child.id"
      :item="child"
    />
  </v-list-group>

  <!-- 叶子节点：渲染可跳转的列表项 -->
  <v-list-item
    v-else
    color="primary"
    base-color="on-sidebar-bg"
    :prepend-icon="item.icon"
    :title="item.title"
    :value="item.path"
    :to="item.link ? undefined : item.path"
    :href="item.link"
    :target="item.link ? '_blank' : undefined"
    nav
    link
  />
</template>

<script setup lang="ts">
/**
 * @description 侧边栏菜单项（支持递归渲染多级菜单）
 */
import type { MenuItem } from '@/api/modules/permission';

defineOptions({ name: 'SidebarMenuItem' });

const props = defineProps<{
  /** 菜单节点（完整数据，含 children） */
  item: MenuItem;
}>();

// 是否有子菜单（空数组也视为无子菜单）
const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0);
</script>
