/**
 * @description 核心模块入口 - 统一导出
 * @author Architecture Team
 * @date 2026-04-05
 */

export type { LayoutName, ModuleRouteRecord, ModuleRouteMeta, ModuleMeta, ModuleConfig, MenuItem } from './types';

export { wrapRouteWithLayout, wrapModuleRoutes } from './layout-wrapper';
export { moduleRegistry } from './module-registry';
