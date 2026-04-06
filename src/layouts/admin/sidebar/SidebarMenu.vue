<template>
  <v-list nav slim density="compact" lines="one" indent="0">
    <template v-for="item in menuStore.adminMenus" :key="item.name">
      <!-- 有子菜单：渲染分组 -->
      <SidebarMenuGroup v-if="item.children && item.children.length > 0" :prepend-icon="item.icon" :title="item.title">
        <SidebarMenuItem
          v-for="child in item.children"
          :key="child.name"
          :prepend-icon="child.icon"
          :title="child.title"
          :value="child.name"
          :to="child.path"
          nav
        />
      </SidebarMenuGroup>

      <!-- 无子菜单：渲染单级菜单项 -->
      <SidebarMenuItem v-else :prepend-icon="item.icon" :title="item.title" :value="item.name" :to="item.path" nav />
    </template>
  </v-list>
</template>

<script setup lang="ts">
/**
 * @description 侧边栏菜单 - 从菜单 Store 动态渲染菜单项
 * @author Architecture Team
 * @date 2026-04-05
 */
import { useMenuStore } from '@/stores/menu';
import SidebarMenuItem from './SidebarMenuItem.vue';
import SidebarMenuGroup from './SidebarMenuGroup.vue';

const menuStore = useMenuStore();
</script>
