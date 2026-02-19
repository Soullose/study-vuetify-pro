import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

/**
 * 标签页项
 */
export interface TagView {
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 页面标题 */
  title: string;
  /** 路由完整路径（含参数） */
  fullPath: string;
  /** 图标 */
  icon?: string;
  /** 是否固定（不可关闭） */
  affix: boolean;
  /** 是否缓存 */
  keepAlive: boolean;
  /** 查询参数 */
  query?: Record<string, string>;
}

export const useTagsViewStore = defineStore('tagsView', () => {
  // ==================== State ====================

  /** 访问过的标签 */
  const visitedViews = ref<TagView[]>([]);

  /** 缓存的路由名称 */
  const cachedViews = ref<string[]>([]);

  /** 最大标签数量 */
  const maxTags = ref(20);

  // ==================== Getters ====================

  /** 获取所有标签 */
  const getVisitedViews = computed(() => visitedViews.value);

  /** 获取缓存的路由 */
  const getCachedViews = computed(() => cachedViews.value);

  /** 是否有标签 */
  const hasTags = computed(() => visitedViews.value.length > 0);

  // ==================== Actions ====================

  /**
   * 添加标签
   */
  function addView(view: RouteLocationNormalized): void {
    addVisitedView(view);
    addCachedView(view);
  }

  /**
   * 添加访问过的标签
   */
  function addVisitedView(view: RouteLocationNormalized): void {
    const path = view.path;

    // 检查是否已存在
    if (visitedViews.value.some((v) => v.path === path)) {
      return;
    }

    // 检查是否超过最大数量
    if (visitedViews.value.length >= maxTags.value) {
      // 移除最早的非固定标签
      const firstNonAffixIndex = visitedViews.value.findIndex((v) => !v.affix);
      if (firstNonAffixIndex > -1) {
        visitedViews.value.splice(firstNonAffixIndex, 1);
      }
    }

    // 添加新标签
    visitedViews.value.push(createTagView(view));
  }

  /**
   * 添加缓存的路由
   */
  function addCachedView(view: RouteLocationNormalized): void {
    const name = view.name as string;

    if (!name) return;
    if (cachedViews.value.includes(name)) return;
    if (view.meta?.keepAlive === false) return;

    cachedViews.value.push(name);
  }

  /**
   * 删除标签
   */
  function delView(view: TagView): TagView[] {
    delVisitedView(view);
    delCachedView(view);
    return visitedViews.value;
  }

  /**
   * 删除访问过的标签
   */
  function delVisitedView(view: TagView): void {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);

    if (index > -1) {
      visitedViews.value.splice(index, 1);
    }
  }

  /**
   * 删除缓存的路由
   */
  function delCachedView(view: TagView): void {
    const index = cachedViews.value.indexOf(view.name);

    if (index > -1) {
      cachedViews.value.splice(index, 1);
    }
  }

  /**
   * 关闭其他标签
   */
  function delOthersViews(view: TagView): void {
    visitedViews.value = visitedViews.value.filter((v) => v.affix || v.path === view.path);
    cachedViews.value = cachedViews.value.filter((name) => name === view.name);
  }

  /**
   * 关闭左侧标签
   */
  function delLeftViews(view: TagView): void {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);

    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => v.affix || i >= index);
      cachedViews.value = cachedViews.value.filter((name) => visitedViews.value.some((v) => v.name === name));
    }
  }

  /**
   * 关闭右侧标签
   */
  function delRightViews(view: TagView): void {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);

    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => v.affix || i <= index);
      cachedViews.value = cachedViews.value.filter((name) => visitedViews.value.some((v) => v.name === name));
    }
  }

  /**
   * 关闭所有标签
   */
  function delAllViews(): void {
    visitedViews.value = visitedViews.value.filter((v) => v.affix);
    cachedViews.value = [];
  }

  /**
   * 刷新当前标签（清除缓存）
   */
  function refreshView(view: TagView): void {
    const index = cachedViews.value.indexOf(view.name);

    if (index > -1) {
      cachedViews.value.splice(index, 1);
    }

    // 下次进入时重新缓存
    setTimeout(() => {
      if (!cachedViews.value.includes(view.name)) {
        cachedViews.value.push(view.name);
      }
    }, 100);
  }

  /**
   * 获取相邻标签
   */
  function getAdjacentTag(view: TagView): TagView | null {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);

    if (index === -1) return null;

    // 优先返回右侧标签
    if (index < visitedViews.value.length - 1) {
      return visitedViews.value[index + 1];
    }

    // 其次返回左侧标签
    if (index > 0) {
      return visitedViews.value[index - 1];
    }

    return null;
  }

  // ==================== Helper Functions ====================

  /**
   * 创建标签对象
   */
  function createTagView(route: RouteLocationNormalized): TagView {
    return {
      path: route.path,
      name: route.name as string,
      title: (route.meta?.title as string) || '未命名',
      fullPath: route.fullPath,
      icon: route.meta?.icon as string,
      affix: (route.meta?.affix as boolean) || false,
      keepAlive: (route.meta?.keepAlive as boolean) !== false,
      query: route.query as Record<string, string>
    };
  }

  return {
    // State
    visitedViews,
    cachedViews,
    maxTags,

    // Getters
    getVisitedViews,
    getCachedViews,
    hasTags,

    // Actions
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    refreshView,
    getAdjacentTag
  };
});
