<!--
  plugins/grid/editors/SelectEditor.vue

  Select 单元格编辑器 - 使用 v-select 下拉选择编辑
  实现 AG Grid ICellEditorComp 接口

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-select-editor">
    <v-select
      ref="selectRef"
      v-model="currentValue"
      :items="options"
      item-title="label"
      item-value="value"
      density="compact"
      variant="outlined"
      hide-details
      single-line
      :placeholder="params?.placeholder || '请选择'"
      menu-icon="mdi-chevron-down"
      autofocus
      @keydown.escape="onEscape"
      @update:model-value="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * SelectEditor
 *
 * 使用 Vuetify v-select 的下拉选择编辑器。
 * 从列配置的 editorOptions 获取选项列表。
 * 选择后自动确认编辑。
 */

import { ref, computed, onMounted } from 'vue'
import type { GridApi } from 'ag-grid-community'
import type { SelectEditorParams, SelectOption } from '../types'

const props = defineProps<{
  params?: SelectEditorParams
}>()

/** 当前选中值 */
const currentValue = ref<unknown>(props.params?.value)

/** 下拉选项列表 */
const options = computed<SelectOption[]>(() => {
  return props.params?.options || []
})

/** 选择框引用 */
const selectRef = ref<{ $el: HTMLElement } | null>(null)

/** 是否取消编辑标志 */
let cancelFlag = false

/**
 * AG Grid 调用 - 获取编辑后的值
 * @returns 编辑后的值
 */
function getValue(): unknown {
  return currentValue.value
}

/**
 * AG Grid 调用 - 获取编辑器 DOM 元素
 */
function getGui(): HTMLElement {
  return selectRef.value?.$el || document.createElement('div')
}

/** 选择后自动确认 */
function onSelect(): void {
  const api = props.params?.api as GridApi | undefined
  // 延迟一帧让 AG Grid 处理值更新
  setTimeout(() => {
    api?.stopEditing()
  }, 50)
}

/** Escape 键取消编辑 */
function onEscape(): void {
  cancelFlag = true
}

/**
 * AG Grid 调用 - 是否取消编辑
 */
function isCancelBeforeEnd(): boolean {
  return cancelFlag
}

/** 挂载后自动聚焦 */
onMounted(() => {
  setTimeout(() => {
    const el = selectRef.value?.$el
    if (el) {
      const input = el.querySelector('input') as HTMLInputElement
      if (input) {
        input.focus()
      }
    }
  }, 50)
})

defineExpose({
  getValue,
  getGui,
  isCancelBeforeEnd,
})
</script>

<style scoped>
.pro-grid-select-editor {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.pro-grid-select-editor :deep(.v-field) {
  font-size: 13px;
  min-height: 28px;
}

.pro-grid-select-editor :deep(.v-field__input) {
  padding: 2px 8px;
  min-height: 28px;
}
</style>
