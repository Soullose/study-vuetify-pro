/**
 * plugins/grid/types/column.ts
 *
 * ProColumn 列定义类型 - 声明式列配置的类型约束
 * 用于 ProColumn 组件的 props 类型定义以及内部列配置收集
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { VNode } from 'vue';

/**
 * 预置单元格渲染器类型
 * - checkbox: 使用 v-checkbox 渲染布尔值
 * - switch:   使用 v-switch 渲染开关状态
 * - date:     日期格式化文本渲染
 * - status:   使用 v-chip 渲染状态标签
 * - template: 自定义插槽渲染
 */
export type ColumnRendererType = 'checkbox' | 'switch' | 'date' | 'status' | 'template';

/**
 * 预置单元格编辑器类型
 * - text:     使用 v-text-field 文本编辑
 * - select:   使用 v-select 下拉选择编辑
 * - date:     日期选择编辑
 * - checkbox: 使用 v-checkbox 布尔值编辑
 * - switch:   使用 v-switch 开关编辑
 */
export type ColumnEditorType = 'text' | 'select' | 'date' | 'checkbox' | 'switch';

/**
 * 状态映射项 - 用于 StatusRenderer 的值到颜色/文本映射
 */
export interface StatusMapItem {
  /** 显示文本 */
  text: string;
  /** Vuetify 颜色名称或 CSS 颜色值 */
  color: string;
  /** v-chip variant 样式，默认 'tonal' */
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
}

/**
 * 状态映射表 - 键为数据字段值，值为显示配置
 * @example
 * ```ts
 * { active: { text: '启用', color: 'success' }, disabled: { text: '禁用', color: 'error' } }
 * ```
 */
export type StatusMap = Record<string, StatusMapItem>;

/**
 * 下拉选项项 - 用于 SelectEditor 的选项列表
 */
export interface SelectOption {
  /** 选项值 */
  value: string | number | boolean;
  /** 选项显示文本 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * ProColumn 组件 Props 类型定义
 */
export interface ProColumnProps {
  /** 数据字段名（对应后端返回对象的 key） */
  field: string;
  /** 列标题文本，不设置时使用 field 作为标题 */
  header?: string;
  /** 列类型，设置后自动匹配对应的渲染器 */
  type?: ColumnRendererType;
  /** 是否可编辑 */
  editable?: boolean;
  /** 编辑器类型，不设置时根据 type 自动推断 */
  editorType?: ColumnEditorType;
  /** 列宽度（像素值或百分比） */
  width?: number | string;
  /** 最小列宽 */
  minWidth?: number | string;
  /** 最大列宽 */
  maxWidth?: number | string;
  /** 是否隐藏该列 */
  hide?: boolean;
  /** 是否固定在左侧 */
  pinned?: 'left' | 'right' | boolean;
  /** 是否可排序 */
  sortable?: boolean;
  /** 是否可筛选 */
  filterable?: boolean;
  /** 是否禁止调整列宽 */
  resizable?: boolean;
  /** 状态映射表（type='status' 时必填） */
  statusMap?: StatusMap;
  /** 日期格式化字符串（type='date' 时生效，默认 'YYYY-MM-DD'） */
  format?: string;
  /** 下拉选项列表（editorType='select' 时必填） */
  editorOptions?: SelectOption[];
  /** 单元格样式类名 */
  cellClass?: string | string[];
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列 flex 比例 */
  flex?: number;
}

/**
 * 内部列配置 - ProColumn 注册到 ProGrid 的完整配置
 * 包含 ProColumnProps 的所有字段以及额外的内部字段
 */
export interface ColumnConfig extends ProColumnProps {
  /** 自定义渲染函数（template 类型使用） */
  templateRender?: (data: Record<string, unknown>) => VNode[];
}

/**
 * ProGrid 组件 Props 类型定义
 */
export interface ProGridProps {
  /** 数据源配置 */
  dataSource?: DataSourceConfig;
  /** 前端模式下的静态数据 */
  data?: Record<string, unknown>[];
  /** 行 ID 字段名，默认 'id'，自动设为行标识并隐藏 */
  rowIdField?: string;
  /** 行选择模式 */
  rowSelection?: 'single' | 'multiple' | false;
  /** 表格高度 */
  height?: string | number;
  /** 是否自适应高度 */
  autoHeight?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否禁用（阻止交互） */
  disabled?: boolean;
  /** 默认每页条数（服务端模式），默认 20 */
  defaultPageSize?: number;
  /** 每页条数选项 */
  pageSizes?: number[];
}

/**
 * ProGrid 组件 Emits 类型定义
 */
export interface ProGridEmits {
  /** 单元格值变更事件 */
  'cell-value-changed': [event: CellValueChangedEvent];
  /** 行选择变更事件 */
  'selection-changed': [selectedRows: Record<string, unknown>[]];
  /** 数据加载完成事件 */
  'data-loaded': [data: Record<string, unknown>[], total: number];
  /** 行点击事件 */
  'row-clicked': [row: Record<string, unknown>];
  /** 行双击事件 */
  'row-double-clicked': [row: Record<string, unknown>];
}

/**
 * 单元格值变更事件
 */
export interface CellValueChangedEvent {
  /** 行数据 */
  data: Record<string, unknown>;
  /** 变更的字段名 */
  field: string;
  /** 旧值 */
  oldValue: unknown;
  /** 新值 */
  newValue: unknown;
}

// 从 ProGridProps 中引用 DataSourceConfig，需要从 datasource.ts 导入
// 此处使用 import 类型会在运行时被擦除，不影响使用
import type { DataSourceConfig } from './datasource';
