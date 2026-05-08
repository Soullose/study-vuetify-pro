<!--
  pages/test/grid-demo-full.vue

  ProGrid 完整功能演示 — 覆盖全部用法
  =========================================
  ① 基础列配置（所有快捷 props）
  ② colDef 透传 + 内置渲染器/编辑器
  ③ 自定义 Vue 渲染器（状态标签/进度条/评分/头像/操作按钮）
  ④ 自定义 Vue 编辑器（下拉选择/数字输入）
  ⑤ 前端数据模式
  ⑥ 服务端分页 + 排序 + 筛选
  ⑦ 事件日志 + 暴露 API 外部控制

  @author Architecture Team
  @date 2026-05-07
-->
<template>
  <v-container fluid class="pa-4">
    <!-- ==================== 页面标题 ==================== -->
    <div class="d-flex align-center mb-6">
      <h2 class="text-h5">ProGrid 完整功能演示</h2>
      <v-spacer />
      <v-chip size="small" color="primary" variant="tonal">
        AG Grid + Vue 3 纯封装（零 Vuetify 依赖）
      </v-chip>
    </div>

    <!-- ================================================================================== -->
    <!-- ① 基础列配置：展示所有 ProColumn 快捷 props                                         -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-puzzle</v-icon>
        <span class="text-subtitle-1 font-weight-bold">① 基础列配置</span>
        <span class="text-caption text-medium-emphasis ml-2">
          field / header / width / minWidth / maxWidth / flex / hide / pinned / sortable / filterable / resizable / cellClass / align
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid :data="basicData" :height="320" :show-pagination="false">
          <!-- 基础文本列 -->
          <ProColumn field="name" header="姓名" :width="80" align="center" />
          <ProColumn field="email" header="邮箱" :min-width="180" />
          <!-- flex 弹性列 -->
          <ProColumn field="department" header="部门" :flex="1" />
          <!-- 隐藏列（id 自动隐藏） -->
          <!-- pinned 固定列 -->
          <ProColumn field="age" header="年龄" :width="70" align="center" pinned="right" />
          <!-- sortable + filterable -->
          <ProColumn field="salary" header="薪资" :width="110" sortable filterable
            :col-def="{ type: 'numericColumn' }" />
          <!-- cellClass 函数需走 colDef 透传 -->
          <ProColumn field="active" header="在职" :width="70" align="center"
            :col-def="{ cellClass: (p: any) => p.value ? 'text-green' : 'text-grey' }" />
          <!-- resizable 禁止 -->
          <ProColumn field="joinDate" header="入职日期" :width="130" :resizable="false" />
        </ProGrid>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ② colDef 透传 + AG Grid 内置渲染器/编辑器                                          -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-cog-transfer</v-icon>
        <span class="text-subtitle-1 font-weight-bold">② colDef 透传 + AG Grid 内置功能</span>
        <span class="text-caption text-medium-emphasis ml-2">
          内置 cellRenderer / cellEditor / filter / valueFormatter / valueGetter / valueSetter
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid :data="basicData" :height="360" :show-pagination="false">
          <!-- valueFormatter 格式化 -->
          <ProColumn field="salary" header="薪资(formatter)" :width="140"
            :col-def="{ valueFormatter: (p: any) => `¥${p.value?.toLocaleString()}` }" />
          <!-- agCheckboxCellRenderer + agCheckboxCellEditor -->
          <ProColumn field="active" header="在职" :width="80" editable
            :col-def="{
              cellRenderer: 'agCheckboxCellRenderer',
              cellEditor: 'agCheckboxCellEditor',
            }" />
          <!-- agAnimateShowChangeCellRenderer -->
          <ProColumn field="age" header="年龄(动画)" :width="100"
            :col-def="{ cellRenderer: 'agAnimateShowChangeCellRenderer' }" />
          <!-- 内置 number filter -->
          <ProColumn field="salary" header="薪资(数字筛选)" :width="160" filterable
            :col-def="{ filter: 'agNumberColumnFilter', filterParams: { buttons: ['apply', 'reset'] } }" />
          <!-- 内置 set filter (下拉多选) -->
          <ProColumn field="department" header="部门(集合筛选)" :width="160" filterable
            :col-def="{ filter: 'agSetColumnFilter' }" />
          <!-- 内置 date filter -->
          <ProColumn field="joinDate" header="入职日期(日期筛选)" :width="180" filterable
            :col-def="{ filter: 'agDateColumnFilter' }" />
        </ProGrid>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ③ 自定义 Vue 渲染器                                                               -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-brush</v-icon>
        <span class="text-subtitle-1 font-weight-bold">③ 自定义 Vue 渲染器</span>
        <span class="text-caption text-medium-emphasis ml-2">
          状态标签 / 进度条 / 评分星 / 头像 / 操作按钮 — 纯 HTML/CSS，零 Vuetify
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid :data="basicData" :height="400">
          <!-- 状态标签 -->
          <ProColumn field="status" header="状态" :width="90"
            :col-def="{ cellRenderer: StatusPillRenderer }" />
          <!-- 进度条 -->
          <ProColumn field="progress" header="进度" :width="140"
            :col-def="{ cellRenderer: ProgressBarRenderer }" />
          <!-- 评分星 -->
          <ProColumn field="rating" header="评分" :width="130"
            :col-def="{ cellRenderer: RatingStarRenderer }" />
          <!-- 头像 -->
          <ProColumn field="avatar" header="头像" :width="70"
            :col-def="{
              cellRenderer: AvatarRenderer,
              cellRendererParams: { nameField: 'name' }
            }" />
          <!-- 操作按钮 -->
          <ProColumn field="id" header="操作" :width="120" pinned="right"
            :col-def="{
              cellRenderer: ActionBtnRenderer,
              cellRendererParams: {
                onView: (data: any) => addLog('操作', `查看: ${data.name}`, 'primary'),
                onEdit: (data: any) => addLog('操作', `编辑: ${data.name}`, 'warning'),
              }
            }" />
        </ProGrid>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ④ 自定义 Vue 编辑器                                                               -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-pencil-box</v-icon>
        <span class="text-subtitle-1 font-weight-bold">④ 自定义 Vue 编辑器</span>
        <span class="text-caption text-medium-emphasis ml-2">
          下拉选择编辑器 / 数字滑块编辑器 — 实现 AG Grid ICellEditorComp 接口
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid :data="basicData" :height="360"
          @cell-value-changed="onCellChanged">
          <!-- 自定义下拉编辑 -->
          <ProColumn field="level" header="级别" :width="90" editable
            :col-def="{
              cellEditor: LevelSelectEditor,
              cellRenderer: LevelLabelRenderer,
            }" />
          <!-- 自定义数字编辑 -->
          <ProColumn field="progress" header="进度(滑块)" :width="160" editable
            :col-def="{ cellEditor: ProgressSliderEditor }" />
          <ProColumn field="name" header="姓名" :width="80" />
          <ProColumn field="department" header="部门" :width="100" />
        </ProGrid>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ⑤ 前端数据模式                                                                   -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-code-braces</v-icon>
        <span class="text-subtitle-1 font-weight-bold">⑤ 前端数据模式</span>
        <span class="text-caption text-medium-emphasis ml-2">
          mode='client' + autoHeight + 分页（AG Grid 内置）
        </span>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid
          :data="richClientData"
          :height="300"
          row-id-field="id"
          row-selection="multiple"
          @selection-changed="onSelectionChanged"
        >
          <ProColumn field="name" header="名称" :width="100" />
          <ProColumn field="type" header="分类" :width="80" />
          <ProColumn field="status" header="状态"
            :col-def="{ cellRenderer: StatusPillRenderer }" :width="80" />
          <ProColumn field="active" header="启用" editable :width="70"
            :col-def="{
              cellRenderer: 'agCheckboxCellRenderer',
              cellEditor: 'agCheckboxCellEditor',
            }" />
          <ProColumn field="progress" header="进度" :width="120"
            :col-def="{ cellRenderer: ProgressBarRenderer }" />
          <ProColumn field="date" header="日期" :width="110"
            :col-def="{ cellRenderer: DateFormatRenderer }" />
          <ProColumn field="rating" header="评分" :width="110"
            :col-def="{ cellRenderer: RatingStarRenderer }" />
        </ProGrid>
        <div class="pa-2 text-caption text-medium-emphasis">
          已选择: {{ selectedCount }} 项
          <span v-if="selectedRows.length" class="ml-2">
            — {{ selectedRows.map((r: any) => r.name).join(', ') }}
          </span>
        </div>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ⑥ 服务端分页模式                                                                 -->
    <!-- ================================================================================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
        <v-icon start size="small">mdi-server</v-icon>
        <span class="text-subtitle-1 font-weight-bold">⑥ 服务端分页 + 排序 + 筛选</span>
        <span class="text-caption text-medium-emphasis ml-2">
          mode='server' + 工具栏 + 排序/筛选自动请求后端
        </span>
        <v-spacer />
        <v-btn size="small" variant="tonal" color="primary" @click="refreshServerGrid">
          <v-icon start size="small">mdi-refresh</v-icon>
          刷新
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <ProGrid
          ref="serverGridRef"
          :data-source="serverDataSource"
          :height="450"
          row-id-field="id"
          row-selection="single"
          @data-loaded="onServerDataLoaded"
          @row-clicked="onServerRowClicked"
          @row-double-clicked="onServerRowDblClicked"
        >
          <!-- 工具栏插槽 -->
          <template #toolbar>
            <div class="d-flex align-center ga-2 pa-1">
              <span class="text-caption font-weight-bold">👥 员工列表</span>
              <v-spacer />
              <span class="text-caption text-medium-emphasis">
                共 {{ serverTotal }} 条
              </span>
            </div>
          </template>

          <!-- 头像 + 姓名（自定义渲染） -->
          <ProColumn field="avatar" header="" :width="50"
            :col-def="{ cellRenderer: AvatarRenderer, cellRendererParams: { nameField: 'name' } }" />
          <ProColumn field="name" header="姓名" :width="80" sortable />
          <ProColumn field="email" header="邮箱" :min-width="180" />
          <ProColumn field="department" header="部门" :width="90" filterable sortable
            :col-def="{ filter: 'agSetColumnFilter' }" />
          <ProColumn field="level" header="级别" :width="70" filterable
            :col-def="{
              cellRenderer: LevelLabelRenderer,
              filter: 'agSetColumnFilter',
            }" />
          <!-- 状态标签 -->
          <ProColumn field="status" header="状态" :width="80" filterable
            :col-def="{
              cellRenderer: StatusPillRenderer,
              filter: 'agSetColumnFilter',
            }" />
          <!-- 数值列排序 + 渲染 -->
          <ProColumn field="salary" header="薪资" :width="110" sortable
            :col-def="{
              valueFormatter: (p: any) => `¥${p.value?.toLocaleString()}`,
              cellClass: (p: any) => p.value > 20000 ? 'text-red font-weight-bold' : '',
            }" />
          <ProColumn field="age" header="年龄" :width="60" sortable />
          <ProColumn field="joinDate" header="入职日期" :width="110" sortable
            :col-def="{ cellRenderer: DateFormatRenderer }" />
          <ProColumn field="progress" header="完成度" :width="130"
            :col-def="{ cellRenderer: ProgressBarRenderer }" />
          <ProColumn field="region" header="区域" :width="70"
            :col-def="{
              cellRenderer: RegionTagRenderer,
              filter: 'agSetColumnFilter',
            }" />
        </ProGrid>
      </v-card-text>
    </v-card>

    <!-- ================================================================================== -->
    <!-- ⑦ 事件日志 + 暴露 API 外部控制                                                    -->
    <!-- ================================================================================== -->
    <v-row>
      <!-- 事件日志 -->
      <v-col cols="12" md="8">
        <v-card variant="outlined" style="height: 100%;">
          <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
            <v-icon start size="small">mdi-text-box-outline</v-icon>
            <span class="text-subtitle-1 font-weight-bold">⑦ 事件日志</span>
            <span class="text-caption text-medium-emphasis ml-2">
              cell-value-changed / selection-changed / data-loaded / row-clicked / row-double-clicked
            </span>
            <v-spacer />
            <v-btn size="x-small" variant="text" @click="clearLogs">清空</v-btn>
          </v-card-title>
          <v-card-text style="max-height: 280px; overflow-y: auto;">
            <div v-if="eventLog.length === 0" class="text-body-2 text-medium-emphasis pa-4 text-center">
              📋 操作上方表格以查看事件...
            </div>
            <div v-for="(log, idx) in eventLog.slice(-30).reverse()" :key="idx"
              class="d-flex align-start ga-2 py-1" style="border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" :color="log.color" variant="tonal" class="mt-1" style="flex-shrink: 0;">
                {{ log.type }}
              </v-chip>
              <div style="min-width: 0;">
                <span class="text-caption" style="word-break: break-all;">{{ log.message }}</span>
                <span class="text-caption text-disabled ml-2">{{ log.time }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 暴露 API 控制面板 -->
      <v-col cols="12" md="4">
        <v-card variant="outlined" style="height: 100%;">
          <v-card-title class="d-flex align-center py-2 px-4 bg-grey-lighten-4">
            <v-icon start size="small">mdi-api</v-icon>
            <span class="text-subtitle-1 font-weight-bold">暴露 API</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column ga-2">
              <v-btn size="small" variant="tonal" block @click="apiRefresh">
                <v-icon start size="small">mdi-refresh</v-icon>
                refresh() — 刷新数据
              </v-btn>
              <v-btn size="small" variant="tonal" block @click="apiGetSelected">
                <v-icon start size="small">mdi-checkbox-marked</v-icon>
                gridApi.getSelectedRows()
              </v-btn>
              <v-btn size="small" variant="tonal" block @click="apiExportCsv">
                <v-icon start size="small">mdi-file-delimited</v-icon>
                gridApi.exportDataAsCsv()
              </v-btn>
              <v-btn size="small" variant="tonal" block @click="apiAutoSizeAll">
                <v-icon start size="small">mdi-arrow-expand-horizontal</v-icon>
                gridApi.autoSizeAllColumns()
              </v-btn>
              <v-divider class="my-1" />
              <div class="text-caption">
                <div><strong>API 状态:</strong></div>
                <div>• loading: {{ apiLoadingState }}</div>
                <div>• rowData 条数: {{ apiRowCount }}</div>
                <div>• pagination: {{ apiPageInfo }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- ===================================================================================== -->
<script setup lang="ts">
/**
 * ProGrid 完整功能演示
 *
 * 覆盖：
 * ① 所有 ProColumn 快捷 props
 * ② colDef 透传 + AG Grid 内置 cellRenderer/cellEditor/filter/formatter
 * ③ 自定义 Vue 渲染器（状态标签/进度条/评分星/头像/操作按钮）
 * ④ 自定义 Vue 编辑器（下拉选择/数字滑块）
 * ⑤ 前端数据模式 + 行选择
 * ⑥ 服务端分页排序筛选 + 工具栏
 * ⑦ 事件日志 + 暴露 API 外部控制
 */

import { ref, reactive, computed, defineComponent, h } from 'vue'
import type {
  DataSourceConfig,
  CellValueChangedEvent,
} from '@/plugins/grid'

// ====================================================================
// 事件日志
// ====================================================================

interface LogItem { type: string; message: string; color: string; time: string }

const eventLog = ref<LogItem[]>([])

function addLog(type: string, message: string, color = 'info'): void {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  eventLog.value.push({ type, message, color, time })
  if (eventLog.value.length > 100) eventLog.value = eventLog.value.slice(-100)
}

function clearLogs(): void { eventLog.value = [] }

// ====================================================================
// 基础数据（①②③④ 共用）
// ====================================================================

const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部']
const statuses = ['active', 'inactive', 'pending', 'archived']
const levelsArr = ['junior', 'mid', 'senior', 'lead']

const basicData = ref(
  Array.from({ length: 15 }, (_, i) => ({
    id: `r${i + 1}`,
    name: `员工${i + 1}`,
    email: `user${i + 1}@company.com`,
    age: 22 + (i % 20),
    salary: Math.round((8000 + (i % 10) * 1500) * 100) / 100,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    active: i % 5 !== 0,
    joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString(),
    progress: Math.round((i % 10) * 11.11),
    rating: 1 + (i % 5),
    level: levelsArr[i % levelsArr.length],
    region: ['east', 'west', 'north', 'south'][i % 4],
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    description: `${departments[i % departments.length]}工程师`,
  }))
)

// ====================================================================
// ⑤ 前端模式数据
// ====================================================================

const richClientData = ref([
  { id: 'm1', name: '数据备份服务', type: '定时任务', status: 'active', active: true, progress: 88, date: '2026-04-19T08:00:00Z', rating: 5 },
  { id: 'm2', name: '日志清理器', type: '运维工具', status: 'inactive', active: false, progress: 22, date: '2026-04-18T10:30:00Z', rating: 2 },
  { id: 'm3', name: '邮件推送引擎', type: '消息服务', status: 'active', active: true, progress: 95, date: '2026-04-19T09:15:00Z', rating: 4 },
  { id: 'm4', name: '报表生成器', type: '批处理', status: 'pending', active: false, progress: 55, date: '2026-04-17T14:00:00Z', rating: 3 },
  { id: 'm5', name: '缓存刷新', type: '运维工具', status: 'active', active: true, progress: 100, date: '2026-04-19T07:45:00Z', rating: 5 },
  { id: 'm6', name: '用户同步', type: '定时任务', status: 'archived', active: false, progress: 0, date: '2026-03-10T02:00:00Z', rating: 1 },
  { id: 'm7', name: '安全扫描', type: '安全工具', status: 'active', active: true, progress: 72, date: '2026-04-20T01:00:00Z', rating: 4 },
  { id: 'm8', name: '数据库备份', type: '定时任务', status: 'inactive', active: false, progress: 33, date: '2026-04-15T03:00:00Z', rating: 2 },
])

const selectedRows = ref<Record<string, unknown>[]>([])
const selectedCount = computed(() => selectedRows.value.length)

function onSelectionChanged(rows: Record<string, unknown>[]): void {
  selectedRows.value = rows
  addLog('选择变更', `选中 ${rows.length} 行`, 'info')
}

// ====================================================================
// ④ 单元格变更事件
// ====================================================================

function onCellChanged(event: CellValueChangedEvent): void {
  addLog('值变更', `字段 ${event.field}: ${JSON.stringify(event.oldValue)}→${JSON.stringify(event.newValue)}`, 'warning')
}

// ====================================================================
// ⑥ 服务端数据源
// ====================================================================

const serverTotal = ref(0)
const serverGridRef = ref<InstanceType<typeof import('@/plugins/grid').ProGrid> | null>(null)

const serverDataSource = reactive<DataSourceConfig>({
  mode: 'server',
  pageSize: 15,
  pageSizes: [10, 15, 20, 50],
  autoLoad: true,
  fetchData: async (params) => {
    const q = new URLSearchParams()
    q.set('page', String(params.page))
    q.set('pageSize', String(params.pageSize))
    if (params.sort.length > 0) {
      q.set('sortField', params.sort[0].field)
      q.set('sortOrder', params.sort[0].direction)
    }
    const resp = await fetch(`/api/grid-full-demo/employees?${q.toString()}`)
    const result = await resp.json()
    addLog('数据加载', `服务端返回第${params.page}页，${result.data.rows.length} 条`, 'success')
    return { rows: result.data.rows, total: result.data.total }
  },
})

function onServerDataLoaded(_data: Record<string, unknown>[], total: number): void {
  serverTotal.value = total
}

function onServerRowClicked(row: Record<string, unknown>): void {
  addLog('行点击', `单击: ${row.name}`, 'info')
}

function onServerRowDblClicked(row: Record<string, unknown>): void {
  addLog('行双击', `双击: ${row.name}`, 'primary')
}

function refreshServerGrid(): void {
  serverGridRef.value?.refresh()
  addLog('API', '手动刷新服务端数据', 'primary')
}

// ====================================================================
// ⑦ 暴露 API 控制
// ====================================================================

const apiLoadingState = ref('—')
const apiRowCount = ref(0)
const apiPageInfo = ref('—')

function apiRefresh(): void {
  serverGridRef.value?.refresh()
  addLog('API', 'refresh() 已调用', 'primary')
}

function apiGetSelected(): void {
  const api = serverGridRef.value?.gridApi
  if (api) {
    const rows = api.getSelectedRows()
    addLog('API', `getSelectedRows() → ${rows.length} 行`, 'info')
    apiLoadingState.value = '已查询'
    apiRowCount.value = rows.length
  }
}

function apiExportCsv(): void {
  const api = serverGridRef.value?.gridApi
  if (api) {
    api.exportDataAsCsv({ fileName: 'employees.csv' })
    addLog('API', 'exportDataAsCsv() → 已触发下载', 'success')
  }
}

function apiAutoSizeAll(): void {
  const api = serverGridRef.value?.gridApi
  if (api) {
    api.autoSizeAllColumns()
    addLog('API', 'autoSizeAllColumns() 已调用', 'info')
  }
}

// 轮询 API 状态
setInterval(() => {
  if (serverGridRef.value) {
    apiLoadingState.value = serverGridRef.value.loading ? '加载中...' : '空闲'
    apiRowCount.value = (serverGridRef.value.rowData as any[])?.length ?? 0
    const p = (serverGridRef.value as any).pagination
    if (p) {
      apiPageInfo.value = `第${p.currentPage}/${p.totalPages}页 共${p.total}条`
    }
  }
}, 500)

// ====================================================================
// 自定义渲染器组件（纯 HTML/CSS，零 Vuetify 依赖）
// ====================================================================

/** 状态标签映射 */
const STATUS_MAP: Record<string, { label: string; bg: string }> = {
  active: { label: '启用', bg: '#4caf50' },
  inactive: { label: '停用', bg: '#f44336' },
  pending: { label: '待审', bg: '#ff9800' },
  archived: { label: '归档', bg: '#9e9e9e' },
  running: { label: '运行中', bg: '#4caf50' },
  stopped: { label: '已停止', bg: '#f44336' },
  paused: { label: '已暂停', bg: '#ff9800' },
}

/**
 * 状态标签渲染器
 * 根据值渲染彩色圆角标签
 */
const StatusPillRenderer = defineComponent({
  name: 'StatusPillRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = String(p.params?.value ?? '')
      const item = STATUS_MAP[v]
      if (!item) return h('span', { style: { color: '#999', fontSize: '12px' } }, v || '-')
      return h('span', {
        style: {
          display: 'inline-block', padding: '2px 10px', borderRadius: '12px',
          fontSize: '12px', fontWeight: '500', color: '#fff', backgroundColor: item.bg,
        },
      }, item.label)
    }
  },
})

