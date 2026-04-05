<template>
  <v-list nav slim density="compact" lines="one" indent="0">
    <!-- 单级菜单项 -->
    <SidebarMenuItem prepend-icon="mdi-home" title="Home" value="Home" to="/" />
    <SidebarMenuItem prepend-icon="mdi-folder" title="My Files" value="myfiles" />

    <!-- 分组菜单 -->
    <SidebarMenuGroup prepend-icon="mdi-account-circle" title="测试">
      <SidebarMenuItem prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/dashboard" nav />
      <SidebarMenuItem prepend-icon="mdi-home" title="Home" value="Home2" to="/" />
      <SidebarMenuItem prepend-icon="mdi-image" title="Icon选择器" subtitle="Icon选择器" value="Icon" to="/icon" />
      <SidebarMenuItem prepend-icon="mdi-plus" title="Test123111" subtitle="xxxxxx" value="Test" to="/test" />
    </SidebarMenuGroup>

    <!-- 更多单级菜单项 -->
    <SidebarMenuItem prepend-icon="mdi-account-multiple" title="Shared with me" value="shared" />
    <SidebarMenuItem prepend-icon="mdi-star" title="Starred" value="starred" />
  </v-list>
</template>

<script setup lang="ts">
import SidebarMenuItem from './SidebarMenuItem.vue';
import SidebarMenuGroup from './SidebarMenuGroup.vue';
</script>
