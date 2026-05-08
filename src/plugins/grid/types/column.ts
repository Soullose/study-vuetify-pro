/**
 * plugins/grid/types/column.ts
 *
 * ProColumn 列定义类型 — 精简后的纯 AG Grid 字段映射
 * 渲染和编辑完全交给用户通过 AG Grid 原生 cellRenderer / cellEditor 实现
 *
 * @author Architecture Team
 * @date 2026-05-07
 */

import type { ColDef } from 'ag-grid-community'

/**
 * ProColumn 组件 Props 类型定义
 *
 * 仅保留 AG Grid 原生列属性的声明式映射，
 * 不内置任何渲染器/编辑器组件。
 */
export interface ProColumnProps {
  /** 数据字段名（对应后端返回对象的 key） */
  field: string
  /** 列标题文本，不设置时使用 field 作为标题 */
  header?: string
  /** AG Grid 列定义中除 field 外的任意属性，用于透传原生配置 */
  colDef?: Partial<Omit<ColDef, 'field'>>
  /** 列宽度（像素值或百分比） */
  width?: number | string
  /** 最小列宽 */
  minWidth?: number | string
  /** 最大列宽 */
  maxWidth?: number | string
  /** 是否隐藏该列 */
  hide?: boolean
  /** 固定列位置 */
  pinned?: 'left' | 'right' | boolean
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可筛选 */
  filterable?: boolean
  /** 是否禁止调整列宽 */
  resizable?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 列 flex 比例 */
  flex?: number
  /** 单元格样式类名 */
  cellClass?: string | string[]
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
}

/**
 * 内部列配置 — ProColumn 注册到 ProGrid 的完整配置
 */
export interface ColumnConfig {
  field: string
  header?: string
  colDef?: Partial<ColDef>
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  hide?: boolean
  pinned?: 'left' | 'right' | boolean
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  editable?: boolean
  flex?: number
  cellClass?: string | string[]
  align?: 'left' | 'center' | 'right'
}

/**
 * ProGrid 组件 Props 类型定义
 */
export interface ProGridProps {
  /** 数据源配置 */
  dataSource?: import('./datasource').DataSourceConfig
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
}

/**
 * ProGrid 组件 Emits 类型定义
 */
export interface ProGridEmits {
  'cell-value-changed': [event: CellValueChangedEvent]
  'selection-changed': [selectedRows: Record<string, unknown>[]]
  'data-loaded': [data: Record<string, unknown>[], total: number]
  'row-clicked': [row: Record<string, unknown>]
  'row-double-clicked': [row: Record<string, unknown>]
}

/**
 * 单元格值变更事件
 */
export interface CellValueChangedEvent {
  /** 行数据 */
  data: Record<string, unknown>
  /** 变更的字段名 */
  field: string
  /** 旧值 */
  oldValue: unknown
  /** 新值 */
  newValue: unknown
}
