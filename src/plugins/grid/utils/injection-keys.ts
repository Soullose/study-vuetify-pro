/**
 * plugins/grid/utils/injection-keys.ts
 *
 * ProGrid 组件体系共享的 provide/inject key
 * ProGrid 和 ProColumn 通过此 key 进行列配置注册通信
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { InjectionKey } from 'vue';
import type { ColumnConfig } from '../types';

/**
 * ProGrid provide / ProColumn inject 的列注册接口
 */
export interface ColumnRegisterContext {
  /** 注册列配置 */
  registerColumn: (config: ColumnConfig) => void;
  /** 移除列配置 */
  unregisterColumn: (field: string) => void;
}

/**
 * 列注册的 provide/inject key
 * ProGrid 通过此 key provide 注册函数，ProColumn 通过此 key inject 获取
 */
export const PROGRID_COLUMN_INJECTION_KEY: InjectionKey<ColumnRegisterContext> = Symbol('progrid-column-register');
