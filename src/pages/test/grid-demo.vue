<!--
  pages/test/grid-demo.vue

  ProGrid 功能演示页面
  展示所有渲染器类型、行内编辑、服务端分页等功能

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4">ProGrid 功能演示</h2>
      </v-col>
    </v-row>

    <!-- ==================== 服务端模式演示 ==================== -->
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon start>mdi-server</v-icon>
            服务端分页模式
          </v-card-title>
          <v-card-text>
            <ProGrid
              :data-source="serverDataSource"
              :height="500"
              row-selection="multiple"
              @cell-value-changed="onServerCellChanged"
              @selection-changed="onServerSelectionChanged"
            >
              <!-- id 字段无需声明！ProGrid 自动将其设为行标识并隐藏 -->

              <!-- 普通文本列 -->
              <ProColumn field="username" header="用户名" editable :width="120" />

              <!-- 普通文本列 -->
              <ProColumn field="email" header="邮箱" :width="200" />

              <!-- 部门列 -->
              <ProColumn field="department" header="部门" :width="120" />

              <!-- 状态列 - 使用 v-chip 渲染 -->
              <ProColumn
                field="status"
                header="状态"
                type="status"
                :width="120"
                :status-map="{
                  active: { text: '启用', color: 'success' },
                  disabled: { text: '禁用', color: 'error' },
                  pending: { text: '待审核', color: 'warning' },
                }"
              />

              <!-- 开关列 - 使用 v-switch 渲染，可编辑 -->
              <ProColumn field="enabled" header="启用" type="switch" editable :width="100" />

              <!-- 复选框列 - 使用 v-checkbox 渲染 -->
              <ProColumn field="isAdmin" header="管理员" type="checkbox" editable :width="100" />

              <!-- 日期列 - 格式化显示 -->
              <ProColumn field="createdAt" header="创建时间" type="date" format="YYYY-MM-DD HH:mm:ss" :width="180" />

              <!-- 自定义模板列 - 操作按钮 -->
              <ProColumn field="operation" header="操作" type="template" :width="180" pinned="right">
                <template #default="{ data }">
                  <v-btn size="x-small" color="primary" variant="tonal" @click="handleEdit(data)">
                    编辑
                  </v-btn>
                  <v-btn size="x-small" color="error" variant="tonal" class="ml-2" @click="handleDelete(data)">
                    删除
                  </v-btn>
                </template>
              </ProColumn>
            </ProGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ==================== 前端模式演示 ==================== -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon start>mdi-code-braces</v-icon>
            前端数据模式
          </v-card-title>
          <v-card-text>
            <ProGrid
              :data="clientData"
              :height="350"
              :show-pagination="false"
            >
              <ProColumn field="name" header="名称" :width="150" />
              <ProColumn field="type" header="类型" :width="120" />
              <ProColumn
                field="status"
                header="状态"
                type="status"
                :width="120"
                :status-map="{
                  running: { text: '运行中', color: 'success' },
                  stopped: { text: '已停止', color: 'error' },
                  paused: { text: '已暂停', color: 'warning' },
                }"
              />
              <ProColumn field="active" header="激活" type="switch" editable :width="100" />
              <ProColumn field="date" header="日期" type="date" format="YYYY-MM-DD" :width="130" />
            </ProGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 事件日志 -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon start>mdi-text-box-outline</v-icon>
            事件日志
            <v-spacer />
            <v-btn size="small" variant="text" @click="eventLog = []">清空</v-btn>
          </v-card-title>
          <v-card-text>
            <div
              v-for="(log, index) in eventLog.slice(-10).reverse()"
              :key="index"
              class="text-body-2 py-1"
            >
              <v-chip size="x-small" :color="log.color" variant="tonal" class="mr-2">
                {{ log.type }}
              </v-chip>
              <span class="text-medium-emphasis">{{ log.message }}</span>
            </div>
            <div v-if="eventLog.length === 0" class="text-body-2 text-medium-emphasis">
              暂无事件，请操作表格触发事件...
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
/**
 * Grid Demo 页面
 *
 * 展示 ProGrid 的所有功能：
 * 1. 服务端分页模式（排序、筛选、分页）
 * 2. 前端数据模式
 * 3. 所有渲染器类型（checkbox、switch、date、status、template）
 * 4. 行内编辑
 * 5. 行选择
 * 6. 事件处理
 */

