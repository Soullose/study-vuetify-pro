<!--
  plugins/grid/renderers/TemplateRenderer.vue

  Template 单元格渲染器 - 自定义插槽渲染
  通过 params.templateRender 渲染函数传递用户自定义内容

  @author Architecture Team
  @date 2026-04-19
-->
<template>
  <div class="pro-grid-template-renderer d-flex align-center h-100">
    <template-renderer-content :render-fn="renderFn" :data="rowData" />
  </div>
</template>

<script setup lang="ts">
/**
 * TemplateRenderer
 *
 * 自定义插槽渲染器，用于渲染用户在 ProColumn 的 #default 插槽中定义的内容。
 * 通过 params.templateRender 获取渲染函数，传入行数据执行渲染。
 *
 * 使用 FunctionalComponent 方式渲染，避免额外的组件实例开销。
 */

import { computed, defineComponent, h } from 'vue'
import type { TemplateRendererParams } from '../types'

/** AG Grid 会将 ICellRendererParams 作为 props 传入 */
const props = defineProps<{
  params?: TemplateRendererParams
}>()

/** 获取渲染函数 */
const renderFn = computed(() => {
  return props.params?.templateRender
})

/** 获取行数据 */
const rowData = computed(() => {
  return props.params?.data || {}
})

/**
 * 函数式渲染内容组件
 * 调用用户传入的渲染函数，传入行数据
 */
const TemplateRendererContent = defineComponent({
  name: 'TemplateRendererContent',
  props: {
    renderFn: {
      type: Function,
      default: undefined,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      if (typeof props.renderFn === 'function') {
        // 调用渲染函数，传入行数据
        const result = props.renderFn(props.data)
        // 渲染函数可能返回 VNode 数组或单个 VNode
        if (Array.isArray(result)) {
          return h('div', { class: 'd-flex align-center ga-2' }, result)
        }
        return result
      }
      // 没有渲染函数时显示原始值
      return h('span', '-')
    }
  },
})
</script>