/**
 * 进度条渲染器
 * 渲染带百分比文字的纯 CSS 进度条
 */
const ProgressBarRenderer = defineComponent({
  name: 'ProgressBarRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = Number(p.params?.value ?? 0)
      const pct = Math.min(100, Math.max(0, v))
      const barColor = pct >= 80 ? '#4caf50' : pct >= 50 ? '#ff9800' : '#f44336'
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
        h('div', {
          style: {
            flex: '1', height: '8px', borderRadius: '4px',
            backgroundColor: '#e0e0e0', overflow: 'hidden',
          },
        }, [
          h('div', {
            style: {
              width: `${pct}%`, height: '100%', borderRadius: '4px',
              backgroundColor: barColor, transition: 'width 0.3s ease',
            },
          }),
        ]),
        h('span', { style: { fontSize: '12px', minWidth: '36px', textAlign: 'right' } }, `${pct}%`),
      ])
    }
  },
})

/**
 * 评分星渲染器
 * 根据 1-5 数值显示 ★/☆ 字符
 */
const RatingStarRenderer = defineComponent({
  name: 'RatingStarRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = Number(p.params?.value ?? 0)
      const filled = '★'.repeat(Math.max(0, Math.min(5, v)))
      const empty = '☆'.repeat(Math.max(0, 5 - Math.min(5, v)))
      return h('span', { style: { color: '#f5a623', fontSize: '14px', letterSpacing: '2px' } }, filled + empty)
    }
  },
})

