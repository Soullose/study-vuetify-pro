<!--
  plugins/grid/components/ProGrid.vue

  ProGrid 主组件 - AG Grid + Vuetify 增强型表格
  整合 AgGridVue + 所有 composables，提供声明式列定义和 Vuetify 组件集成

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div
    class="pro-grid-wrapper"
    :class="{ 'pro-grid--loading': internalLoading }"
    :style="containerStyle"
  >
    <!-- 工具栏插槽 -->
    <div v-if="$slots.toolbar" class="pro-grid-toolbar pa-2">
      <slot name="toolbar" />
    </div>

    <!-- AG Grid 表格主体 -->
    <div class="pro-grid-body" :style="gridBodyStyle">
      <AgGridVue
        :column-defs="columns.columnDefs.value"
        :row-data="dataSourceState.rowData.value"
        :get-row-id="getRowId"
        :row-selection="resolvedRowSelection"
        :loading="internalLoading"
        :dom-layout="autoHeight ? 'autoHeight' : 'normal'"
        :suppress-cell-focus="false"
        :suppress-row-click-selection="false"
        :animate-rows="true"
        :row-height="48"
        :header-height="48"
        :no-rows-overlay-component="NoRowsOverlay"
        :no-rows-overlay-component-params="noRowsOverlayParams"
        :pagination="clientPaginationEnabled"
        :pagination-page-size="clientPageSize"
        :suppress-pagination-panel="clientPaginationEnabled"
        class="ag-theme-quartz pro-grid-ag-theme"
        style="width: 100%; height: 100%"
        @grid-ready="eventHandlers.onGridReady"
        @cell-value-changed="eventHandlers.onCellValueChanged"
        @selection-changed="eventHandlers.onSelectionChanged"
        @sort-changed="eventHandlers.onSortChanged"
        @filter-changed="eventHandlers.onFilterChanged"
        @row-clicked="eventHandlers.onRowClicked"
        @row-double-clicked="eventHandlers.onRowDoubleClicked"
      />
    </div>

    <!-- 前端模式分页控制（使用自定义 GridPagination 同步 AG Grid 分页） -->
    <GridPagination
      v-if="showPagination && clientPaginationEnabled"
      :pagination="clientPaginationState"
      :page-sizes="dataSourceState.pageSizes.value"
      :show="dataSourceState.pagination.value.total > 0"
      @page-change="onClientPageChange"
      @page-size-change="onClientPageSizeChange"
    />

    <!-- 服务端模式分页控制 -->
    <GridPagination
      v-if="showPagination && isServerMode"
      :pagination="dataSourceState.pagination.value"
      :page-sizes="dataSourceState.pageSizes.value"
      :show="dataSourceState.pagination.value.total > 0"
      @page-change="dataSourceState.goToPage"
      @page-size-change="dataSourceState.changePageSize"
    />

    <!-- 默认插槽（放置 ProColumn 子组件） -->
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * ProGrid
 *
 * 增强型 AG Grid 表格组件，集成 Vuetify 组件体系。
 *
 * 核心特性：
 * - 声明式列定义（通过 ProColumn 子组件）
 * - Vuetify 组件渲染器（checkbox、switch、date、status、template）
 * - 行内编辑（基于 Vuetify 输入组件）
 * - 双数据模式（前端全量 / 服务端分页）
 * - rowIdField 自动处理（默认 id 字段自动隐藏）
 * - 空数据状态展示（No Rows Overlay）
 * - 前端模式利用 AG Grid 内置分页（性能更优）
 *
 * @example
 * <ProGrid :data-source="serverDataSource" row-id-field="id">
 *   <ProColumn field="username" header="用户名" editable />
 *   <ProColumn field="status" header="状态" type="status" :status-map="statusMap" />
 *   <ProColumn field="enabled" header="启用" type="switch" editable />
 * </ProGrid>
 */

import { ref, computed, provide, onMounted, watch, toRef, defineComponent, h, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi } from 'ag-grid-community'
import type { DataSourceConfig, CellValueChangedEvent, PaginationState } from '../types'
import { PROGRID_COLUMN_INJECTION_KEY } from '../utils/injection-keys'
import { useGridColumns } from '../composables/useGridColumns'
import { useGridDataSource } from '../composables/useGridDataSource'
import { useGridEvents } from '../composables/useGridEvents'
import GridPagination from './GridPagination.vue'

/**
 * 空数据状态覆盖层组件
 * 当表格无数据时显示友好的空状态提示
 */
