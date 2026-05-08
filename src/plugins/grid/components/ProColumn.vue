<!--
  plugins/grid/components/ProColumn.vue

  声明式列定义组件 — 不可见组件，仅负责将列配置注册到父级 ProGrid
  不内置任何渲染器或编辑器，用户通过 colDef 透传 AG Grid 原生配置

  @author Architecture Team
  @date 2026-05-07
-->
<template>
  <!-- ProColumn 是不可见组件，不渲染任何内容 -->
</template>

<script setup lang="ts">
/**
 * ProColumn
 *
 * 声明式列定义组件，用于在 ProGrid 内部声明列配置。
 * 通过 provide/inject 机制将列配置注册到父级 ProGrid。
 *
 * 渲染和编辑完全由用户控制：
 * - 使用 colDef.cellRenderer / colDef.cellEditor 指定 AG Grid 原生或自定义组件
 * - 使用 colDef 透传任意 AG Grid ColDef 属性
 *
 * @example
 * <ProGrid :data-source="dataSource">
 *   <ProColumn field="username" header="用户名" :width="120" />
 *   <ProColumn field="status" header="状态" :col-def="{ cellRenderer: 'agAnimateShowChangeCellRenderer' }" />
 *   <ProColumn field="enabled" header="启用" editable :col-def="{ cellEditor: 'agCheckboxCellEditor' }" />
 * </ProGrid>
 */

import { computed, onMounted, onUnmounted, inject, watch } from 'vue'
import type { ColDef } from 'ag-grid-community'
import type { ColumnConfig } from '../types'
import { PROGRID_COLUMN_INJECTION_KEY } from '../utils/injection-keys'

const props = withDefaults(defineProps<{
  /** 数据字段名（对应后端返回对象的 key） */
  field: string
  /** 列标题文本 */
  header?: string
  /** AG Grid 列定义透传，优先级高于快捷属性 */
  colDef?: Partial<Omit<ColDef, 'field'>>
  /** 列宽度 */
  width?: number | string
  /** 最小列宽 */
  minWidth?: number | string
  /** 最大列宽 */
  maxWidth?: number | string
  /** 是否隐藏 */
  hide?: boolean
  /** 固定列 */
  pinned?: 'left' | 'right' | boolean
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可筛选 */
  filterable?: boolean
  /** 是否可调整列宽 */
  resizable?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 列 flex 比例 */
  flex?: number
  /** 单元格样式类 */
  cellClass?: string | string[]
  /** 文本对齐 */
  align?: 'left' | 'center' | 'right'
}>(), {
  header: undefined,
  colDef: undefined,
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  hide: false,
  pinned: undefined,
  sortable: true,
  filterable: false,
  resizable: true,
  editable: false,
  flex: undefined,
  cellClass: undefined,
  align: undefined,
})

/**
 * 构建列配置对象
 */
const columnConfig = computed<ColumnConfig>(() => ({
  field: props.field,
  header: props.header,
  colDef: props.colDef,
  width: props.width,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  hide: props.hide,
  pinned: props.pinned,
  sortable: props.sortable,
  filterable: props.filterable,
  resizable: props.resizable,
  editable: props.editable,
  flex: props.flex,
  cellClass: props.cellClass,
  align: props.align,
}))

// 通过 inject 获取 ProGrid 的注册函数
const registerContext = inject(PROGRID_COLUMN_INJECTION_KEY, null)

onMounted(() => {
  if (registerContext) {
    registerContext.registerColumn(columnConfig.value)
  } else {
    console.warn('[ProColumn] 未找到 ProGrid 父组件，请确保 ProColumn 在 ProGrid 内部使用')
  }
})

onUnmounted(() => {
  if (registerContext) {
    registerContext.unregisterColumn(props.field)
  }
})

// 监听配置变化，重新注册
watch(columnConfig, (newConfig) => {
  if (registerContext) {
    registerContext.registerColumn(newConfig)
  }
})
</script>
