/**
 * plugins/grid/index.ts
 *
 * Grid 插件注册入口
 * 注册 AG Grid Community 模块，导出 ProGrid、ProColumn 组件及类型定义
 * 不依赖任何 Vuetify 组件
 *
 * @author Architecture Team
 * @date 2026-05-07
 */

import type { App } from 'vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
// 导入 AG Grid v33 样式（Quartz 主题）
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import ProGrid from './components/ProGrid.vue'
import ProColumn from './components/ProColumn.vue'

// 注册 AG Grid Community 所有功能模块
ModuleRegistry.registerModules([AllCommunityModule])

/**
 * 安装 Grid 插件
 * 将 ProGrid 和 ProColumn 注册为全局组件
 */
export function installGridPlugin(app: App): void {
  app.component('ProGrid', ProGrid)
  app.component('ProColumn', ProColumn)
}

// 导出组件
export { ProGrid, ProColumn }

// 导出类型
export type {
  ProColumnProps,
  ColumnConfig,
  ProGridProps,
  ProGridEmits,
  CellValueChangedEvent
} from './types'

export type {
  DataSourceMode,
  SortParam,
  FilterParam,
  GridFetchParams,
  GridFetchResult,
  DataSourceConfig,
  PaginationState
} from './types'

// 导出 composables（供高级用户直接使用）
export { useGridColumns } from './composables/useGridColumns'
export { useGridDataSource } from './composables/useGridDataSource'
export { useGridEvents } from './composables/useGridEvents'

// 导出工具函数
export { formatDate, isTruthy } from './utils/helpers'