import { ref, reactive } from 'vue'
import type { DataSourceConfig, CellValueChangedEvent } from '@/plugins/grid'

// ==================== 事件日志 ====================

interface LogItem {
  type: string
  message: string
  color: string
}

const eventLog = ref<LogItem[]>([])

function addLog(type: string, message: string, color: string = 'info'): void {
  eventLog.value.push({ type, message, color })
  // 最多保留 50 条
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(-50)
  }
}

// ==================== 服务端模式 ====================

/** 服务端数据源配置 */
const serverDataSource = reactive<DataSourceConfig>({
  mode: 'server',
  pageSize: 10,
  pageSizes: [10, 20, 50],
  autoLoad: true,
  fetchData: async (params) => {
    // 构建查询参数
    const queryParams = new URLSearchParams()
    queryParams.set('page', String(params.page))
    queryParams.set('pageSize', String(params.pageSize))

    // 排序参数
    if (params.sort.length > 0) {
      queryParams.set('sortField', params.sort[0].field)
      queryParams.set('sortOrder', params.sort[0].direction)
    }

    // 筛选参数
    const statusFilter = params.filter.find(f => f.field === 'status')
    if (statusFilter) {
      queryParams.set('filterStatus', String(statusFilter.value))
    }

    // 调用 Mock 接口
    const response = await fetch(`/api/grid-demo/users?${queryParams.toString()}`)
    const result = await response.json()

    addLog('数据加载', `加载第 ${params.page} 页，${result.data.rows.length} 条数据`, 'success')

    return {
      rows: result.data.rows,
      total: result.data.total,
    }
  },
})

/** 服务端模式单元格值变更 */
function onServerCellChanged(event: CellValueChangedEvent): void {
  addLog(
    '值变更',
    `字段 ${event.field}: ${JSON.stringify(event.oldValue)} → ${JSON.stringify(event.newValue)}`,
    'warning',
  )
}

/** 服务端模式行选择变更 */
function onServerSelectionChanged(selectedRows: Record<string, unknown>[]): void {
  addLog(
    '选择变更',
    `已选择 ${selectedRows.length} 行: ${selectedRows.map(r => r.username).join(', ')}`,
    'info',
  )
}

// ==================== 前端模式 ====================

/** 前端模式静态数据 */
const clientData = ref([
  { id: 'task-1', name: '数据备份', type: '定时任务', status: 'running', active: true, date: '2026-04-19T08:00:00Z' },
  { id: 'task-2', name: '日志清理', type: '定时任务', status: 'stopped', active: false, date: '2026-04-18T10:30:00Z' },
  { id: 'task-3', name: '邮件推送', type: '消息服务', status: 'running', active: true, date: '2026-04-19T09:15:00Z' },
  { id: 'task-4', name: '报表生成', type: '批处理', status: 'paused', active: false, date: '2026-04-17T14:00:00Z' },
  { id: 'task-5', name: '缓存刷新', type: '运维任务', status: 'running', active: true, date: '2026-04-19T07:45:00Z' },
])

// ==================== 操作处理 ====================

/** 编辑操作 */
function handleEdit(data: Record<string, unknown>): void {
  addLog('操作', `编辑用户: ${data.username}`, 'primary')
}

/** 删除操作 */
function handleDelete(data: Record<string, unknown>): void {
  addLog('操作', `删除用户: ${data.username}`, 'error')
}
</script>

<style scoped>
/* 页面样式 */
</style>
