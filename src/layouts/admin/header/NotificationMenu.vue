<!-- 通用通知菜单组件 -->
<template>
  <!-- Vuetify菜单组件，最小宽度260px，使用滑动过渡动画 -->
  <v-menu min-width="260" transition="slide-y-transition">
    <!-- 激活器插槽，用于定义点击打开菜单的按钮 -->
    <template #activator="{ props }">
      <!-- 无文本按钮，绑定菜单的激活器属性 -->
      <v-btn class="text-none" v-bind="props">
        <!-- 带徽章的图标，红色圆点带边框，徽章内容为items数组长度 -->
        <v-badge color="error" dot bordered :content="items.length">
          <!-- 动态图标，通过props传入 -->
          <v-icon>{{ icon }}</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <!-- 菜单弹出卡片 -->
    <v-card>
      <!-- 列表组件，移除默认内边距 -->
      <v-list class="pa-0">
        <!-- 列表子标题，显示传入的title -->
        <v-list-subheader>{{ title }}</v-list-subheader>
        <!-- 分割线 -->
        <v-divider />
        <!-- 遍历通知项，每个项为一个列表项 -->
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>
            <!-- 文本截断容器 -->
            <div class="text-truncate">
              <!-- 标题加粗 -->
              <span class="font-weight-medium">{{ item.title }}</span>
              <!-- 如果有副标题，显示连接符和副标题，次要文字颜色 -->
              <span v-if="item.subtitle" class="caption text--secondary">&mdash; {{ item.subtitle }}</span>
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
// 定义通知项的数据结构
interface NotificationItem {
  title: string; // 通知标题
  subtitle?: string; // 可选副标题
}

// 定义组件属性：图标名、标题、通知项数组
defineProps<{
  icon: string; // 按钮图标（如 mdi-email-outline）
  title: string; // 菜单标题（如“消息中心”）
  items: NotificationItem[]; // 通知列表数据
}>();
</script>
