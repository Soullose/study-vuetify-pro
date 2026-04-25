<!--
  plugins/grid/renderers/SwitchRenderer.vue

  Switch 单元格渲染器 - 使用 v-switch 渲染开关状态
  只读模式，density="compact"，hide-details

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-switch-renderer d-flex align-center justify-center h-100">
    <v-switch
      :model-value="switched"
      :color="params?.color || 'primary'"
      :disabled="params?.disabled !== false"
      density="compact"
      hide-details
      readonly
    />
  </div>
</template>

<script setup lang="ts">
/**
 * SwitchRenderer
 *
 * 使用 Vuetify v-switch 组件渲染布尔值单元格。
 * 从 AG Grid 的 params.value 读取值，转换为布尔值后显示。
 * 默认为只读模式，如需编辑请使用 SwitchEditor。
 */

import { computed } from 'vue'
import { isTruthy } from '../utils/helpers'
import type { SwitchRendererParams } from '../types'

/** AG Grid 会将 ICellRendererParams 作为 props 传入 */
const props = defineProps<{
  params?: SwitchRendererParams
}>()

/** 计算开关是否打开 */
const switched = computed(() => {
  if (!props.params) return false
  return isTruthy(props.params.value)
})
</script>

<style scoped>
.pro-grid-switch-renderer {
  pointer-events: auto;
}

/* 移除 v-switch 在 AG Grid 单元格中的多余间距 */
.pro-grid-switch-renderer :deep(.v-input) {
  margin-top: 0;
  padding-top: 0;
}

.pro-grid-switch-renderer :deep(.v-selection-control) {
  min-height: auto;
  height: auto;
}
</style>