const NoRowsOverlay = defineComponent({
  name: 'NoRowsOverlay',
  setup() {
    return () =>
      h('div', {
        class: 'pro-grid-no-rows d-flex flex-column align-center justify-center',
        style: { padding: '32px 16px', width: '100%', height: '100%' }
      }, [
        h('v-icon', { size: '48', color: 'grey-lighten-1' }, 'mdi-inbox-outline'),
        h('div', { class: 'text-body-1 text-medium-emphasis mt-2' }, '暂无数据')
      ])
  }
})

/** 空数据覆盖层参数 */
const noRowsOverlayParams = ref({})

/**
 * ProGrid Props 定义
 */
const props = withDefaults(defineProps<{
  /** 数据源配置（服务端模式或前端模式） */
  dataSource?: DataSourceConfig
  /** 前端模式下的静态数据 */
  data?: Record<string, unknown>[]
  /** 行 ID 字段名，默认 'id'，自动设为行标识并隐藏 */
  rowIdField?: string
  /** 行选择模式 */
  rowSelection?: 'single' | 'multiple' | false
  /** 表格高度 */
  height?: string | number
  /** 是否自适应高度 */
  autoHeight?: boolean
  /** 是否显示分页 */
  showPagination?: boolean
}>(), {
  dataSource: undefined,
  data: undefined,
  rowIdField: 'id',
  rowSelection: false,
  height: 500,
  autoHeight: false,
  showPagination: true,
})

/**
 * ProGrid Emits 定义
 */
const emit = defineEmits<{
  /** 单元格值变更 */
  'cell-value-changed': [event: CellValueChangedEvent]
  /** 行选择变更 */
  'selection-changed': [selectedRows: Record<string, unknown>[]]
  /** 数据加载完成 */
  'data-loaded': [data: Record<string, unknown>[], total: number]
  /** 行点击 */
  'row-clicked': [row: Record<string, unknown>]
  /** 行双击 */
  'row-double-clicked': [row: Record<string, unknown>]
}>()

// ==================== 响应式引用 ====================

/** Grid API 引用 */
const gridApi = ref<GridApi | null>(null)

/** 行 ID 字段（响应式） */
const rowIdFieldRef = toRef(props, 'rowIdField')

/** 数据源配置（响应式） */
const dataSourceRef = toRef(props, 'dataSource')

/** 静态数据（响应式） */
const dataRef = toRef(props, 'data')

// ==================== Composables ====================

/** 列配置管理 */
const columns = useGridColumns(rowIdFieldRef)

/** 数据源管理 */
const dataSourceState = useGridDataSource(dataSourceRef, dataRef)

/**
 * 类型安全的 emit 包装函数
 * 将 Vue 类型化的 emit 转为 useGridEvents 所需的签名
 */
function typedEmit(event: string, ...args: unknown[]): void {
  (emit as (event: string, ...args: unknown[]) => void)(event, ...args)
}

/** 事件处理 */
const eventHandlers = useGridEvents(
  typedEmit,
  dataSourceState.mode,
  gridApi,
  dataSourceState.updateSort,
  dataSourceState.updateFilter,
)

// ==================== Provide/Inject ====================

/** 向 ProColumn 子组件 provide 列注册接口 */
provide(PROGRID_COLUMN_INJECTION_KEY, {
  registerColumn: columns.registerColumn,
  unregisterColumn: columns.unregisterColumn,
})

// ==================== 计算属性 ====================

/** 内部加载状态（整合数据源 loading） */
const internalLoading = computed(() => dataSourceState.loading.value)

/** 是否为服务端模式 */
const isServerMode = computed(() => dataSourceState.mode.value === 'server')

/** 前端模式是否启用 AG Grid 内置分页 */
const clientPaginationEnabled = computed(() => {
  return !isServerMode.value && props.showPagination
})

/** 前端模式每页条数 */
const clientPageSize = computed(() => {
  return dataSourceState.pagination.value.pageSize
})

/** 前端模式分页状态（与 AG Grid 分页 API 同步） */
const clientPaginationState = reactive<PaginationState>({
  currentPage: 1,
  pageSize: dataSourceState.pagination.value.pageSize,
  total: 0,
  totalPages: 0,
})

/** 容器样式 */
const containerStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (!props.autoHeight) {
    const h = typeof props.height === 'number' ? `${props.height}px` : props.height
    styles.height = h
  }
  return styles
})

/** 表格主体样式 */
const gridBodyStyle = computed(() => {
  if (props.autoHeight) {
    return { minHeight: '200px' }
  }
  return { flex: '1 1 auto', overflow: 'hidden' }
})

/**
 * 解析行选择模式
 * AG Grid 的 rowSelection 不接受 false，需要转为 undefined
 */