/**
 * 头像渲染器
 * 通过 cellRendererParams.nameField 可以指定对应的姓名字段
 */
const AvatarRenderer = defineComponent({
  name: 'AvatarRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const data = p.params?.data as Record<string, unknown> | undefined
      const nameField = (p.params?.nameField as string) || 'name'
      const src = (p.params?.value as string) || ''
      const name = String(data?.[nameField] ?? '')
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
        src
          ? h('img', { src, style: { width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' } })
          : h('div', {
            style: {
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#666',
            },
          }, name.charAt(0)),
      ])
    }
  },
})

/**
 * 操作按钮渲染器
 * 通过 cellRendererParams.onView / onEdit 回调通知父组件
 */
const ActionBtnRenderer = defineComponent({
  name: 'ActionBtnRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const data = p.params?.data as Record<string, unknown> | undefined
      const onView = p.params?.onView as ((d: Record<string, unknown>) => void) | undefined
      const onEdit = p.params?.onEdit as ((d: Record<string, unknown>) => void) | undefined
      const btnStyle = (color: string) => ({
        padding: '2px 10px', border: `1px solid ${color}`, borderRadius: '4px',
        background: 'transparent', color, cursor: 'pointer', fontSize: '11px', fontWeight: '500' as const,
      })
      return h('div', { style: { display: 'flex', gap: '4px' } }, [
        h('button', {
          style: btnStyle('#1976d2'),
          onClick: (e: Event) => { e.stopPropagation(); if (data) onView?.(data) },
        }, '查看'),
        h('button', {
          style: btnStyle('#f57c00'),
          onClick: (e: Event) => { e.stopPropagation(); if (data) onEdit?.(data) },
        }, '编辑'),
      ])
    }
  },
})

