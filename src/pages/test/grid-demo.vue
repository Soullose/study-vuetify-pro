<!--
  pages/test/grid-demo.vue

  ProGrid 功能演示页面（精简版）
  展示纯 AG Grid 用法：内置 cellRenderer/cellEditor + 自定义 Vue 组件

  @author Architecture Team
  @date 2026-05-07
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
              <!-- 普通文本列 -->
              <ProColumn field="username" header="用户名" :width="120" />
              <ProColumn field="email" header="邮箱" :width="200" />
              <ProColumn field="department" header="部门" :width="120" />

              <!-- 状态列 — 使用自定义 cellRenderer 渲染彩色标签 -->
              <ProColumn
                field="status"
                header="状态"
                :width="100"
                :col-def="{ cellRenderer: StatusRenderer }"
              />

              <!-- 开关列 — 使用 AG Grid 内置 cellEditor -->
              <ProColumn
                field="enabled"
                header="启用"
                :width="80"
                editable
                :col-def="{
                  cellRenderer: 'agCheckboxCellRenderer',
                  cellEditor: 'agCheckboxCellEditor',
                }"
              />

              <!-- 复选框列 -->
              <ProColumn
                field="isAdmin"
                header="管理员"
                :width="80"
                editable
                :col-def="{
                  cellRenderer: 'agCheckboxCellRenderer',
                  cellEditor: 'agCheckboxCellEditor',
                }"
              />

              <!-- 日期列 — 自定义格式化渲染 -->
              <ProColumn
                field="createdAt"
                header="创建时间"
                :width="180"
                :col-def="{ cellRenderer: DateRenderer }"
              />

              <!-- 操作列 — 自定义渲染器带按钮 -->
              <ProColumn
                field="operation"
                header="操作"
                :width="160"
                pinned="right"
                :col-def="{
                  cellRenderer: OperationRenderer,
                  cellRendererParams: {
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                  },
                }"
              />
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

              <!-- 状态列 — 复用同一个 StatusRenderer -->
              <ProColumn
                field="status"
                header="状态"
                :width="100"
                :col-def="{ cellRenderer: StatusRenderer }"
              />

              <!-- 开关列 — AG Grid 内置 -->
              <ProColumn
                field="active"
                header="激活"
                :width="80"
                editable
                :col-def="{
                  cellRenderer: 'agCheckboxCellRenderer',
                  cellEditor: 'agCheckboxCellEditor',
                }"
              />

              <!-- 日期列 -->
              <ProColumn
                field="date"
                header="日期"
                :width="130"
                :col-def="{ cellRenderer: DateRenderer }"
              />
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
 * Grid Demo 页面（精简版）
 *
 * 展示纯 AG Grid 用法：
 * 1. AG Grid 内置 cellRenderer / cellEditor
 * 2. 自定义 Vue 组件作为 cellRenderer
 * 3. 服务端分页模式
 * 4. 前端数据模式
 */

import { ref, reactive, defineComponent, h } from 'vue'
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
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(-50)
  }
}

// ==================== 自定义单元格渲染器 ====================

/**
 * 状态渲染器 — 纯 HTML/CSS 实现
 * 替代原来的 Vuetify v-chip 渲染器
 */
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: '启用', color: '#4caf50' },
  disabled: { label: '禁用', color: '#f44336' },
  pending: { label: '待审核', color: '#ff9800' },
  running: { label: '运行中', color: '#4caf50' },
  stopped: { label: '已停止', color: '#f44336' },
  paused: { label: '已暂停', color: '#ff9800' },
}

const StatusRenderer = defineComponent({
  name: 'StatusRenderer',
  props: ['params'],
  setup(props) {
    return () => {
      const value = String(props.params?.value ?? '')
      const item = STATUS_MAP[value]
      if (!item) {
        return h('span', { style: { color: '#999' } }, value || '-')
      }
      return h('span', {
        style: {
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#fff',
          backgroundColor: item.color,
        },
      }, item.label)
    }
  },
})

/**
 * 日期渲染器
 * 将 ISO 日期格式化为 YYYY-MM-DD
 */
