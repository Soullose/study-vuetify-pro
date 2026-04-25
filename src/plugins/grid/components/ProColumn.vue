<!--
  plugins/grid/components/ProColumn.vue

  声明式列定义组件 - 不可见组件
  通过 inject 获取 ProGrid 的注册函数，将列配置注册到 ProGrid

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <!-- ProColumn 是不可见组件，不渲染任何内容 -->
  <slot />
</template>

<script setup lang="ts">
/**
 * ProColumn
 *
 * 声明式列定义组件，用于在 ProGrid 内部声明列配置。
 * 通过 provide/inject 机制将列配置注册到父级 ProGrid。
 *
 * @example
 * <ProGrid :data-source="dataSource">
 *   <ProColumn field="username" header="用户名" editable />
 *   <ProColumn field="status" header="状态" type="status" :status-map="statusMap" />
 * </ProGrid>
 */

import { computed, onMounted, onUnmounted, useSlots, inject, watch } from 'vue'
import type { ColumnConfig, ColumnRendererType, ColumnEditorType, StatusMap, SelectOption } from '../types'
import { PROGRID_COLUMN_INJECTION_KEY } from '../utils/injection-keys'

const props = withDefaults(defineProps<{
  /** 数据字段名（对应后端返回对象的 key） */
  field: string
  /** 列标题文本 */
  header?: string
  /** 列类型 */
  type?: ColumnRendererType
  /** 是否可编辑 */
  editable?: boolean
  /** 编辑器类型 */
  editorType?: ColumnEditorType
  /** 列宽度 */
  width?: number | string
  /** 最小列宽 */
  minWidth?: number | string
  /** 最大列宽 */
  maxWidth?: number | string
  /** 是否隐藏 */
  hide?: boolean
  /** 是否固定列 */
  pinned?: 'left' | 'right' | boolean
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可筛选 */
  filterable?: boolean
  /** 是否可调整列宽 */
  resizable?: boolean
  /** 状态映射表（type='status' 时使用） */
  statusMap?: StatusMap
  /** 日期格式（type='date' 时使用） */
  format?: string
  /** 下拉选项（editorType='select' 时使用） */
  editorOptions?: SelectOption[]
  /** 单元格样式类 */
  cellClass?: string | string[]
  /** 文本对齐 */
  align?: 'left' | 'center' | 'right'
  /** 列 flex 比例 */
  flex?: number
}>(), {
  header: undefined,
  type: undefined,
  editable: false,
  editorType: undefined,
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  hide: false,
  pinned: undefined,
  sortable: true,
  filterable: false,
  resizable: true,
  statusMap: undefined,
  format: undefined,
  editorOptions: undefined,
  cellClass: undefined,
  align: undefined,
  flex: undefined,
})

const slots = useSlots()

/**
 * 构建列配置对象
 * 如果有默认插槽且 type 为 template，将插槽内容转换为渲染函数
 */
const columnConfig = computed<ColumnConfig>(() => {
  const config: ColumnConfig = {
    field: props.field,
    header: props.header,
    type: props.type,
    editable: props.editable,
    editorType: props.editorType,
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    hide: props.hide,
    pinned: props.pinned,
    sortable: props.sortable,
    filterable: props.filterable,
    resizable: props.resizable,
    statusMap: props.statusMap,
    format: props.format,
    editorOptions: props.editorOptions,
    cellClass: props.cellClass,
    align: props.align,
    flex: props.flex,
  }

  // 处理 template 类型的插槽 - 将插槽内容转换为渲染函数
  if (props.type === 'template' && slots.default) {
    config.templateRender = (data: Record<string, unknown>) => {
      return slots.default?.({ data, value: data[props.field] }) || []
    }
  }

  return config
})

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
// computed 本身已追踪所有 props 的响应式依赖，无需 deep: true
watch(columnConfig, (newConfig) => {
  if (registerContext) {
    registerContext.registerColumn(newConfig)
  }
})
</script>