/**
 * 日期格式化渲染器
 */
const DateFormatRenderer = defineComponent({
  name: 'DateFormatRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = p.params?.value as string | undefined
      if (!v) return '-'
      try {
        const d = new Date(v)
        if (isNaN(d.getTime())) return v
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      } catch { return v }
    }
  },
})

/**
 * 级别标签渲染器
 */
const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  junior: { label: '初级', color: '#2196f3' },
  mid: { label: '中级', color: '#4caf50' },
  senior: { label: '高级', color: '#ff9800' },
  lead: { label: '负责人', color: '#9c27b0' },
}

const LevelLabelRenderer = defineComponent({
  name: 'LevelLabelRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = String(p.params?.value ?? '')
      const item = LEVEL_LABELS[v]
      if (!item) return h('span', {}, v)
      return h('span', {
        style: {
          display: 'inline-block', padding: '1px 8px', borderRadius: '10px',
          fontSize: '11px', fontWeight: '600', color: '#fff', backgroundColor: item.color,
        },
      }, item.label)
    }
  },
})

/**
 * 区域标签渲染器
 */
const REGION_LABELS: Record<string, { label: string; color: string }> = {
  east: { label: '华东', color: '#e91e63' },
  west: { label: '西部', color: '#00bcd4' },
  north: { label: '北方', color: '#3f51b5' },
  south: { label: '南方', color: '#ff5722' },
}

