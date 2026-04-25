<!--
  pages/system/user/index.vue

  用户管理页面 - 基于 ProGrid 的完整 CRUD Demo
  展示：服务端分页、状态渲染、开关编辑、行选择、工具栏搜索筛选、操作按钮

  @author Architecture Team
  @date 2026-04-25
-->
<template>
  <v-container fluid class="pa-4">
    <!-- 页面标题 -->
    <div class="d-flex align-center mb-4">
      <v-icon size="28" class="mr-2">mdi-account-multiple</v-icon>
      <h2 class="text-h6 font-weight-bold">用户管理</h2>
      <v-chip size="small" variant="tonal" color="primary" class="ml-3">
        共 {{ totalCount }} 条记录
      </v-chip>
    </div>

    <!-- ==================== 搜索与筛选工具栏 ==================== -->
    <v-card variant="outlined" class="mb-4">
      <v-card-text class="py-3">
        <v-row dense>
          <!-- 关键字搜索 -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchKeyword"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="搜索用户名 / 昵称 / 邮箱 / 手机号"
              prepend-inner-icon="mdi-magnify"
              clearable
              @keyup.enter="handleSearch"
              @click:clear="handleSearch"
            />
          </v-col>

          <!-- 状态筛选 -->
          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="filterStatus"
              :items="statusFilterOptions"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="状态"
              clearable
              @update:model-value="handleSearch"
            />
          </v-col>

          <!-- 部门筛选 -->
          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="filterDepartment"
              :items="departmentOptions"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="部门"
              clearable
              @update:model-value="handleSearch"
            />
          </v-col>

          <!-- 操作按钮 -->
          <v-col cols="12" sm="6" md="5" class="d-flex align-center justify-end ga-2">
            <v-btn
              color="primary"
              size="small"
              variant="tonal"
              prepend-icon="mdi-magnify"
              @click="handleSearch"
            >
              搜索
            </v-btn>
            <v-btn
              color="primary"
              size="small"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="handleAdd"
            >
              新增
            </v-btn>
            <v-btn
              color="error"
              size="small"
              variant="tonal"
              prepend-icon="mdi-delete-outline"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              批量删除 {{ selectedRows.length > 0 ? `(${selectedRows.length})` : '' }}
            </v-btn>
            <v-btn
              size="small"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="handleRefresh"
            >
              刷新
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ==================== 用户数据表格 ==================== -->
    <v-card variant="outlined">
      <ProGrid
        ref="gridRef"
        :data-source="userDataSource"
        :height="560"
        row-selection="multiple"
        @cell-value-changed="onCellValueChanged"
        @selection-changed="onSelectionChanged"
        @row-clicked="onRowClicked"
        @row-double-clicked="onRowDoubleClicked"
        @data-loaded="onDataLoaded"
      >
        <!-- 用户名列 - 可编辑 -->
        <ProColumn field="username" header="用户名" editable :width="120" />

        <!-- 昵称列 - 可编辑 -->
        <ProColumn field="nickname" header="昵称" editable :width="100" />

        <!-- 邮箱列 -->
        <ProColumn field="email" header="邮箱" :width="200" />

        <!-- 手机号列 -->
        <ProColumn field="phone" header="手机号" :width="130" />

        <!-- 部门列 -->
        <ProColumn field="department" header="部门" :width="100" />

        <!-- 角色列 -->
        <ProColumn
          field="role"
          header="角色"
          editable
          editor-type="select"
          :editor-options="roleOptions"
          :width="120"
        />

        <!-- 状态列 - v-chip 渲染 -->
        <ProColumn
          field="status"
          header="状态"
          type="status"
          :width="100"
          :status-map="{
            active: { text: '正常', color: 'success' },
            disabled: { text: '禁用', color: 'error' },
            pending: { text: '待审核', color: 'warning' },
          }"
        />

        <!-- 启用开关列 - v-switch 渲染 + 可编辑 -->
        <ProColumn field="enabled" header="启用" type="switch" editable :width="90" />

        <!-- 管理员列 - v-checkbox 渲染 -->
        <ProColumn field="isAdmin" header="管理员" type="checkbox" editable :width="90" />

        <!-- 创建时间列 - 日期渲染 -->
        <ProColumn field="createdAt" header="创建时间" type="date" format="YYYY-MM-DD HH:mm" :width="160" />

        <!-- 最后登录列 - 日期渲染 -->
        <ProColumn field="lastLoginAt" header="最后登录" type="date" format="YYYY-MM-DD HH:mm" :width="160" />

        <!-- 操作列 - 自定义模板 -->
        <ProColumn field="operation" header="操作" type="template" :width="160" pinned="right">
          <template #default="{ data }">
            <v-btn
              size="x-small"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-pencil-outline"
              @click.stop="handleEdit(data)"
            >
              编辑
            </v-btn>
            <v-btn
              size="x-small"
              color="error"
              variant="tonal"
              class="ml-1"
              prepend-icon="mdi-delete-outline"
              @click.stop="handleDelete(data)"
            >
              删除
            </v-btn>
          </template>
        </ProColumn>
      </ProGrid>
    </v-card>

    <!-- ==================== Toast 提示 ==================== -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2000" location="top">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
/**
 * 用户管理页面
 *
 * 基于 ProGrid 组件的完整用户管理 CRUD 页面。
 * 展示以下 ProGrid 功能：
 * 1. 服务端分页（200 条数据）
 * 2. 状态渲染（v-chip 状态标签）
 * 3. 开关编辑（v-switch 行内编辑）
 * 4. 复选框编辑（v-checkbox）
 * 5. 下拉选择编辑（v-select 角色选择）
 * 6. 文本编辑（v-text-field）
 * 7. 日期格式化渲染
 * 8. 自定义模板（操作按钮）
 * 9. 多行选择 + 批量操作
 * 10. 工具栏搜索筛选
 *
 * @author Architecture Team
 * @date 2026-04-25
 */

