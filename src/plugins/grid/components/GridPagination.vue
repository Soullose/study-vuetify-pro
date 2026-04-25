<!--
  plugins/grid/components/GridPagination.vue

  分页控制组件 - 使用 Vuetify 分页组件
  与 useGridDataSource 的 pagination 状态双向绑定

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div v-if="show" class="pro-grid-pagination d-flex align-center justify-end pa-2 ga-3">
    <!-- 总条数信息 -->
    <span class="text-body-2 text-medium-emphasis">
      共 {{ pagination.total }} 条
    </span>

    <!-- 每页条数选择 -->
    <v-select
      :model-value="pagination.pageSize"
      :items="pageSizes"
      density="compact"
      variant="outlined"
      hide-details
      single-line
      :min-width="80"
      :max-width="100"
      @update:model-value="onPageSizeChange"
    />

    <!-- 分页器 -->
    <v-pagination
      :model-value="pagination.currentPage"
      :length="pagination.totalPages"
      :total-visible="totalVisible"
      density="compact"
      rounded
      @update:model-value="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * GridPagination
 *
 * 基于 Vuetify v-pagination 和 v-select 的分页控制组件。
 * 显示总条数、每页条数选择器和分页导航。
 * 使用 Vuetify useDisplay() 实现响应式断点。
 */

import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { PaginationState } from '../types'

const props = withDefaults(defineProps<{
  /** 分页状态 */
  pagination: PaginationState
  /** 每页条数可选项 */
  pageSizes?: number[]
  /** 是否显示分页（total > 0 时显示） */
  show?: boolean
}>(), {
  pageSizes: () => [10, 20, 50, 100],
  show: true,
})

const emit = defineEmits<{
  /** 翻页事件 */
  'page-change': [page: number]
  /** 每页条数变更事件 */
  'page-size-change': [size: number]
}>()

/** 使用 Vuetify 响应式断点，窗口 resize 时自动更新 */
const { width } = useDisplay()

/** 分页器显示的页码按钮数量（响应式） */
const totalVisible = computed(() => {
  if (width.value < 600) return 3
  if (width.value < 960) return 5
  return 7
})

/** 翻页处理 */
function onPageChange(page: number): void {
  emit('page-change', page)
}

/** 每页条数变更处理 */
function onPageSizeChange(size: unknown): void {
  const numSize = typeof size === 'number' ? size : parseInt(String(size), 10)
  if (!isNaN(numSize)) {
    emit('page-size-change', numSize)
  }
}
</script>

<style scoped>
.pro-grid-pagination {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgb(var(--v-theme-surface));
  min-height: 44px;
}

.pro-grid-pagination :deep(.v-select .v-field) {
  font-size: 13px;
  min-height: 32px;
}

.pro-grid-pagination :deep(.v-select .v-field__input) {
  padding: 2px 8px;
  min-height: 32px;
}
</style>
