<!--
  多页签视图组件

  功能：
  - 自定义样式的水平可滚动标签栏
  - 每个标签支持点击切换、右键菜单、关闭按钮
  - 右键菜单：刷新、关闭、关闭其他、关闭所有
  - 固定标签（affix）不可关闭
  - 鼠标滚轮横向滚动
-->
<template>
  <div class="tags-view-container">
    <!-- 可滚动的页签列表 -->
    <div ref="scrollRef" class="tags-view-scroll" @wheel.prevent="onWheel">
      <div
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        class="tag-item"
        :class="{ 'tag-item--active': route.path === tag.path }"
        @click="router.push(tag.fullPath)"
        @contextmenu.prevent="openContextMenu($event, tag)"
        @mouseenter="hoveredPath = tag.path"
        @mouseleave="hoveredPath = ''"
      >
        <!-- 页签图标 -->
        <v-icon v-if="tag.icon" :icon="tag.icon" size="14" class="tag-item__icon" />

        <!-- 页签标题（超长截断） -->
        <span class="tag-item__text">{{ tag.title }}</span>

        <!-- 关闭按钮（固定标签不显示，hover 或激活时可见） -->
        <span
          v-if="!tag.affix"
          class="tag-item__close"
          :class="{ 'tag-item__close--show': route.path === tag.path || hoveredPath === tag.path }"
          @click.stop="closeTag(tag)"
        >
          <v-icon size="12" icon="mdi-close" />
        </span>
      </div>
    </div>

    <!-- 右键上下文菜单 -->
    <v-menu v-model="menuVisible" :target="menuTarget" location="bottom start" close-on-content-click>
      <v-list density="compact" min-width="140" nav>
        <!-- 刷新当前页签 -->
        <v-list-item prepend-icon="mdi-refresh" title="刷新" @click="refreshTag" />

        <!-- 关闭当前页签（固定标签禁用） -->
        <v-list-item prepend-icon="mdi-close" title="关闭" :disabled="ctxTag?.affix ?? false" @click="closeTagFromMenu" />

        <v-divider />

        <!-- 关闭其他页签 -->
        <v-list-item prepend-icon="mdi-close-circle-outline" title="关闭其他" @click="closeOthers" />

        <!-- 关闭所有页签 -->
        <v-list-item prepend-icon="mdi-close-box-outline" title="关闭所有" @click="closeAll" />
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
/**
 * @description 多页签视图组件 - 在 admin 布局中显示已打开的页面标签
 * @author Architecture Team
 * @date 2026-04-08
 *
 * 设计要点：
 * - 自定义标签样式（非 v-tabs），更灵活的视觉效果
 * - 激活标签使用主题色填充，非激活标签透明背景
 * - 关闭按钮仅在 hover 或激活状态显示
 * - 右键菜单通过 v-menu + target 坐标定位
 * - 刷新功能通过 inject 获取父组件提供的刷新方法
 */
import { useTagsViewStore } from '@/stores/tagsView';
import type { TagView } from '@/stores/tagsView';

const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();

// 从 admin.vue 注入的刷新方法（通过改变 key 强制组件重建）
const refreshPage = inject<(tag: TagView) => void>('refreshPage', () => {});

// ==================== 滚动容器 ====================

const scrollRef = ref<HTMLElement | null>(null);

/** 当前 hover 的标签路径，控制关闭按钮显隐 */
const hoveredPath = ref('');

/**
 * 鼠标滚轮横向滚动处理
 * 将纵向滚轮事件转换为横向滚动
 */
function onWheel(e: WheelEvent): void {
  const el = scrollRef.value;
  if (!el) return;
  el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
}

// ==================== 右键菜单状态 ====================

/** 菜单是否可见 */
const menuVisible = ref(false);

/** 菜单定位坐标 */
const menuTarget = ref<[number, number]>([0, 0]);

/** 右键选中的标签 */
const ctxTag = ref<TagView | null>(null);

/**
 * 打开右键上下文菜单
 * 先关闭已打开的菜单，再在下一帧重新定位并打开
 */
function openContextMenu(event: MouseEvent, tag: TagView): void {
  ctxTag.value = tag;
  menuVisible.value = false;
  nextTick(() => {
    menuTarget.value = [event.clientX, event.clientY];
    menuVisible.value = true;
  });
}

// ==================== 操作处理 ====================

/**
 * 刷新当前选中的标签页
 * 调用 admin.vue 提供的 refreshPage 方法
 */
function refreshTag(): void {
  if (!ctxTag.value) return;
  refreshPage(ctxTag.value);
  menuVisible.value = false;
}

/**
 * 关闭指定标签
 * 如果关闭的是当前激活标签，自动跳转到相邻标签
 */
function closeTag(tag: TagView): void {
  const isActive = tag.path === route.path;
  const adjacent = tagsViewStore.getAdjacentTag(tag);
  tagsViewStore.delView(tag);

  if (isActive) {
    router.push(adjacent?.fullPath ?? '/');
  }
}

/** 从右键菜单关闭标签（带固定标签保护） */
function closeTagFromMenu(): void {
  if (ctxTag.value && !ctxTag.value.affix) {
    closeTag(ctxTag.value);
  }
}

/** 关闭其他标签 */
function closeOthers(): void {
  if (!ctxTag.value) return;
  tagsViewStore.delOthersViews(ctxTag.value);
  if (route.path !== ctxTag.value.path) {
    router.push(ctxTag.value.fullPath);
  }
  menuVisible.value = false;
}

/** 关闭所有标签（保留固定标签） */
function closeAll(): void {
  tagsViewStore.delAllViews();
  const remaining = tagsViewStore.visitedViews;
  if (remaining.length > 0) {
    router.push(remaining[remaining.length - 1].fullPath);
  } else {
    router.push('/');
  }
  menuVisible.value = false;
}
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */

.tags-view-container {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 8px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  flex-shrink: 0;
}

.tags-view-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  white-space: nowrap;
  height: 100%;
  padding: 4px 0;

  /* 隐藏滚动条 */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* ==================== 单个标签 ==================== */

.tag-item {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity, 0.68));
  background: transparent;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.06);
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity, 0.87));
  }

  /* 激活状态：主题色填充 */
  &--active {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary, 255));

    &:hover {
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary, 255));
      filter: brightness(1.08);
    }

    .tag-item__close--show {
      opacity: 0.7;

      &:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.tag-item__icon {
  margin-right: 4px;
}

.tag-item__text {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==================== 关闭按钮 ==================== */

.tag-item__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  border-radius: 50%;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.12);
  }
}

/* hover 标签或激活时显示关闭按钮 */
.tag-item:hover .tag-item__close--show,
.tag-item__close--show {
  opacity: 0.7;
}
</style>
