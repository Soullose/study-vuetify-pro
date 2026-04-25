/**
 * plugins/grid/types/editor.ts
 *
 * 编辑器类型定义 - 单元格编辑器的参数和接口约束
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { Component } from 'vue';
import type { ColumnEditorType, SelectOption } from './column';

/**
 * AG Grid 单元格编辑器参数的基础接口
 */
export interface CellEditorContext {
  /** 当前单元格值 */
  value: unknown;
  /** 行数据对象 */
  data: Record<string, unknown> | undefined;
  /** 列字段名 */
  colDef: {
    field?: string;
    [key: string]: unknown;
  };
  /** 行节点 */
  node: {
    id?: string | number;
    rowIndex: number;
    [key: string]: unknown;
  };
  /** Grid API（v31+ 已合并原 columnApi 功能到此） */
  api: {
    [key: string]: unknown;
  };
  /** 按键事件 */
  keyPress: number | null;
  /** charPress 按键字符 */
  charPress: string | null;
}

/**
 * Text 编辑器参数
 */
export interface TextEditorParams extends CellEditorContext {
  /** 输入框占位文本 */
  placeholder?: string;
  /** 最大长度 */
  maxLength?: number;
}

/**
 * Select 编辑器参数
 */
export interface SelectEditorParams extends CellEditorContext {
  /** 下拉选项列表 */
  options: SelectOption[];
  /** 占位文本 */
  placeholder?: string;
}

/**
 * Date 编辑器参数
 */
export interface DateEditorParams extends CellEditorContext {
  /** 日期格式 */
  format?: string;
  /** 占位文本 */
  placeholder?: string;
}

/**
 * Checkbox 编辑器参数
 */
export interface CheckboxEditorParams extends CellEditorContext {
  /** 复选框颜色 */
  color?: string;
}

/**
 * Switch 编辑器参数
 */
export interface SwitchEditorParams extends CellEditorContext {
  /** 开关颜色 */
  color?: string;
}

/**
 * 编辑器注册项
 */
export interface EditorRegistryItem {
  /** 编辑器 Vue 组件 */
  component: Component;
  /** 创建 cellEditorParams 的工厂函数 */
  createParams?: (columnConfig: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * 编辑器注册表类型
 */
export type EditorRegistry = Record<ColumnEditorType, EditorRegistryItem>;
