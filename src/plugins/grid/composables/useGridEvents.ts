/**
 * plugins/grid/composables/useGridEvents.ts
 *
 * Grid 事件统一处理 composable
 * 将 AG Grid 内部事件转换为 ProGrid 的 emit 事件
 * 处理服务端模式下的排序/筛选事件
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type {
  CellValueChangedEvent as AgCellValueChangedEvent,
  RowClickedEvent as AgRowClickedEvent,
  GridReadyEvent as AgGridReadyEvent,
  GridApi
} from 'ag-grid-community';
import type { SortParam, FilterParam, DataSourceMode } from '../types';

/**
 * 事件处理函数的返回类型
 */
export interface GridEventHandlers {
  /** 单元格值变更事件处理 */
  onCellValueChanged: (event: AgCellValueChangedEvent) => void;
  /** 行选择变更事件处理 */
  onSelectionChanged: () => void;
  /** 排序变更事件处理 */
  onSortChanged: () => void;
  /** 筛选变更事件处理 */
  onFilterChanged: () => void;
  /** 行点击事件处理 */
  onRowClicked: (event: AgRowClickedEvent) => void;
  /** 行双击事件处理 */
  onRowDoubleClicked: (event: AgRowClickedEvent) => void;
  /** Grid 就绪事件处理 */
  onGridReady: (event: AgGridReadyEvent) => void;
}

/**
 * Grid 事件处理 composable
 *
 * @param emit - Vue 组件的 emit 包装函数
 * @param mode - 当前数据模式
 * @param gridApi - Grid API 引用
 * @param updateSort - 排序更新回调
 * @param updateFilter - 筛选更新回调
 * @returns 事件处理函数集合
 */
export function useGridEvents(
  emit: (event: string, ...args: unknown[]) => void,
  mode: { value: DataSourceMode },
  gridApi: { value: GridApi | null },
  updateSort: (sorts: SortParam[]) => Promise<void>,
  updateFilter: (filters: FilterParam[]) => Promise<void>
): GridEventHandlers {
  /**
   * 单元格值变更事件
   * 转换为 ProGrid 的 cell-value-changed 事件
   */
  function onCellValueChanged(event: AgCellValueChangedEvent): void {
    emit('cell-value-changed', {
      data: event.data as Record<string, unknown>,
      field: event.colDef?.field,
      oldValue: event.oldValue,
      newValue: event.newValue
    });
  }

  /**
   * 行选择变更事件
   * 获取所有选中行并触发 selection-changed 事件
   */
  function onSelectionChanged(): void {
    if (!gridApi.value) return;
    const selectedRows = gridApi.value.getSelectedRows();
    emit('selection-changed', selectedRows);
  }

  /**
   * 排序变更事件
   * 服务端模式下触发数据重新获取
   */
  function onSortChanged(): void {
    if (mode.value !== 'server' || !gridApi.value) return;

    // 从 AG Grid 获取当前列排序状态
    const columnState = gridApi.value.getColumnState();
    const sorts: SortParam[] = (columnState || [])
      .filter((col) => col.sort !== null && col.sort !== undefined)
      .map((col) => ({
        field: col.colId || '',
        direction: (col.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
      }))
      .filter((s) => s.field);

    updateSort(sorts);
  }

  /**
   * 筛选变更事件
   * 服务端模式下触发数据重新获取
   */
  function onFilterChanged(): void {
    if (mode.value !== 'server') return;
    // TODO: 从 AG Grid filter API 提取筛选参数传递给 updateFilter
    updateFilter([]);
  }

  /**
   * 行点击事件
   */
  function onRowClicked(event: AgRowClickedEvent): void {
    emit('row-clicked', event.data as Record<string, unknown>);
  }

  /**
   * 行双击事件
   */
  function onRowDoubleClicked(event: AgRowClickedEvent): void {
    emit('row-double-clicked', event.data as Record<string, unknown>);
  }

  /**
   * Grid 就绪事件
   * 保存 Grid API 引用
   */
  function onGridReady(event: AgGridReadyEvent): void {
    gridApi.value = event.api;
  }

  return {
    onCellValueChanged,
    onSelectionChanged,
    onSortChanged,
    onFilterChanged,
    onRowClicked,
    onRowDoubleClicked,
    onGridReady
  };
}
