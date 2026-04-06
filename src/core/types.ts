/**
 * @description 核心类型定义 - 模块化路由系统的类型约束
 * @author Architecture Team
 * @date 2026-04-05
 */

import type { RouteComponent } from 'vue-router'

/** 布局名称类型 */
export type LayoutName = 'admin' | 'portal' | 'blank'

/** 模块路由配置 - 单条路由 */
export interface ModuleRouteRecord {
  /** 路由路径 */
  path: string
  /** 路由名称（必须全局唯一） */
  name: string
  /** 页面组件（懒加载） */
  component: () => Promise<RouteComponent>
  /** 路由元信息 */
  meta?: ModuleRouteMeta
  /** 子路由 */
  children?: ModuleRouteRecord[]
  /** 重定向 */
  redirect?: string
}

/** 模块路由元信息 */
export interface ModuleRouteMeta {
  /** 页面标题 */
  title?: string
  /** 菜单图标 */
  icon?: string
  /** 是否需要认证 */
  requireAuth?: boolean
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 是否固定在标签页 */
  affix?: boolean
  /** 是否在菜单中隐藏 */
  hidden?: boolean
  /** 外链地址 */
  link?: string
  /** 所需权限列表 */
  permissions?: string[]
  /** 所需角色列表 */
  roles?: string[]
  /** 面包屑 */
  breadcrumb?: boolean
  /** 使用哪个布局 */
  layout?: LayoutName
}

/** 模块元信息 */
export interface ModuleMeta {
  /** 模块唯一标识 */
  name: string
  /** 模块显示名称 */
  title: string
  /** 模块图标 */
  icon?: string
  /** 模块默认布局 */
  layout: LayoutName
  /** 菜单排序权重 */
  order?: number
  /** 模块描述 */
  description?: string
  /** 是否启用 */
  enabled?: boolean
}

/** 模块配置 - 每个模块的 index.ts 导出此类型 */
export interface ModuleConfig {
  /** 模块元信息 */
  meta: ModuleMeta
  /** 模块路由列表 */
  routes: ModuleRouteRecord[]
}

/** 菜单项（用于侧边栏渲染） */
export interface MenuItem {
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name: string
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon?: string
  /** 排序权重 */
  order?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 外链 */
  link?: string
  /** 子菜单 */
  children?: MenuItem[]
  /** 所属模块 */
  module?: string
}
