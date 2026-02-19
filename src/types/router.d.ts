import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string;
    /** 布局名称 */
    layout?: 'default' | 'home' | 'public';
    /** 是否需要认证 */
    requireAuth?: boolean;
    /** 是否缓存页面 */
    keepAlive?: boolean;
    /** 是否隐藏侧边栏 */
    hideSidebar?: boolean;
    /** 所需权限列表 */
    permissions?: string[];
    /** 所需角色列表 */
    roles?: string[];
    /** 路由名称 */
    name?: string;
    /** 是否使用布局 */
    isLayout?: boolean;
    /** 面包屑 */
    breadcrumb?: boolean;
    /** 图标 */
    icon?: string;
    /** 是否固定在 tab 上 */
    affix?: boolean;
    /** 是否隐藏菜单 */
    hidden?: boolean;
    /** 外链地址 */
    link?: string;
  }
}
