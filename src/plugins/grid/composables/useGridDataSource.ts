/**
 * plugins/grid/composables/useGridDataSource.ts
 *
 * 数据源管理 composable
 * 支持前端全量数据和服务端分页/排序/筛选双模式
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import { ref, computed, watch, type Ref } from 'vue';
import type { DataSourceConfig, DataSourceMode, GridFetchParams, GridFetchResult, PaginationState, SortParam, FilterParam } from '../types';

/**
 * 数据源管理 composable
 *
 * @param dataSource - 数据源配置（响应式引用）
 * @param staticData - 前端模式下的静态数据（响应式引用）
 * @returns 数据源管理接口
 */
export function useGridDataSource(dataSource: Ref<DataSourceConfig | undefined>, staticData: Ref<Record<string, unknown>[] | undefined>) {
  /** 当前数据模式 */
  const mode = computed<DataSourceMode>(() => dataSource.value?.mode || 'client');

  /** 行数据 */
  const rowData = ref<Record<string, unknown>[]>([]);

  /** 加载状态 */
  const loading = ref(false);

  /** 分页状态 */
  const pagination = ref<PaginationState>({
    currentPage: 1,
    pageSize: dataSource.value?.pageSize || 20,
    total: 0,
    totalPages: 0
  });

  /** 当前排序参数 */
  const sortParams = ref<SortParam[]>([]);

  /** 当前筛选参数 */
  const filterParams = ref<FilterParam[]>([]);

  /** 每页条数可选项 */
  const pageSizes = computed(() => dataSource.value?.pageSizes || [10, 20, 50, 100]);

  /**
   * 计算总页数
   * @param total - 总记录数
   * @param pageSize - 每页条数
   * @returns 总页数
   */
  function calcTotalPages(total: number, pageSize: number): number {
    if (pageSize <= 0) return 0;
    return Math.ceil(total / pageSize);
  }

  /**
   * 加载服务端数据
   * 调用 fetchData 函数获取分页数据
   */
  async function loadServerData(): Promise<void> {
    if (!dataSource.value?.fetchData) {
      console.warn('[ProGrid] 服务端模式未配置 fetchData 函数');
      return;
    }

    loading.value = true;
    try {
      const params: GridFetchParams = {
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        sort: sortParams.value,
        filter: filterParams.value
      };

      // 应用参数转换钩子
      let fetchParams: GridFetchParams | Record<string, unknown> = params;
      if (dataSource.value.transformParams) {
        fetchParams = dataSource.value.transformParams(params);
      }

      let result: GridFetchResult;

      // 调用数据获取函数
      const rawResult = await dataSource.value.fetchData(fetchParams as GridFetchParams);

      // 应用响应转换钩子
      if (dataSource.value.transformResponse) {
        result = dataSource.value.transformResponse(rawResult);
      } else {
        result = rawResult as GridFetchResult;
      }

      rowData.value = result.rows || [];
      pagination.value = {
        ...pagination.value,
        total: result.total || 0,
        totalPages: calcTotalPages(result.total || 0, pagination.value.pageSize)
      };
    } catch (error) {
      console.error('[ProGrid] 数据加载失败:', error);
      rowData.value = [];
      pagination.value = {
        ...pagination.value,
        total: 0,
        totalPages: 0
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 加载前端数据
   * 直接使用静态数据
   */
  function loadClientData(): void {
    if (staticData.value) {
      rowData.value = [...staticData.value];
      pagination.value = {
        ...pagination.value,
        total: staticData.value.length,
        totalPages: calcTotalPages(staticData.value.length, pagination.value.pageSize)
      };
    } else {
      rowData.value = [];
      pagination.value = {
        ...pagination.value,
        total: 0,
        totalPages: 0
      };
    }
  }

  /**
   * 加载数据（根据当前模式自动选择）
   */
  async function loadData(): Promise<void> {
    if (mode.value === 'server') {
      await loadServerData();
    } else {
      loadClientData();
    }
  }

  /**
   * 翻页
   * @param page - 目标页码
   */
  async function goToPage(page: number): Promise<void> {
    if (page < 1 || page > pagination.value.totalPages) return;
    pagination.value.currentPage = page;
    if (mode.value === 'server') {
      await loadServerData();
    }
  }

  /**
   * 修改每页条数
   * @param size - 新的每页条数
   */
  async function changePageSize(size: number): Promise<void> {
    pagination.value.pageSize = size;
    pagination.value.currentPage = 1; // 切换每页条数时回到第一页
    if (mode.value === 'server') {
      await loadServerData();
    } else {
      loadClientData();
    }
  }

  /**
   * 更新排序参数并重新加载
   * @param sorts - 排序参数列表
   */
  async function updateSort(sorts: SortParam[]): Promise<void> {
    sortParams.value = sorts;
    pagination.value.currentPage = 1;
    if (mode.value === 'server') {
      await loadServerData();
    }
  }

  /**
   * 更新筛选参数并重新加载
   * @param filters - 筛选参数列表
   */
  async function updateFilter(filters: FilterParam[]): Promise<void> {
    filterParams.value = filters;
    pagination.value.currentPage = 1;
    if (mode.value === 'server') {
      await loadServerData();
    }
  }

  /**
   * 刷新当前数据
   */
  async function refresh(): Promise<void> {
    await loadData();
  }

  // 监听静态数据变化（前端模式）
  watch(
    () => staticData.value,
    () => {
      if (mode.value === 'client') {
        loadClientData();
      }
    },
    { deep: true }
  );

  // 监听数据源配置变化
  watch(
    () => dataSource.value,
    (newVal) => {
      if (newVal?.pageSize) {
        pagination.value.pageSize = newVal.pageSize;
      }
    }
  );

  return {
    mode,
    rowData,
    loading,
    pagination,
    sortParams,
    filterParams,
    pageSizes,
    loadData,
    refresh,
    goToPage,
    changePageSize,
    updateSort,
    updateFilter
  };
}
