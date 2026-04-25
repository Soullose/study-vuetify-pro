/**
 * plugins/grid/editors/index.ts
 *
 * 编辑器注册表 - 管理所有预置单元格编辑器组件
 * 提供统一的注册和查询接口
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { Component } from 'vue';
import type { ColumnEditorType, EditorRegistry, EditorRegistryItem } from '../types';

// 导入预置编辑器组件
import TextEditor from './TextEditor.vue';
import SelectEditor from './SelectEditor.vue';
import DateEditor from './DateEditor.vue';
import CheckboxEditor from './CheckboxEditor.vue';
import SwitchEditor from './SwitchEditor.vue';

/**
 * 预置编辑器注册表
 *
 * 每个注册项包含：
 * - component: Vue 组件
 * - createParams: 可选的参数工厂函数，用于从列配置生成 cellEditorParams
 */
const EDITOR_REGISTRY: EditorRegistry = {
  text: {
    component: TextEditor as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      placeholder: '',
      maxLength: columnConfig.maxLength
    })
  },
  select: {
    component: SelectEditor as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      options: columnConfig.editorOptions || [],
      placeholder: '请选择'
    })
  },
  date: {
    component: DateEditor as Component,
    createParams: (columnConfig: Record<string, unknown>) => ({
      format: (columnConfig.format as string) || 'YYYY-MM-DD',
      placeholder: '选择日期'
    })
  },
  checkbox: {
    component: CheckboxEditor as Component,
    createParams: () => ({
      color: 'primary'
    })
  },
  switch: {
    component: SwitchEditor as Component,
    createParams: () => ({
      color: 'primary'
    })
  }
};

/**
 * 获取指定类型的编辑器注册项
 *
 * @param type - 编辑器类型
 * @returns 编辑器注册项，未找到时返回 undefined
 */
export function getEditor(type: ColumnEditorType): EditorRegistryItem | undefined {
  return EDITOR_REGISTRY[type];
}

/**
 * 获取指定类型的编辑器组件
 *
 * @param type - 编辑器类型
 * @returns 编辑器 Vue 组件
 */
export function getEditorComponent(type: ColumnEditorType): Component {
  const item = EDITOR_REGISTRY[type];
  if (!item) {
    throw new Error(`[ProGrid] 未知的编辑器类型: ${type}`);
  }
  return item.component;
}

/**
 * 获取所有预置编辑器组件映射（用于全局注册）
 *
 * @returns 组件名称到组件的映射
 */
export function getAllEditorComponents(): Record<string, Component> {
  return {
    ProGridTextEditor: TextEditor as Component,
    ProGridSelectEditor: SelectEditor as Component,
    ProGridDateEditor: DateEditor as Component,
    ProGridCheckboxEditor: CheckboxEditor as Component,
    ProGridSwitchEditor: SwitchEditor as Component
  };
}

export { EDITOR_REGISTRY };
