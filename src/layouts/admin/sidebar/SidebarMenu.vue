<!-- 侧边栏菜单渲染组件 -->
<template>
  <!-- 导航列表，紧凑密度，单行，无缩进 -->
  <v-list color="primary" nav slim density="compact" lines="one" indent="0">
    <!-- 遍历菜单store中的adminMenus数组，每个菜单项有唯一的name作为key -->
    <template v-for="item in menuStore.adminMenus" :key="item.name">
      <!-- 有子菜单：渲染分组组件SidebarMenuGroup -->
      <SidebarMenuGroup v-if="item.children && item.children.length > 0" :prepend-icon="item.icon" :title="item.title">
        <!-- 分组内遍历子菜单，渲染每个子菜单项SidebarMenuItem -->
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

      <!-- 无子菜单：直接渲染单级菜单项SidebarMenuItem -->
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
import { useMenuStore } from '@/stores/menu'; // 导入菜单store
import SidebarMenuItem from './SidebarMenuItem.vue'; // 导入菜单项组件
import SidebarMenuGroup from './SidebarMenuGroup.vue'; // 导入菜单分组组件

const menuStore = useMenuStore(); // 获取菜单store实例，adminMenus为菜单树数据
</script>
