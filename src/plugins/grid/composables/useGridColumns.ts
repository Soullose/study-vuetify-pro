/**
 * plugins/grid/composables/useGridColumns.ts
 *
 * 列配置管理 composable — 收集 ProColumn 注册的列配置并转换为 AG Grid ColDef[]
 * 不依赖任何 Vuetify 组件或渲染器/编辑器注册表
 *
 * @author Architecture Team
 * @date 2026-05-07
 */

import { ref, computed, type Ref } from 'vue'
import type { ColDef } from 'ag-grid-community'
import type { ColumnConfig } from '../types'

/**
 * 列配置管理 composable
 *
 * @param rowIdField - 行 ID 字段名，该字段自动隐藏
 * @returns 列管理接口
 */
export function useGridColumns(rowIdField: Ref<string>) {
  /** 已注册的列配置列表 */
  const columnConfigs = ref<ColumnConfig[]>([])

  /**
   * 注册一个列配置（由 ProColumn 调用）
   */
  function registerColumn(config: ColumnConfig): void {
    const existingIndex = columnConfigs.value.findIndex((c) => c.field === config.field)
    if (existingIndex >= 0) {
      columnConfigs.value[existingIndex] = config
    } else {
      columnConfigs.value.push(config)
    }
  }

  /**
   * 移除一个列配置（由 ProColumn 卸载时调用）
   */
  function unregisterColumn(field: string): void {
    const index = columnConfigs.value.findIndex((c) => c.field === field)
    if (index >= 0) {
      columnConfigs.value.splice(index, 1)
    }
  }

  /**
   * 将单个 ColumnConfig 转换为 AG Grid ColDef
   *
   * 优先级：colDef 透传属性 > 快捷属性
   */
  function columnConfigToColDef(config: ColumnConfig): ColDef {
    // 基座：colDef 透传（用户可直接覆盖任何 AG Grid 属性）
    const colDef: ColDef = {
      field: config.field,
      headerName: config.header || config.field,
      hide: config.hide || false,
      sortable: config.sortable !== false,
      resizable: config.resizable !== false,
      // colDef 中可能已有 cellRenderer/cellEditor 等，展开合并
      ...(config.colDef || {}),
    }

    // 快捷属性覆盖（仅在 colDef 未显式设置时生效）
    if (config.width !== undefined && colDef.width === undefined) {
      colDef.width = typeof config.width === 'number' ? config.width : parseInt(config.width, 10)
    }
    if (config.minWidth !== undefined && colDef.minWidth === undefined) {
      colDef.minWidth = typeof config.minWidth === 'number' ? config.minWidth : parseInt(config.minWidth, 10)
    }
    if (config.maxWidth !== undefined && colDef.maxWidth === undefined) {
      colDef.maxWidth = typeof config.maxWidth === 'number' ? config.maxWidth : parseInt(config.maxWidth, 10)
    }
    if (config.flex !== undefined && colDef.flex === undefined) {
      colDef.flex = config.flex
    }
    if (config.pinned !== undefined && colDef.pinned === undefined) {
      colDef.pinned = config.pinned === true ? 'left' : config.pinned === false ? null : config.pinned
    }
    if (config.editable !== undefined && colDef.editable === undefined) {
      colDef.editable = config.editable
    }

    // 单元格样式类
    if (config.cellClass !== undefined && colDef.cellClass === undefined) {
      colDef.cellClass = config.cellClass
    }

    // 文本对齐
    if (config.align) {
      const alignClass = `text-${config.align}`
      if (!colDef.headerClass) {
        colDef.headerClass = alignClass
      }
      if (colDef.cellClass === undefined) {
        colDef.cellClass = alignClass
      }
    }

    return colDef
  }

  /**
   * 计算属性 — 最终的 AG Grid ColDef 数组
   *
   * 处理逻辑：
   * 1. 过滤掉 rowIdField 对应的列（自动隐藏）
   * 2. 将 ColumnConfig 转换为 ColDef
   */
  const columnDefs = computed<ColDef[]>(() => {
    return columnConfigs.value
      .filter((config) => config.field !== rowIdField.value)
      .map(columnConfigToColDef)
  })

  return {
    columnConfigs,
    columnDefs,
    registerColumn,
    unregisterColumn,
  }
}
