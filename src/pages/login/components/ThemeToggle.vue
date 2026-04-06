<!--
  @description 登录页面主题切换按钮组件
  @author Architecture Team
  @date 2026-04-06
  支持亮色/暗黑/系统三种模式循环切换，带 Tooltip 提示和过渡动画
-->
<template>
  <v-tooltip :text="tooltipText" location="bottom">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :icon="themeIcon"
        variant="text"
        size="small"
        class="theme-toggle-btn"
        @click="handleToggle"
      />
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
/**
 * @description 登录页面主题切换按钮组件
 * 使用 useSettingsStore 管理主题状态，支持 light/dark/system 三种模式
 * @example <ThemeToggle />
 */
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

/** 当前主题模式对应的图标 */
const themeIcon = computed(() => {
  switch (settingsStore.themeMode) {
    case 'light':
      return 'mdi-weather-sunny';
    case 'dark':
      return 'mdi-weather-night';
    case 'system':
      return 'mdi-monitor';
    default:
      return 'mdi-weather-sunny';
  }
});

/** 当前主题模式的 Tooltip 提示文本 */
const tooltipText = computed(() => {
  switch (settingsStore.themeMode) {
    case 'light':
      return '亮色模式（点击切换）';
    case 'dark':
      return '暗黑模式（点击切换）';
    case 'system':
      return '跟随系统（点击切换）';
    default:
      return '切换主题';
  }
});

/**
 * 切换主题模式
 * 循环切换：light → dark → system → light
 */
function handleToggle(): void {
  settingsStore.toggleTheme();
}
</script>

<style scoped>
.theme-toggle-btn {
  transition: transform 0.3s ease, color 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(30deg);
}
</style>
