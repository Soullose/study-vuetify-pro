import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useTheme } from 'vuetify';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 主题颜色配置
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  error: string;
}

/**
 * 布局设置
 */
export interface LayoutSettings {
  /** 侧边栏折叠 */
  sidebarCollapsed: boolean;
  /** 侧边栏 Rail 模式 */
  sidebarRail: boolean;
  /** 显示标签页 */
  showTagsView: boolean;
  /** 显示面包屑 */
  showBreadcrumb: boolean;
  /** 显示页脚 */
  showFooter: boolean;
  /** 固定头部 */
  fixedHeader: boolean;
}

/**
 * 设置状态
 */
export interface SettingsState {
  /** 主题模式 */
  themeMode: ThemeMode;
  /** 主题颜色 */
  themeColors: ThemeColors;
  /** 布局设置 */
  layout: LayoutSettings;
  /** 是否显示设置面板 */
  showSettingsPanel: boolean;
}

/**
 * 预设主题色
 */
export const PRESET_COLORS: ThemeColors[] = [
  { primary: '#1976D2', secondary: '#FF965D', success: '#28C76F', info: '#00CFE8', warning: '#FF9F43', error: '#EA5455' },
  { primary: '#7367F0', secondary: '#8A8D93', success: '#28C76F', info: '#00CFE8', warning: '#FF9F43', error: '#EA5455' },
  { primary: '#00A6E0', secondary: '#FF965D', success: '#28C76F', info: '#00CFE8', warning: '#FF9F43', error: '#EA5455' },
  { primary: '#FF6B6B', secondary: '#4ECDC4', success: '#28C76F', info: '#00CFE8', warning: '#FF9F43', error: '#EA5455' },
  { primary: '#2D3436', secondary: '#636E72', success: '#28C76F', info: '#00CFE8', warning: '#FF9F43', error: '#EA5455' }
];

// 存储键
const STORAGE_KEY = 'app_settings';

// 默认设置
const defaultSettings: SettingsState = {
  themeMode: 'light',
  themeColors: PRESET_COLORS[0],
  layout: {
    sidebarCollapsed: false,
    sidebarRail: false,
    showTagsView: true,
    showBreadcrumb: true,
    showFooter: true,
    fixedHeader: true
  },
  showSettingsPanel: false
};

export const useSettingsStore = defineStore('settings', () => {
  // ==================== Vuetify Theme Instance ====================
  // 在 setup 上下文中获取 Vuetify 主题实例并缓存
  // useTheme() 内部使用 inject()，必须在组件 setup 阶段调用
  // 缓存后可在事件回调、watch 等非 setup 上下文中安全使用
  const vuetifyTheme = useTheme();

  // ==================== State ====================

  /** 从本地存储加载设置，并执行旧版本颜色迁移 */
  const loadSettings = (): SettingsState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SettingsState;
        const result = { ...defaultSettings, ...parsed };
        // 迁移旧版本 primary 颜色：#007BFF / #6750A4 → #1976D2（Material Design 标准蓝）
        if (result.themeColors?.primary === '#007BFF' || result.themeColors?.primary === '#6750A4') {
          result.themeColors = { ...result.themeColors, primary: '#1976D2' };
        }
        return result;
      }
    } catch (e) {
      console.warn('加载设置失败:', e);
    }
    return defaultSettings;
  };

  /** 主题模式 */
  const themeMode = ref<ThemeMode>(loadSettings().themeMode);

  /** 主题颜色 */
  const themeColors = ref<ThemeColors>(loadSettings().themeColors);

  /** 布局设置 */
  const layout = ref<LayoutSettings>(loadSettings().layout);

  /** 设置面板显示状态 */
  const showSettingsPanel = ref(false);

  // ==================== Getters ====================

  /** 是否暗色模式 */
  const isDark = computed(() => {
    if (themeMode.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return themeMode.value === 'dark';
  });

  /** 当前主题名称 */
  const currentTheme = computed(() => (isDark.value ? 'dark' : 'light'));

  /** 获取布局设置 */
  const layoutSettings = computed(() => layout.value);

  // ==================== Actions ====================

  /**
   * 设置主题模式
   */
  function setThemeMode(mode: ThemeMode): void {
    themeMode.value = mode;
    applyTheme();
  }

  /**
   * 切换主题模式
   */
  function toggleTheme(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode.value);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  }

  /**
   * 设置主题颜色
   */
  function setThemeColors(colors: Partial<ThemeColors>): void {
    themeColors.value = { ...themeColors.value, ...colors };
    applyThemeColors();
  }

  /**
   * 使用预设主题
   */
  function usePresetTheme(preset: ThemeColors): void {
    themeColors.value = preset;
    applyThemeColors();
  }

  /**
   * 更新布局设置
   */
  function updateLayout(settings: Partial<LayoutSettings>): void {
    layout.value = { ...layout.value, ...settings };
  }

  /**
   * 切换侧边栏
   */
  function toggleSidebar(): void {
    layout.value.sidebarRail = !layout.value.sidebarRail;
  }

  /**
   * 打开设置面板
   */
  function openSettingsPanel(): void {
    showSettingsPanel.value = true;
  }

  /**
   * 关闭设置面板
   */
  function closeSettingsPanel(): void {
    showSettingsPanel.value = false;
  }

  /**
   * 重置设置
   */
  function resetSettings(): void {
    themeMode.value = defaultSettings.themeMode;
    themeColors.value = defaultSettings.themeColors;
    layout.value = defaultSettings.layout;
    applyTheme();
    applyThemeColors();
  }

  // ==================== Helper Functions ====================

  /**
   * 应用主题
   * 使用缓存的 vuetifyTheme 实例切换 Vuetify 主题
   */
  function applyTheme(): void {
    vuetifyTheme.change(currentTheme.value);

    // 更新 HTML class（用于 CSS 变量）
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme.value);
  }

  /**
   * 应用主题颜色
   * 使用缓存的 vuetifyTheme 实例更新 light/dark 主题颜色
   */
  function applyThemeColors(): void {
    // 更新 light 主题（完整应用所有颜色）
    Object.entries(themeColors.value).forEach(([key, value]) => {
      vuetifyTheme.themes.value.light.colors[key] = value;
    });

    // 更新 dark 主题（排除 primary 和 on-primary，保持静态定义的中性色）
    Object.entries(themeColors.value).forEach(([key, value]) => {
      if (key === 'primary' || key === 'on-primary') return;
      vuetifyTheme.themes.value.dark.colors[key] = value;
    });
  }

  /**
   * 保存设置到本地存储
   */
  function saveSettings(): void {
    const settings: SettingsState = {
      themeMode: themeMode.value,
      themeColors: themeColors.value,
      layout: layout.value,
      showSettingsPanel: false
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (themeMode.value === 'system') {
      applyTheme();
    }
  });

  // 监听设置变化，自动保存
  watch([themeMode, themeColors, layout], saveSettings, { deep: true });

  // 初始化应用主题
  applyTheme();

  return {
    // State
    themeMode,
    themeColors,
    layout,
    showSettingsPanel,

    // Getters
    isDark,
    currentTheme,
    layoutSettings,

    // Actions
    setThemeMode,
    toggleTheme,
    setThemeColors,
    usePresetTheme,
    updateLayout,
    toggleSidebar,
    openSettingsPanel,
    closeSettingsPanel,
    resetSettings,

    // Constants
    PRESET_COLORS
  };
});
