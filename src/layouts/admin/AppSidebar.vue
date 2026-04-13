侧边栏导航抽屉组件
<template>
  <!-- Vuetify导航抽屉，使用background色与头部/内容区统一，双向绑定显示状态和rail（折叠）状态，永久显示，移动端断点960px -->
  <v-navigation-drawer
    color="background"
    :expand-on-hover="rail"
    :model-value="modelValue"
    :rail="rail"
    permanent
    :mobile-breakpoint="960"
    @update:model-value="$emit('update:modelValue', $event)"
    @update:rail="$emit('update:rail', $event)"
  >
    <!-- 侧边栏头部：显示用户头像、姓名、邮箱，预留append插槽 -->
    <SidebarHeader avatar="https://randomuser.me/api/portraits/lego/1.jpg" title="Sandra Adams" subtitle="sandra_a88@gmailcom" />

    <!-- 分割线 -->
    <v-divider />

    <!-- 侧边栏菜单：动态渲染菜单项 -->
    <SidebarMenu />

    <!-- 附加区域（底部）：放置侧边栏底部组件（设置） -->
    <template #append>
      <SidebarFooter />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import SidebarHeader from './sidebar/SidebarHeader.vue'; // 侧边栏头部组件
import SidebarMenu from './sidebar/SidebarMenu.vue'; // 侧边栏菜单组件
import SidebarFooter from './sidebar/SidebarFooter.vue'; // 侧边栏底部组件

// 定义父组件传入的属性：抽屉是否可见、是否为rail（迷你模式）
defineProps<{
  modelValue: boolean; // 控制抽屉打开/关闭
  rail: boolean; // 控制抽屉是否折叠为窄栏
  expandOnHover: boolean; // 可选属性，是否在鼠标悬停时展开（默认为false）
}>();

// 定义事件：更新显示状态、更新rail状态，供父组件v-model双向绑定
defineEmits<{
  'update:modelValue': [value: boolean];
  'update:rail': [value: boolean];
}>();
</script>
