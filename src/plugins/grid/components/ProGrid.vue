<!--
  plugins/grid/components/ProGrid.vue

  ProGrid 主组件 — 纯 AG Grid 容器封装
  不依赖任何 Vuetify 组件，主题完全通过 AG Grid CSS 变量控制

  @author Architecture Team
  @date 2026-05-07
-->
<template>
  <div
    class="pro-grid-wrapper"
    :class="{ 'pro-grid--loading': internalLoading }"
    :style="containerStyle"
  >
    <!-- 工具栏插槽 -->
    <div v-if="$slots.toolbar" class="pro-grid-toolbar">
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
        :pagination="showPagination"
        :pagination-page-size="paginationPageSize"
        :pagination-page-size-selector="paginationPageSizeSelector"
        class="ag-theme-quartz"
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

    <!-- 默认插槽（放置 ProColumn 子组件） -->
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * ProGrid
 *
 * 纯 AG Grid 容器组件，提供：
 * - 声明式列定义（通过 ProColumn 子组件）
 * - 数据源管理（前端全量 / 服务端分页）
 * - 事件标准化
 * - AG Grid 内置分页
 *
 * 不内置任何 Vuetify 组件或样式。
 * 主题通过 ag-theme-quartz + 用户自定义 CSS 变量控制。
 *
 * @example
 * <ProGrid :data-source="serverDataSource" row-id-field="id">
 *   <ProColumn field="username" header="用户名" :width="120" />
 *   <ProColumn
 *     field="status"
 *     header="状态"
 *     :col-def="{
 *       cellRenderer: MyStatusRenderer,
 *       cellRendererParams: { statusMap }
 *     }"
 *   />
 *   <ProColumn field="enabled" header="启用" editable :col-def="{ cellEditor: 'agCheckboxCellEditor' }" />
 * </ProGrid>
 */

import { ref, computed, provide, onMounted, watch, toRef, defineComponent, h } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi } from 'ag-grid-community'
import type { DataSourceConfig, CellValueChangedEvent } from '../types'
import { PROGRID_COLUMN_INJECTION_KEY } from '../utils/injection-keys'
import { useGridColumns } from '../composables/useGridColumns'
import { useGridDataSource } from '../composables/useGridDataSource'
import { useGridEvents } from '../composables/useGridEvents'

/**
 * 空数据状态覆盖层组件
 */
const NoRowsOverlay = defineComponent({
  name: 'NoRowsOverlay',
  setup() {
    return () =>
      h('div', {
        class: 'pro-grid-no-rows',
        style: { padding: '32px 16px', width: '100%', height: '100%', textAlign: 'center' }
      }, [
        h('div', {
          style: { fontSize: '48px', lineHeight: '1', color: 'var(--ag-secondary-foreground-color)', marginBottom: '8px' }
        }, '⊘'),
        h('div', {
          style: { color: 'var(--ag-secondary-foreground-color)', fontSize: '14px' }
        }, '暂无数据')
      ])
  }
})

/** 空数据覆盖层参数 */
const noRowsOverlayParams = ref({})

/**
 * ProGrid Props
 */
const props = withDefaults(defineProps<{
  /** 数据源配置（服务端模式或前端模式） */
  dataSource?: DataSourceConfig
  /** 前端模式下的静态数据 */
  data?: Record<string, unknown>[]
  /** 行 ID 字段名，默认 'id' */
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
 * ProGrid Emits
 */
const emit = defineEmits<{
  'cell-value-changed': [event: CellValueChangedEvent]
  'selection-changed': [selectedRows: Record<string, unknown>[]]
  'data-loaded': [data: Record<string, unknown>[], total: number]
  'row-clicked': [row: Record<string, unknown>]
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

/** 内部加载状态 */
const internalLoading = computed(() => dataSourceState.loading.value)

/** 是否为服务端模式 */
const isServerMode = computed(() => dataSourceState.mode.value === 'server')

/** 分页每页条数 */
const paginationPageSize = computed(() => dataSourceState.pagination.value.pageSize)

/** 分页每页条数选择器 */
const paginationPageSizeSelector = computed(() => dataSourceState.pageSizes.value)

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
 */
const resolvedRowSelection = computed<'single' | 'multiple' | undefined>(() => {
  if (props.rowSelection === false) return undefined
  return props.rowSelection || undefined
})

/**
 * getRowId 回调函数
 * 使用 rowIdField 指定的字段值作为行唯一标识
 */
function getRowId(params: { data: Record<string, unknown> }): string {
  return String(params.data[props.rowIdField] ?? '')
}

// ==================== 生命周期 ====================

onMounted(async () => {
  const autoLoad = props.dataSource?.autoLoad !== false
  if (autoLoad) {
    await dataSourceState.loadData()
  }
})

// 监听数据加载完成，触发 data-loaded 事件
watch(
  () => dataSourceState.rowData.value,
  (newData) => {
    emit('data-loaded', newData, dataSourceState.pagination.value.total)
  },
)

// 服务端模式：监听 AG Grid 分页事件，触发数据重新加载
watch(
  () => dataSourceState.pagination.value.currentPage,
  (newPage, oldPage) => {
    if (isServerMode.value && newPage !== oldPage && gridApi.value) {
      // 同步 AG Grid 内置分页的当前页
      gridApi.value.paginationGoToPage(newPage - 1)
    }
  },
)

// ==================== 暴露 API ====================

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
  border: 1px solid var(--ag-border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--ag-background-color, #fff);
}

.pro-grid-toolbar {
  border-bottom: 1px solid var(--ag-border-color, #e0e0e0);
  padding: 8px 16px;
}

.pro-grid-body {
  position: relative;
}

.pro-grid--loading {
  opacity: 0.7;
  pointer-events: none;
}

.pro-grid-no-rows {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
