/**
 * plugins/grid/types/datasource.ts
 *
 * 数据源类型定义 - 前端/服务端双模式数据获取的类型约束
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

/**
 * 数据源模式
 * - client: 前端全量数据，AG Grid 内置排序/筛选/分页
 * - server: 服务端数据，通过 fetchData 获取分页/排序/筛选结果
 */
export type DataSourceMode = 'client' | 'server';

/**
 * 排序参数
 */
export interface SortParam {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  direction: 'asc' | 'desc';
}

/**
 * 筛选参数
 */
export interface FilterParam {
  /** 筛选字段 */
  field: string;
  /** 筛选类型 */
  type: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains' | 'notEqual' | 'greaterThan' | 'lessThan' | 'inRange';
  /** 筛选值 */
  value: unknown;
  /** 第二个筛选值（用于 inRange 类型） */
  valueTo?: unknown;
}

/**
 * 数据获取请求参数 - 传递给 fetchData 函数
 */
export interface GridFetchParams {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 排序参数列表 */
  sort: SortParam[];
  /** 筛选参数列表 */
  filter: FilterParam[];
}

/**
 * 数据获取返回结果 - fetchData 函数的返回值
 */
export interface GridFetchResult<T = Record<string, unknown>> {
  /** 数据行列表 */
  rows: T[];
  /** 总记录数（用于分页计算） */
  total: number;
}

/**
 * 数据源配置
 */
export interface DataSourceConfig {
  /** 数据源模式 */
  mode: DataSourceMode;
  /** 服务端模式下的数据获取函数 */
  fetchData?: (params: GridFetchParams) => Promise<GridFetchResult>;
  /** 每页条数，默认 20 */
  pageSize?: number;
  /** 每页条数可选项 */
  pageSizes?: number[];
  /** 是否自动首次加载，默认 true */
  autoLoad?: boolean;
  /** 请求参数转换钩子 - 允许用户自定义参数格式 */
  transformParams?: (params: GridFetchParams) => Record<string, unknown>;
  /** 响应数据转换钩子 - 允许用户自定义响应解析 */
  transformResponse?: (response: unknown) => GridFetchResult;
}

/**
 * 分页状态
 */
export interface PaginationState {
  /** 当前页码（从 1 开始） */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
  /** 总记录数 */
  total: number;
  /** 总页数 */
  totalPages: number;
}