const resolvedRowSelection = computed<'single' | 'multiple' | undefined>(() => {
  if (props.rowSelection === false) return undefined
  return props.rowSelection || undefined
})

/**
 * getRowId 回调函数
 * 使用 rowIdField 指定的字段值作为行唯一标识
 * @param params - AG Grid 行参数
 * @returns 行 ID 字符串
 */
function getRowId(params: { data: Record<string, unknown> }): string {
  return String(params.data[props.rowIdField] ?? '')
}

// ==================== 前端模式分页同步 ====================

/**
 * 前端模式翻页 - 通过 AG Grid API 控制分页
 * @param page - 目标页码（从 1 开始）
 */
function onClientPageChange(page: number): void {
  if (!gridApi.value) return
  // AG Grid paginationGoToPage 从 0 开始
  gridApi.value.paginationGoToPage(page - 1)
  syncClientPaginationState()
}

/**
 * 前端模式修改每页条数
 * @param size - 新的每页条数
 */
function onClientPageSizeChange(size: number): void {
  if (!gridApi.value) return
  // AG Grid v33 使用 setGridOption 动态修改 paginationPageSize
  gridApi.value.setGridOption('paginationPageSize', size)
  dataSourceState.pagination.value.pageSize = size
  clientPaginationState.pageSize = size
  syncClientPaginationState()
}

/**
 * 从 AG Grid 分页 API 同步分页状态到本地
 */
function syncClientPaginationState(): void {
  if (!gridApi.value) return
  const totalRows = dataSourceState.rowData.value.length
  const pageSize = clientPaginationState.pageSize
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  // AG Grid 当前页从 0 开始，转为从 1 开始
  const currentPage = (gridApi.value.paginationGetCurrentPage() ?? 0) + 1

  clientPaginationState.currentPage = currentPage
  clientPaginationState.total = totalRows
  clientPaginationState.totalPages = totalPages
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 自动加载数据
  const autoLoad = props.dataSource?.autoLoad !== false
  if (autoLoad) {
    await dataSourceState.loadData()
  }
})

// 注意：不再在此处 watch props.data，useGridDataSource 内部已处理
// 避免前端模式下的双重加载问题（B2 修复）

// 监听数据加载完成，触发 data-loaded 事件并同步前端分页状态
watch(
  () => dataSourceState.rowData.value,
  (newData) => {
    emit('data-loaded', newData, dataSourceState.pagination.value.total)
    // 前端模式：数据变化后重新同步分页状态
    if (clientPaginationEnabled.value) {
      // 延迟同步，确保 AG Grid 已完成渲染
      setTimeout(() => {
        syncClientPaginationState()
      }, 50)
    }
  },
)

// ==================== 暴露 API ====================

/** 暴露给父组件的方法和属性 */
defineExpose({
  /** AG Grid API */
  gridApi,
  /** 刷新数据 */
  refresh: dataSourceState.refresh,
  /** 列配置 */
  columnDefs: columns.columnDefs,
  /** 行数据 */
  rowData: dataSourceState.rowData,
  /** 分页状态 */
  pagination: dataSourceState.pagination,
  /** 加载状态 */
  loading: dataSourceState.loading,
})
</script>

<style scoped>
.pro-grid-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  overflow: hidden;
  background-color: rgb(var(--v-theme-surface));
}

.pro-grid-toolbar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.pro-grid-body {
  position: relative;
}

.pro-grid--loading {
  opacity: 0.7;
  pointer-events: none;
}

/* AG Grid quartz 主题与 Vuetify 主题融合 */
.pro-grid-ag-theme {
  /* 使用 Vuetify 主题色覆盖 AG Grid 默认颜色 */
  --ag-background-color: rgb(var(--v-theme-surface));
  --ag-header-background-color: rgba(var(--v-theme-on-surface), 0.04);
  --ag-odd-row-background-color: rgba(var(--v-theme-on-surface), 0.02);
  --ag-header-foreground-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  --ag-foreground-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  --ag-row-hover-color: rgba(var(--v-theme-primary), 0.04);
  --ag-selected-row-background-color: rgba(var(--v-theme-primary), 0.08);
  --ag-range-selection-border-color: rgb(var(--v-theme-primary));
  --ag-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --ag-secondary-foreground-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --ag-input-focus-border-color: rgb(var(--v-theme-primary));
  --ag-checkbox-checked-color: rgb(var(--v-theme-primary));
  /* 圆角和字体与 Vuetify 对齐 */
  --ag-wrapper-border-radius: 0;
  --ag-grid-size: 4px;
  --ag-font-size: 14px;
  --ag-font-family: 'Roboto', sans-serif;
}

/* 空数据状态样式 */
.pro-grid-no-rows {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>
