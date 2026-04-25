/**
 * plugins/grid/renderers/index.ts
 *
 * 渲染器注册表 - 管理所有预置单元格渲染器组件
 * 提供统一的注册和查询接口
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { Component } from 'vue';
import type { ColumnRendererType, RendererRegistry, RendererRegistryItem } from '../types';

// 导入预置渲染器组件
import CheckboxRenderer from './CheckboxRenderer.vue';
import SwitchRenderer from './SwitchRenderer.vue';
import DateRenderer from './DateRenderer.vue';
import StatusRenderer from './StatusRenderer.vue';
import TemplateRenderer from './TemplateRenderer.vue';

/**
 * 预置渲染器注册表
 *
 * 每个注册项包含：
 * - component: Vue 组件
 * - createParams: 可选的参数工厂函数，用于从列配置生成 cellRendererParams
 */
const RENDERER_REGISTRY: RendererRegistry = {
  checkbox: {
    component: CheckboxRenderer as Component,
    createParams: () => ({
      color: 'primary',
      disabled: true
    })
  },
  switch: {
    component: SwitchRenderer as Component,
    createParams: () => ({
      color: 'primary',
      disabled: true
    })
  },
  date: {
    component: DateRenderer as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      format: (columnConfig.format as string) || 'YYYY-MM-DD',
      placeholder: '-'
    })
  },
  status: {
    component: StatusRenderer as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      statusMap: columnConfig.statusMap,
      size: 'small',
      defaultColor: 'grey'
    })
  },
  template: {
    component: TemplateRenderer as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      templateRender: columnConfig.templateRender
    })
  }
};

/**
 * 获取指定类型的渲染器注册项
 *
 * @param type - 渲染器类型
 * @returns 渲染器注册项，未找到时返回 undefined
 */
export function getRenderer(type: ColumnRendererType): RendererRegistryItem | undefined {
  return RENDERER_REGISTRY[type];
}

/**
 * 获取指定类型的渲染器组件
 *
 * @param type - 渲染器类型
 * @returns 渲染器 Vue 组件
 */
export function getRendererComponent(type: ColumnRendererType): Component {
  const item = RENDERER_REGISTRY[type];
  if (!item) {
    throw new Error(`[ProGrid] 未知的渲染器类型: ${type}`);
  }
  return item.component;
}

/**
 * 获取所有预置渲染器组件映射（用于全局注册）
 *
 * @returns 组件名称到组件的映射
 */
export function getAllRendererComponents(): Record<string, Component> {
  return {
    ProGridCheckboxRenderer: CheckboxRenderer as Component,
    ProGridSwitchRenderer: SwitchRenderer as Component,
    ProGridDateRenderer: DateRenderer as Component,
    ProGridStatusRenderer: StatusRenderer as Component,
    ProGridTemplateRenderer: TemplateRenderer as Component
  };
}

export { RENDERER_REGISTRY };