const RegionTagRenderer = defineComponent({
  name: 'RegionTagRenderer',
  props: ['params'],
  setup(p) {
    return () => {
      const v = String(p.params?.value ?? '')
      const item = REGION_LABELS[v]
      if (!item) return h('span', {}, v)
      return h('span', {
        style: {
          display: 'inline-block', padding: '1px 8px', borderRadius: '10px',
          fontSize: '11px', fontWeight: '600', color: '#fff', backgroundColor: item.color,
        },
      }, item.label)
    }
  },
})

// ====================================================================
// 自定义编辑器组件（实现 AG Grid ICellEditorComp 接口）
// ====================================================================

/**
 * 级别下拉编辑器
 */
const LevelSelectEditor = defineComponent({
  name: 'LevelSelectEditor',
  props: ['params'],
  setup(p) {
    const val = ref(String(p.params?.value ?? 'junior'))
    return () => {
      const options = Object.entries(LEVEL_LABELS).map(([k, v]) => ({ value: k, label: v.label }))
      return h('select', {
        value: val.value,
        style: { width: '100%', height: '100%', border: 'none', outline: 'none', fontSize: '13px', padding: '0 4px', backgroundColor: 'transparent' },
        onChange: (e: Event) => {
          val.value = (e.target as HTMLSelectElement).value
        },
      }, options.map(o => h('option', { value: o.value }, o.label)))
    }
  },
  methods: {
    getValue() { return (this as any).val },
    getGui() { return (this as any).$el as HTMLElement },
    isCancelBeforeEnd() { return false },
  },
})

/**
 * 进度滑块编辑器
 */
const ProgressSliderEditor = defineComponent({
  name: 'ProgressSliderEditor',
  props: ['params'],
  setup(p) {
    const val = ref(Number(p.params?.value ?? 50))
    return () => h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', height: '100%', padding: '0 4px' } }, [
      h('input', {
        type: 'range', min: '0', max: '100', value: val.value,
        style: { flex: '1' },
        onInput: (e: Event) => {
          val.value = Number((e.target as HTMLInputElement).value)
        },
      }),
      h('span', { style: { fontSize: '12px', minWidth: '32px' } }, `${val.value}`),
    ])
  },
  methods: {
    getValue() { return (this as any).val },
    getGui() { return (this as any).$el as HTMLElement },
    isCancelBeforeEnd() { return false },
  },
})
</script>

<style scoped>
/* 单元格值颜色辅助类（用于 cellClass） */
:deep(.text-green) { color: #4caf50 !important; }
:deep(.text-grey) { color: #9e9e9e !important; }
:deep(.text-red) { color: #f44336 !important; }
:deep(.font-weight-bold) { font-weight: 700 !important; }
</style>
