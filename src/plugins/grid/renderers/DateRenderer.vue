<!--
  plugins/grid/renderers/DateRenderer.vue

  Date 单元格渲染器 - 日期格式化文本渲染
  支持自定义格式字符串，默认 YYYY-MM-DD

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-date-renderer d-flex align-center h-100">
    <span class="text-body-2">{{ formattedDate }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * DateRenderer
 *
 * 纯文本日期格式化渲染器。
 * 从 AG Grid 的 params.value 读取日期值，根据 format 参数格式化后显示。
 * 支持Date对象、时间戳、ISO日期字符串等常见格式。
 */

import { computed } from 'vue'
import { formatDate } from '../utils/helpers'
import type { DateRendererParams } from '../types'

/** AG Grid 会将 ICellRendererParams 作为 props 传入 */
const props = defineProps<{
  params?: DateRendererParams
}>()

/** 格式化后的日期文本 */
const formattedDate = computed(() => {
  if (!props.params) return ''
  const format = props.params.format || 'YYYY-MM-DD'
  const placeholder = props.params.placeholder || '-'
  const result = formatDate(props.params.value, format)
  return result || placeholder
})
</script>
