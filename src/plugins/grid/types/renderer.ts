/**
 * plugins/grid/types/renderer.ts
 *
 * 渲染器类型定义 - 单元格渲染器的参数和接口约束
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { Component } from 'vue';
import type { ColumnRendererType, StatusMap } from './column';

/**
 * AG Grid 单元格渲染器参数的基础接口
 * 扩展自 AG Grid 的 ICellRendererParams，添加自定义属性
 */
export interface CellRendererContext {
  /** 单元格值 */
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
    isSelected: () => boolean;
    [key: string]: unknown;
  };
  /** Grid API（v31+ 已合并原 columnApi 功能到此） */
  api: {
    [key: string]: unknown;
  };
  /** 渲染器自定义参数（从 colDef.cellRendererParams 传入） */
  context: Record<string, unknown>;
}

/**
 * Checkbox 渲染器参数
 */
export interface CheckboxRendererParams extends CellRendererContext {
  /** 复选框颜色 */
  color?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * Switch 渲染器参数
 */
export interface SwitchRendererParams extends CellRendererContext {
  /** 开关颜色 */
  color?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * Date 渲染器参数
 */
export interface DateRendererParams extends CellRendererContext {
  /** 日期格式化字符串，默认 'YYYY-MM-DD' */
  format?: string;
  /** 空值时显示的占位文本 */
  placeholder?: string;
}

/**
 * Status 渲染器参数
 */
export interface StatusRendererParams extends CellRendererContext {
  /** 状态映射表 */
  statusMap: StatusMap;
  /** v-chip 尺寸 */
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
  /** 未匹配到 statusMap 时的默认颜色 */
  defaultColor?: string;
  /** 未匹配到 statusMap 时的默认文本（默认显示原始值） */
  defaultText?: string;
}

/**
 * Template 渲染器参数
 */
export interface TemplateRendererParams extends CellRendererContext {
  /** 自定义渲染函数 */
  templateRender?: (data: Record<string, unknown>) => unknown;
}

/**
 * 渲染器注册项
 */
export interface RendererRegistryItem {
  /** 渲染器 Vue 组件 */
  component: Component;
  /** 创建 cellRendererParams 的工厂函数 */
  createParams?: (columnConfig: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * 渲染器注册表类型
 */
export type RendererRegistry = Record<ColumnRendererType, RendererRegistryItem>;
