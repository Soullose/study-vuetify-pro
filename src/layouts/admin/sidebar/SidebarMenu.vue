<!-- 侧边栏菜单渲染组件 -->
<template>
  <!--
    导航列表：color=primary 控制选中态，base-color=on-sidebar-bg 控制默认文字颜色。
    数据源为 permissionStore.menus（后端按角色返回的菜单树），实现菜单级权限隔离。
  -->
  <v-list v-if="menus.length" color="primary" base-color="on-sidebar-bg" nav slim density="compact" lines="one" indent="0">
    <!-- 遍历菜单树根节点，递归渲染交给 SidebarMenuItem -->
    <SidebarMenuItem
      v-for="item in menus"
      :key="item.path || item.id"
      :item="item"
    />
  </v-list>

  <!-- 菜单为空时的占位（如权限加载失败或用户无任何可见菜单） -->
  <div v-else class="text-center text-medium-emphasis pa-4 text-body-2">
    暂无可用菜单
  </div>
</template>

<script setup lang="ts">
/**
 * @description 侧边栏菜单 - 以后端菜单树为唯一数据源，按角色做菜单级权限隔离
 *
 * 数据流：后端 getUserMenus() → permissionStore.menus（buildMenuTree 转树形）→ 本组件渲染
 * 路由仍由 ModuleRegistry 静态注册，此处仅决定「显示哪些菜单项」。
 */
import { computed } from 'vue';
import { usePermissionStore } from '@/stores/permission';
import SidebarMenuItem from './SidebarMenuItem.vue';

const permissionStore = usePermissionStore();

// 菜单树（后端按角色返回，已转为树形结构）
const menus = computed(() => permissionStore.menus);
</script>
