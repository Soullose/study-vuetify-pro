/**
 * @description 主题布局状态管理 - 控制侧边栏折叠、Rail 模式
 * @author Architecture Team
 * @date 2026-04-05
 */

import { defineStore } from 'pinia';

/**
 * 侧边栏布局 Store（Composition API）
 */
export const useThemeStore = defineStore('theme', () => {
  /** 侧边栏是否折叠 */
  const asideMenuFolded = ref<boolean>(false);

  /** 是否使用 Rail 模式（迷你侧边栏） */
  const rail = ref<boolean>(false);

  /** 切换侧边栏折叠状态 */
  function toggleAsideMenuFolded(): void {
    asideMenuFolded.value = !asideMenuFolded.value;
  }

  /** 设置 rail 模式 */
  function setRail(value: boolean): void {
    rail.value = value;
  }

  return {
    asideMenuFolded,
    rail,
    toggleAsideMenuFolded,
    setRail
  };
});
