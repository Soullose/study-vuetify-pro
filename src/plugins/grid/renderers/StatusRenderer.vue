<!--
  plugins/grid/renderers/StatusRenderer.vue

  Status 单元格渲染器 - 使用 v-chip 渲染状态标签
  通过 statusMap 配置映射值到文本和颜色

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-status-renderer d-flex align-center h-100">
    <v-chip
      :color="chipColor"
      :variant="chipVariant"
      :size="params?.size || 'small'"
      density="compact"
      label
    >
      {{ chipText }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
/**
 * StatusRenderer
 *
 * 使用 Vuetify v-chip 组件渲染状态标签。
 * 通过 statusMap 将数据字段值映射为对应的文本和颜色。
 * statusMap 格式：{ fieldValue: { text: '显示文本', color: '颜色' } }
 *
 * @example
 * statusMap: {
 *   active: { text: '启用', color: 'success' },
 *   disabled: { text: '禁用', color: 'error' }
 * }
 */

import { computed } from 'vue'
import type { StatusRendererParams, StatusMapItem } from '../types'

/** AG Grid 会将 ICellRendererParams 作为 props 传入 */
const props = defineProps<{
  params?: StatusRendererParams
}>()

/** 获取当前值对应的 statusMap 配置项 */
const statusItem = computed<StatusMapItem | null>(() => {
  if (!props.params?.statusMap) return null
  const rawValue = props.params.value
  // 将值转为字符串进行匹配
  const key = String(rawValue ?? '')
  return props.params.statusMap[key] || null
})

/** Chip 显示文本 */
const chipText = computed(() => {
  if (statusItem.value) {
    return statusItem.value.text
  }
  // 未匹配到 statusMap 时，使用 defaultText 或显示原始值
  if (props.params?.defaultText !== undefined) {
    return props.params.defaultText
  }
  return String(props.params?.value ?? '-')
})

/** Chip 颜色 */
const chipColor = computed(() => {
  if (statusItem.value) {
    return statusItem.value.color
  }
  return props.params?.defaultColor || 'grey'
})

/** Chip variant 样式 */
const chipVariant = computed(() => {
  if (statusItem.value?.variant) {
    return statusItem.value.variant
  }
  return 'tonal' as const
})
</script>
