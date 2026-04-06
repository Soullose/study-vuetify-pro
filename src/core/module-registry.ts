/**
 * @description 模块注册中心 - 自动扫描、注册和管理业务模块
 * @author Architecture Team
 * @date 2026-04-05
 *
 * 职责：
 * 1. 通过 import.meta.glob 自动扫描 modules 目录下的模块
 * 2. 将模块路由包裹布局后注册到 Vue Router
 * 3. 从模块配置中提取菜单数据
 * 4. 支持模块的启用/禁用
 */

import type { Router } from 'vue-router';
import type { ModuleConfig, MenuItem, LayoutName } from './types';
import { wrapModuleRoutes } from './layout-wrapper';

/**
 * 模块注册中心类
 */
class ModuleRegistry {
  /** 已注册的模块配置 */
  private modules: Map<string, ModuleConfig> = new Map();

  /** 从模块中提取的菜单数据 */
  private menuItems: MenuItem[] = [];

  /** 是否已初始化 */
  private initialized = false;

  /**
   * 扫描并加载所有模块
   * 使用 Vite 的 import.meta.glob 实现自动发现
   *
   * @private
   */
  private scanModules(): void {
    // 只扫描 modules/*/index.ts，不递归扫描子目录
    const moduleEntries = import.meta.glob<{ default: ModuleConfig }>(
      '../modules/*/index.ts',
      { eager: true } // 同步加载，确保路由在应用启动前就绪
    );

    Object.entries(moduleEntries).forEach(([filePath, module]) => {
      const config = module.default;

      // 检查模块是否启用
      if (config.meta.enabled === false) {
        console.warn(`[ModuleRegistry] 模块 "${config.meta.name}" 已禁用，跳过注册`);
        return;
      }

      // 检查模块名是否重复
      if (this.modules.has(config.meta.name)) {
        console.error(`[ModuleRegistry] 模块 "${config.meta.name}" 重复注册，文件: ${filePath}`);
        return;
      }

      this.modules.set(config.meta.name, config);
      console.log(`[ModuleRegistry] 已加载模块: ${config.meta.name} (${config.meta.title})`);
    });
  }

  /**
   * 将所有模块路由注册到 Router
   *
   * @param router - Vue Router 实例
   */
  registerRoutes(router: Router): void {
    if (this.initialized) {
      console.warn('[ModuleRegistry] 已经初始化，不可重复注册');
      return;
    }

    this.scanModules();

    this.modules.forEach((config, moduleName) => {
      // 包裹布局
      const wrappedRoutes = wrapModuleRoutes(config.routes, config.meta.layout);

      // 逐条添加到路由
      wrappedRoutes.forEach((route) => {
        router.addRoute(route);
      });

      // 提取菜单数据
      this.extractMenus(config);

      console.log(`[ModuleRegistry] 模块 "${moduleName}" 已注册 ${config.routes.length} 条路由`);
    });

    this.initialized = true;
  }

  /**
   * 从模块配置中提取菜单数据
   *
   * @param config - 模块配置
   * @private
   */
  private extractMenus(config: ModuleConfig): void {
    config.routes.forEach((route) => {
      // 跳过隐藏的路由
      if (route.meta?.hidden) return;

      const menuItem: MenuItem = {
        path: route.path,
        name: route.name,
        title: route.meta?.title || route.name,
        icon: route.meta?.icon,
        order: config.meta.order,
        hidden: route.meta?.hidden,
        link: route.meta?.link,
        module: config.meta.name,
        children: route.children
          ?.filter((child) => !child.meta?.hidden)
          .map((child) => ({
            path: child.path,
            name: child.name,
            title: child.meta?.title || child.name,
            icon: child.meta?.icon,
            hidden: child.meta?.hidden,
            link: child.meta?.link,
            module: config.meta.name
          }))
      };

      this.menuItems.push(menuItem);
    });
  }

  /**
   * 获取所有菜单（按模块排序）
   *
   * @returns 排序后的菜单列表
   */
  getMenuItems(): MenuItem[] {
    return [...this.menuItems].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  /**
   * 获取指定布局的菜单
   *
   * @param layout - 布局名称
   * @returns 过滤后的菜单列表
   */
  getMenuByLayout(layout: LayoutName): MenuItem[] {
    return this.getMenuItems().filter((item) => {
      const mod = this.modules.get(item.module || '');
      return mod?.meta.layout === layout;
    });
  }

  /**
   * 获取所有已注册模块的名称
   *
   * @returns 模块名称数组
   */
  getModuleNames(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * 获取指定模块的配置
   *
   * @param name - 模块名称
   * @returns 模块配置或 undefined
   */
  getModule(name: string): ModuleConfig | undefined {
    return this.modules.get(name);
  }

  /**
   * 获取所有模块路由（用于后端权限过滤）
   *
   * @returns 所有模块的路由记录
   */
  getAllModuleRoutes(): ModuleConfig['routes'] {
    const allRoutes: ModuleConfig['routes'] = [];
    this.modules.forEach((config) => {
      allRoutes.push(...config.routes);
    });
    return allRoutes;
  }

  /**
   * 重置注册状态（用于测试或热重载）
   */
  reset(): void {
    this.modules.clear();
    this.menuItems = [];
    this.initialized = false;
  }
}

/** 导出单例 */
export const moduleRegistry = new ModuleRegistry();
