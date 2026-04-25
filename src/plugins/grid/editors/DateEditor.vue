<!--
  plugins/grid/editors/DateEditor.vue

  Date 单元格编辑器 - 使用 Vuetify v-date-picker 日期选择
  以弹出菜单方式展示日期选择器，统一 Vuetify 交互体验
  实现 AG Grid ICellEditorComp 接口

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div ref="rootEl" class="pro-grid-date-editor">
    <v-menu
      v-model="menuOpen"
      :close-on-content-click="false"
      location="bottom start"
      min-width="290"
    >
      <template #activator="{ props: menuProps }">
        <v-text-field
          ref="inputRef"
          v-model="displayValue"
          v-bind="menuProps"
          density="compact"
          variant="outlined"
          hide-details
          single-line
          readonly
          :placeholder="params?.placeholder || '选择日期'"
          append-inner-icon="mdi-calendar"
          @keydown.enter="onEnter"
          @keydown.escape="onEscape"
        />
      </template>
      <v-date-picker
        v-model="selectedDate"
        color="primary"
        hide-header
        @update:model-value="onDateSelect"
      />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
/**
 * DateEditor
 *
 * 使用 Vuetify v-date-picker 的日期编辑器。
 * 以弹出菜单方式展示，选择日期后自动确认编辑。
 *
 * 接口方法：
 * - getValue(): 返回编辑后的日期字符串（YYYY-MM-DD 格式）
 * - getGui(): 返回编辑器根 DOM 元素
 * - isPopup(): 返回 false（使用 v-menu 自行管理弹出层）
 */

import { ref, computed, onMounted } from 'vue'
import type { GridApi } from 'ag-grid-community'
import { formatDate } from '../utils/helpers'
import type { DateEditorParams } from '../types'

/**
 * 将任意日期值转换为 Date 对象
 * @param value - 原始日期值
 * @returns Date 对象或 null
 */
function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  const d = new Date(value as string | number)
  return isNaN(d.getTime()) ? null : d
}

/**
 * 将 Date 转为 v-date-picker 要求的 YYYY-MM-DD 字符串格式
 * @param date - Date 对象
 * @returns YYYY-MM-DD 格式字符串
 */
function toDateString(date: Date | null): string {
  if (!date) return ''
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 将 Date 转为用户显示格式
 * @param date - Date 对象
 * @param format - 格式化字符串
 * @returns 格式化后的日期文本
 */
function toDisplayString(date: Date | null, format?: string): string {
  if (!date) return ''
  return formatDate(date, format || 'YYYY-MM-DD')
}

const props = defineProps<{
  /** AG Grid 编辑器参数 */
  params?: DateEditorParams
}>()

/** 根元素引用 */
const rootEl = ref<HTMLElement | null>(null)

/** 初始日期值 */
const initialDate = toDate(props.params?.value)

/** 选择的日期（v-date-picker v-model，格式为 Date 对象数组或字符串） */
const selectedDate = ref<string | null>(toDateString(initialDate))

/** 弹出菜单是否打开 */
const menuOpen = ref(false)

/** 是否取消编辑标志 */
let cancelFlag = false

/** 输入框显示值 */
const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  const d = new Date(selectedDate.value)
  return toDisplayString(d, props.params?.format)
})

/**
 * 日期选择回调 - 选择后自动关闭菜单并停止编辑
 * @param value - 选中的日期值
 */
function onDateSelect(value: unknown): void {
  if (value) {
    const dateStr = typeof value === 'string' ? value : toDateString(new Date(String(value)))
    selectedDate.value = dateStr
    // 关闭菜单后延迟停止编辑，确保值已更新
    menuOpen.value = false
    const api = props.params?.api as GridApi | undefined
    setTimeout(() => {
      api?.stopEditing()
    }, 100)
  }
}

/** Enter 键确认 */
function onEnter(): void {
  // AG Grid 自动停止编辑
}

/** Escape 键取消 */
function onEscape(): void {
  cancelFlag = true
}

/**
 * AG Grid 调用 - 获取编辑后的值
 * @returns YYYY-MM-DD 格式的日期字符串
 */
function getValue(): string {
  return selectedDate.value || ''
}

/**
 * AG Grid 调用 - 获取编辑器 DOM 元素
 * @returns 编辑器根 DOM 元素
 */
function getGui(): HTMLElement {
  return rootEl.value || document.createElement('div')
}

/**
 * AG Grid 调用 - 是否取消编辑
 * @returns true 则取消编辑
 */
function isCancelBeforeEnd(): boolean {
  return cancelFlag
}

/** 挂载后自动打开日期选择器 */
onMounted(() => {
  setTimeout(() => {
    menuOpen.value = true
  }, 100)
})

/** 暴露 AG Grid ICellEditorComp 接口方法 */
defineExpose({
  getValue,
  getGui,
  isCancelBeforeEnd,
})
</script>

<style scoped>
.pro-grid-date-editor {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.pro-grid-date-editor :deep(.v-field) {
  font-size: 13px;
  min-height: 28px;
}

.pro-grid-date-editor :deep(.v-field__input) {
  padding: 2px 8px;
  min-height: 28px;
  cursor: pointer;
}
</style>
