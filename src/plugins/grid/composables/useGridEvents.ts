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
  FilterChangedEvent as AgFilterChangedEvent,
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
  onFilterChanged: (event: AgFilterChangedEvent) => void;
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
   * 服务端模式下，从 AG Grid filter model 提取筛选参数并触发数据重新获取
   *
   * AG Grid 的 getFilterModel() 返回 { [field]: FilterModel }，
   * 这里将其转换为统一的 FilterParam[] 中间格式，交由页面的 transformParams
   * 进一步转换为后端所需的查询参数。职责分层：本层只做「AG Grid → 标准格式」。
   */
  function onFilterChanged(event: AgFilterChangedEvent): void {
    if (mode.value !== 'server') return;
    if (!event.api) return;

    const filterModel = event.api.getFilterModel();
    const filters = parseFilterModel(filterModel);

    updateFilter(filters);
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

// ==================== 辅助函数 ====================

/**
 * AG Grid 单列 filter model 的最小结构（按需取用，保持宽松类型）
 *
 * AG Grid 不同 filter（text/number/date/set/multi）的 model 字段略有差异：
 * - text/date/number（scalar filter）：filter、filterTo、type
 * - set filter：values（数组）
 * 这里用索引签名统一描述，按 filterType / 字段存在性分别处理。
 */
interface AgFilterModel {
  filterType?: string;
  type?: string;
  /** 主筛选值（scalar filter） */
  filter?: unknown;
  /** 范围筛选的第二值（inRange 时使用） */
  filterTo?: unknown;
  /** set filter 的选中值数组 */
  values?: unknown[];
  /** 其它可能的字段 */
  [key: string]: unknown;
}

/** AG Grid 的 getFilterModel() 返回结构：字段名 → 该列的 filter model */
type AgFilterModelMap = Record<string, AgFilterModel>;

/**
 * 将 AG Grid 的 filter model 转换为统一的 FilterParam[]
 *
 * 转换规则：
 * - scalar filter（text/number/date）：取 filter 为主值；type 为 inRange 时取 filterTo 为第二值
 *   AG Grid 的 type（contains/equals/startsWith/greaterThan/lessThan/inRange 等）
 *   与 FilterParam.type 基本对齐，未知类型兜底为 contains
 * - set filter：把 values 数组作为 value，type 设为 equals（表示「在这些值之中」）
 * - 空值（filter 为空/null）跳过，不产生筛选条件
 *
 * @param filterModel - AG Grid api.getFilterModel() 的返回值
 * @returns 统一格式的筛选参数列表
 */
function parseFilterModel(filterModel: AgFilterModelMap | null | undefined): FilterParam[] {
  if (!filterModel) return [];

  const filters: FilterParam[] = [];

  for (const [field, model] of Object.entries(filterModel)) {
    if (!model || typeof model !== 'object') continue;

    // set filter：多选值列表
    if (Array.isArray(model.values)) {
      if (model.values.length === 0) continue;
      filters.push({
        field,
        type: 'equals',
        value: model.values
      });
      continue;
    }

    // scalar filter（text/number/date）：主值 filter
    if (model.filter === null || model.filter === undefined || model.filter === '') continue;

    const rawType = typeof model.type === 'string' ? model.type : 'contains';
    // 校验 type 是否在 FilterParam 允许的集合内，否则兜底 contains
    const validTypes: FilterParam['type'][] = [
      'contains', 'equals', 'startsWith', 'endsWith',
      'notContains', 'notEqual', 'greaterThan', 'lessThan', 'inRange'
    ];
    const type: FilterParam['type'] = (validTypes as string[]).includes(rawType)
      ? (rawType as FilterParam['type'])
      : 'contains';

    const param: FilterParam = {
      field,
      type,
      value: model.filter
    };

    // 范围筛选的第二值
    if (type === 'inRange' && model.filterTo !== null && model.filterTo !== undefined) {
      param.valueTo = model.filterTo;
    }

    filters.push(param);
  }

  return filters;
}

