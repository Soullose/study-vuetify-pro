/**
 * plugins/grid/composables/useGridColumns.ts
 *
 * 列配置管理 composable
 * 收集 ProColumn 注册的列配置，转换为 AG Grid ColDef[]
 * 处理 rowIdField 自动隐藏、渲染器/编辑器自动匹配
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import { ref, computed, type Ref } from 'vue';
import type { ColDef } from 'ag-grid-community';
import type { ColumnConfig, ColumnRendererType, ColumnEditorType } from '../types';
import { getRenderer } from '../renderers';
import { getEditor } from '../editors';

/**
 * 渲染器类型到默认编辑器类型的映射
 * 当用户设置 editable=true 但未指定 editorType 时使用
 */
const RENDERER_TO_EDITOR_MAP: Record<ColumnRendererType, ColumnEditorType> = {
  checkbox: 'checkbox',
  switch: 'switch',
  date: 'date',
  status: 'text',
  template: 'text'
};

/**
 * 列配置管理 composable
 *
 * @param rowIdField - 行 ID 字段名，该字段自动隐藏
 * @returns 列管理接口
 */
export function useGridColumns(rowIdField: Ref<string>) {
  /** 已注册的列配置列表 */
  const columnConfigs = ref<ColumnConfig[]>([]);

  /**
   * 注册一个列配置（由 ProColumn 调用）
   * @param config - 列配置
   */
  function registerColumn(config: ColumnConfig): void {
    const existingIndex = columnConfigs.value.findIndex((c) => c.field === config.field);
    if (existingIndex >= 0) {
      columnConfigs.value[existingIndex] = config;
    } else {
      columnConfigs.value.push(config);
    }
  }

  /**
   * 移除一个列配置（由 ProColumn 卸载时调用）
   * @param field - 列字段名
   */
  function unregisterColumn(field: string): void {
    const index = columnConfigs.value.findIndex((c) => c.field === field);
    if (index >= 0) {
      columnConfigs.value.splice(index, 1);
    }
  }

  /**
   * 将单个 ColumnConfig 转换为 AG Grid ColDef
   *
   * @param config - 列配置
   * @returns AG Grid ColDef 对象
   */
  function columnConfigToColDef(config: ColumnConfig): ColDef {
    const colDef: ColDef = {
      field: config.field,
      headerName: config.header || config.field,
      hide: config.hide || false,
      sortable: config.sortable !== false,
      resizable: config.resizable !== false
    };

    // 设置列宽
    if (config.width !== undefined) {
      colDef.width = typeof config.width === 'number' ? config.width : parseInt(config.width, 10);
    }
    if (config.minWidth !== undefined) {
      colDef.minWidth = typeof config.minWidth === 'number' ? config.minWidth : parseInt(config.minWidth, 10);
    }
    if (config.maxWidth !== undefined) {
      colDef.maxWidth = typeof config.maxWidth === 'number' ? config.maxWidth : parseInt(config.maxWidth, 10);
    }
    if (config.flex !== undefined) {
      colDef.flex = config.flex;
    }

    // 设置固定列
    if (config.pinned !== undefined) {
      colDef.pinned = config.pinned === true ? 'left' : config.pinned === false ? null : config.pinned;
    }

    // 设置单元格样式类
    if (config.cellClass !== undefined) {
      colDef.cellClass = config.cellClass;
    }

    // 设置文本对齐
    if (config.align) {
      colDef.headerClass = `text-${config.align}`;
      colDef.cellClass = Array.isArray(colDef.cellClass)
        ? [...colDef.cellClass, `text-${config.align}`]
        : colDef.cellClass
          ? [colDef.cellClass as string, `text-${config.align}`]
          : `text-${config.align}`;
    }

    // 将 ColumnConfig 展开为 Record<string, unknown> 用于参数创建
    const configRecord: Record<string, unknown> = { ...config };

    // 处理渲染器
    if (config.type) {
      const rendererItem = getRenderer(config.type);
      if (rendererItem) {
        colDef.cellRenderer = rendererItem.component;
        const rendererParams = rendererItem.createParams ? rendererItem.createParams(configRecord) : {};
        colDef.cellRendererParams = rendererParams;
      }
    }

    // 处理编辑器
    if (config.editable) {
      const editorType: ColumnEditorType = config.editorType || (config.type ? RENDERER_TO_EDITOR_MAP[config.type] : 'text');

      const editorItem = getEditor(editorType);
      if (editorItem) {
        colDef.editable = true;
        colDef.cellEditor = editorItem.component;
        const editorParams = editorItem.createParams ? editorItem.createParams(configRecord) : {};
        colDef.cellEditorParams = editorParams;
      } else {
        colDef.editable = true;
      }
    }

    return colDef;
  }

  /**
   * 计算属性 - 最终的 AG Grid ColDef 数组
   *
   * 处理逻辑：
   * 1. 过滤掉 rowIdField 对应的列（自动隐藏）
   * 2. 将 ColumnConfig 转换为 ColDef
   */
  const columnDefs = computed<ColDef[]>(() => {
    return columnConfigs.value.filter((config) => config.field !== rowIdField.value).map(columnConfigToColDef);
  });

  return {
    columnConfigs,
    columnDefs,
    registerColumn,
    unregisterColumn
  };
}
