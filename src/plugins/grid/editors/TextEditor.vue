<!--
  plugins/grid/editors/TextEditor.vue

  Text 单元格编辑器 - 使用 v-text-field 文本编辑
  实现 AG Grid ICellEditorComp 接口

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-text-editor">
    <v-text-field
      ref="inputRef"
      v-model="currentValue"
      density="compact"
      variant="outlined"
      hide-details
      single-line
      :placeholder="params?.placeholder || ''"
      :maxlength="params?.maxLength"
      autofocus
      @keydown.enter="onEnter"
      @keydown.escape="onEscape"
      @keydown.tab="onTab"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * TextEditor
 *
 * 使用 Vuetify v-text-field 的文本编辑器。
 * 实现 AG Grid ICellEditorComp 接口：
 * - getValue(): 返回编辑后的值
 * - getGui(): 返回编辑器 DOM 元素
 *
 * 快捷键：
 * - Enter: 确认编辑
 * - Escape: 取消编辑
 * - Tab: 确认编辑并移到下一个单元格
 */

import { ref, onMounted } from 'vue'
import type { TextEditorParams } from '../types'

const props = defineProps<{
  params?: TextEditorParams
}>()

/** 当前编辑值 */
const currentValue = ref<string>(String(props.params?.value ?? ''))

/** 输入框引用 */
const inputRef = ref<{ $el: HTMLElement } | null>(null)

/** 是否取消编辑标志 */
let cancelFlag = false

/**
 * AG Grid 调用 - 获取编辑后的值
 * @returns 编辑后的值
 */
function getValue(): string {
  return currentValue.value
}

/**
 * AG Grid 调用 - 获取编辑器 DOM 元素
 * @returns 编辑器根 DOM 元素
 */
function getGui(): HTMLElement {
  return inputRef.value?.$el || document.createElement('div')
}

/** Enter 键确认编辑 */
function onEnter(): void {
  // AG Grid 会自动停止编辑
}

/** Escape 键取消编辑 */
function onEscape(): void {
  cancelFlag = true
}

/** Tab 键确认编辑并移动 */
function onTab(): void {
  // AG Grid 会自动处理 Tab 导航
}

/**
 * AG Grid 调用 - 是否取消编辑
 * @returns true 则取消编辑
 */
function isCancelBeforeEnd(): boolean {
  return cancelFlag
}

/** 挂载后自动聚焦输入框 */
onMounted(() => {
  // 延迟聚焦以确保 DOM 已渲染
  setTimeout(() => {
    const el = inputRef.value?.$el
    if (el) {
      const input = el.querySelector('input') as HTMLInputElement
      if (input) {
        input.focus()
        input.select()
      }
    }
  }, 50)
})

/** 暴露 AG Grid ICellEditorComp 接口方法 */
defineExpose({
  getValue,
  getGui,
  isCancelBeforeEnd,
})
</script>

<style scoped>
.pro-grid-text-editor {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.pro-grid-text-editor :deep(.v-field) {
  font-size: 13px;
  min-height: 28px;
}

.pro-grid-text-editor :deep(.v-field__input) {
  padding: 2px 8px;
  min-height: 28px;
}
</style>