import { ref, reactive } from 'vue'
import type { DataSourceConfig, CellValueChangedEvent } from '@/plugins/grid'

// ==================== 筛选状态 ====================

/** 搜索关键字 */
const searchKeyword = ref('')

/** 状态筛选 */
const filterStatus = ref<string | null>(null)

/** 部门筛选 */
const filterDepartment = ref<string | null>(null)

/** 状态筛选选项 */
const statusFilterOptions = [
  { title: '正常', value: 'active' },
  { title: '禁用', value: 'disabled' },
  { title: '待审核', value: 'pending' },
]

/** 部门选项 */
const departmentOptions = [
  '技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部', '法务部',
]

/** 角色下拉选项（用于 SelectEditor） */
const roleOptions = [
  { value: '超级管理员', label: '超级管理员' },
  { value: '管理员', label: '管理员' },
  { value: '编辑', label: '编辑' },
  { value: '普通用户', label: '普通用户' },
  { value: '访客', label: '访客' },
]

// ==================== 表格状态 ====================

/** ProGrid 组件引用 */
const gridRef = ref<{ gridApi: unknown; refresh: () => Promise<void> } | null>(null)

/** 已选择的行 */
const selectedRows = ref<Record<string, unknown>[]>([])

/** 总记录数 */
const totalCount = ref(0)

// ==================== 数据源配置 ====================

/** 用户列表数据源 */
const userDataSource = reactive<DataSourceConfig>({
  mode: 'server',
  pageSize: 20,
  pageSizes: [10, 20, 50, 100],
  autoLoad: true,
  fetchData: async (params) => {
    // 构建查询参数
    const queryParams = new URLSearchParams()
    queryParams.set('page', String(params.page))
    queryParams.set('pageSize', String(params.pageSize))

    // 排序
    if (params.sort.length > 0) {
      queryParams.set('sortField', params.sort[0].field)
      queryParams.set('sortOrder', params.sort[0].direction)
    }

    // 筛选
    if (searchKeyword.value) {
      queryParams.set('keyword', searchKeyword.value)
    }
    if (filterStatus.value) {
      queryParams.set('filterStatus', filterStatus.value)
    }
    if (filterDepartment.value) {
      queryParams.set('filterDepartment', filterDepartment.value)
    }

    // 调用 Mock 接口
    const response = await fetch(`/api/system/users?${queryParams.toString()}`)
    const result = await response.json()

    return {
      rows: result.data.rows,
      total: result.data.total,
    }
  },
})

// ==================== Toast 提示 ====================

interface SnackbarState {
  show: boolean
  message: string
  color: string
  icon: string
}

const snackbar = reactive<SnackbarState>({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle',
})

/**
 * 显示提示消息
 * @param message - 消息文本
 * @param type - 消息类型
 */
function showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
  const config: Record<string, { color: string; icon: string }> = {
    success: { color: 'success', icon: 'mdi-check-circle' },
    error: { color: 'error', icon: 'mdi-alert-circle' },
    info: { color: 'info', icon: 'mdi-information' },
    warning: { color: 'warning', icon: 'mdi-alert' },
  }
  snackbar.message = message
  snackbar.color = config[type].color
  snackbar.icon = config[type].icon
  snackbar.show = true
}

// ==================== 事件处理 ====================

/**
 * 搜索 / 筛选处理
 * 重新加载数据
 */
function handleSearch(): void {
  gridRef.value?.refresh()
}

/**
 * 刷新表格
 */
function handleRefresh(): void {
  gridRef.value?.refresh()
  showMessage('数据已刷新', 'info')
}

/**
 * 新增用户
 * TODO: 打开新增用户对话框
 */
function handleAdd(): void {
  showMessage('新增用户功能待实现', 'info')
}

/**
 * 编辑用户
 * TODO: 打开编辑用户对话框
 * @param data - 行数据
 */
function handleEdit(data: Record<string, unknown>): void {
  showMessage(`编辑用户: ${String(data.username)} (${String(data.nickname)})`, 'info')
}

/**
 * 删除单个用户
 * @param data - 行数据
 */
function handleDelete(data: Record<string, unknown>): void {
  showMessage(`删除用户: ${String(data.username)}`, 'error')
}

/**
 * 批量删除
 */
function handleBatchDelete(): void {
  const count = selectedRows.value.length
  const names = selectedRows.value.map((r) => String(r.username)).join(', ')
  showMessage(`批量删除 ${count} 个用户: ${names}`, 'error')
  // 清空选择
  selectedRows.value = []
}

/**
 * 单元格值变更处理
 * @param event - 变更事件
 */
function onCellValueChanged(event: CellValueChangedEvent): void {
  showMessage(
    `字段 ${event.field}: ${JSON.stringify(event.oldValue)} → ${JSON.stringify(event.newValue)}`,
    'success',
  )
}

/**
 * 行选择变更
 * @param rows - 选中的行数据
 */
function onSelectionChanged(rows: Record<string, unknown>[]): void {
  selectedRows.value = rows
}

/**
 * 行点击
 * @param row - 行数据
 */
function onRowClicked(row: Record<string, unknown>): void {
  // 可用于展示行详情预览
}

/**
 * 行双击 - 打开编辑
 * @param row - 行数据
 */
function onRowDoubleClicked(row: Record<string, unknown>): void {
  showMessage(`双击编辑: ${String(row.username)} (${String(row.nickname)})`, 'info')
}

/**
 * 数据加载完成
 * @param _data - 行数据
 * @param total - 总数
 */
function onDataLoaded(_data: Record<string, unknown>[], total: number): void {
  totalCount.value = total
}
</script>
