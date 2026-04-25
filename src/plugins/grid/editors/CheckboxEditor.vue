<!--
  plugins/grid/editors/CheckboxEditor.vue

  Checkbox 单元格编辑器 - 使用 v-checkbox 布尔值编辑
  点击即切换值并自动停止编辑
  实现 AG Grid ICellEditorComp 接口

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div ref="rootEl" class="pro-grid-checkbox-editor d-flex align-center justify-center h-100">
    <v-checkbox
      :model-value="currentValue"
      :color="params?.color || 'primary'"
      density="compact"
      hide-details
      @update:model-value="onToggle"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * CheckboxEditor
 *
 * 使用 Vuetify v-checkbox 的布尔值编辑器。
 * 点击即切换值，并自动停止编辑。
 *
 * 接口方法：
 * - getValue(): 返回编辑后的布尔值
 * - getGui(): 返回编辑器根 DOM 元素
 */

import { ref } from 'vue'
import type { GridApi } from 'ag-grid-community'
import { isTruthy } from '../utils/helpers'
import type { CheckboxEditorParams } from '../types'

const props = defineProps<{
  /** AG Grid 编辑器参数 */
  params?: CheckboxEditorParams
}>()

/** 根元素引用（用于 getGui 返回正确的 DOM） */
const rootEl = ref<HTMLElement | null>(null)

/** 当前布尔值 */
const currentValue = ref<boolean>(isTruthy(props.params?.value))

/**
 * 切换复选框值并停止编辑
 * @param newValue - 切换后的值（v-checkbox 可能传入 null）
 */
function onToggle(newValue: boolean | null): void {
  currentValue.value = newValue === true
  // 延迟停止编辑，让 AG Grid 有时间处理值更新
  const api = props.params?.api as GridApi | undefined
  setTimeout(() => {
    api?.stopEditing()
  }, 50)
}

/**
 * AG Grid 调用 - 获取编辑后的值
 * @returns 编辑后的布尔值
 */
function getValue(): boolean {
  return currentValue.value
}

/**
 * AG Grid 调用 - 获取编辑器 DOM 元素
 * 使用 Vue ref 绑定根元素，避免全局 DOM 查询导致多实例冲突
 * @returns 编辑器根 DOM 元素
 */
function getGui(): HTMLElement {
  return rootEl.value || document.createElement('div')
}

/** 暴露 AG Grid ICellEditorComp 接口方法 */
defineExpose({
  getValue,
  getGui,
})
</script>

<style scoped>
.pro-grid-checkbox-editor :deep(.v-input) {
  margin-top: 0;
  padding-top: 0;
}

.pro-grid-checkbox-editor :deep(.v-selection-control) {
  min-height: auto;
  height: auto;
}
</style>