const DateRenderer = defineComponent({
  name: 'DateRenderer',
  props: ['params'],
  setup(props) {
    return () => {
      const value = props.params?.value as string | undefined
      if (!value) return '-'
      try {
        const d = new Date(value)
        if (isNaN(d.getTime())) return value
        return d.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      } catch {
        return value
      }
    }
  },
})

/**
 * 操作列渲染器 — 纯 HTML 按钮
 */
const OperationRenderer = defineComponent({
  name: 'OperationRenderer',
  props: ['params'],
  setup(props) {
    return () => {
      const data = props.params?.data as Record<string, unknown> | undefined
      const onEdit = props.params?.onEdit as ((data: Record<string, unknown>) => void) | undefined
      const onDelete = props.params?.onDelete as ((data: Record<string, unknown>) => void) | undefined

      return h('div', { style: { display: 'flex', gap: '4px' } }, [
        h('button', {
          style: {
            padding: '2px 8px',
            border: '1px solid #1976d2',
            borderRadius: '4px',
            background: '#e3f2fd',
            color: '#1976d2',
            cursor: 'pointer',
            fontSize: '12px',
          },
          onClick: (e: Event) => {
            e.stopPropagation()
            if (data) onEdit?.(data)
          },
        }, '编辑'),
        h('button', {
          style: {
            padding: '2px 8px',
            border: '1px solid #d32f2f',
            borderRadius: '4px',
            background: '#ffebee',
            color: '#d32f2f',
            cursor: 'pointer',
            fontSize: '12px',
          },
          onClick: (e: Event) => {
            e.stopPropagation()
            if (data) onDelete?.(data)
          },
        }, '删除'),
      ])
    }
  },
})

// ==================== 服务端模式 ====================

/** 服务端数据源配置 */
const serverDataSource = reactive<DataSourceConfig>({
  mode: 'server',
  pageSize: 10,
  pageSizes: [10, 20, 50],
  autoLoad: true,
  fetchData: async (params) => {
    const queryParams = new URLSearchParams()
    queryParams.set('page', String(params.page))
    queryParams.set('pageSize', String(params.pageSize))

    if (params.sort.length > 0) {
      queryParams.set('sortField', params.sort[0].field)
      queryParams.set('sortOrder', params.sort[0].direction)
    }

    const statusFilter = params.filter.find(f => f.field === 'status')
    if (statusFilter) {
      queryParams.set('filterStatus', String(statusFilter.value))
    }

    const response = await fetch(`/api/grid-demo/users?${queryParams.toString()}`)
    const result = await response.json()

    addLog('数据加载', `加载第 ${params.page} 页，${result.data.rows.length} 条数据`, 'success')

    return {
      rows: result.data.rows,
      total: result.data.total,
    }
  },
})

function onServerCellChanged(event: CellValueChangedEvent): void {
  addLog(
    '值变更',
    `字段 ${event.field}: ${JSON.stringify(event.oldValue)} → ${JSON.stringify(event.newValue)}`,
    'warning',
  )
}

function onServerSelectionChanged(selectedRows: Record<string, unknown>[]): void {
  addLog(
    '选择变更',
    `已选择 ${selectedRows.length} 行: ${selectedRows.map(r => r.username).join(', ')}`,
    'info',
  )
}

// ==================== 前端模式 ====================

const clientData = ref([
  { id: 'task-1', name: '数据备份', type: '定时任务', status: 'running', active: true, date: '2026-04-19T08:00:00Z' },
  { id: 'task-2', name: '日志清理', type: '定时任务', status: 'stopped', active: false, date: '2026-04-18T10:30:00Z' },
  { id: 'task-3', name: '邮件推送', type: '消息服务', status: 'running', active: true, date: '2026-04-19T09:15:00Z' },
  { id: 'task-4', name: '报表生成', type: '批处理', status: 'paused', active: false, date: '2026-04-17T14:00:00Z' },
  { id: 'task-5', name: '缓存刷新', type: '运维任务', status: 'running', active: true, date: '2026-04-19T07:45:00Z' },
])

// ==================== 操作处理 ====================

function handleEdit(data: Record<string, unknown>): void {
  addLog('操作', `编辑用户: ${data.username}`, 'primary')
}

function handleDelete(data: Record<string, unknown>): void {
  addLog('操作', `删除用户: ${data.username}`, 'error')
}
</script>
