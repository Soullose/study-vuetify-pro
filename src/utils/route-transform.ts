/**
 * 将扁平菜单列表转换为树形结构
 *
 * 用于把后端返回的扁平菜单（带 id/parentId）转为侧边栏渲染所需的层级结构。
 * 按可选的 sort 字段升序排序；sort 缺省视为 0。
 *
 * @typeParam T - 菜单项类型，需含 id 与可选 parentId/sort
 * @param items - 扁平菜单列表
 * @param parentId - 当前层级的父级 id（递归用），根节点传 null
 * @returns 树形菜单列表
 */
export function buildMenuTree<T extends { id: string | number; parentId?: string | number | null; sort?: number }>(
  items: T[],
  parentId: string | number | null = null
): T[] {
  return items
    .filter((item) => (item.parentId ?? null) === parentId)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id)
    })) as T[];
}

// 历史说明：本文件曾包含 transformRoutes / loadComponent / buildRouteTree 等函数，
// 用于「后端动态路由注册」。该机制与 ModuleRegistry 静态路由在 path 上冲突且从不生效，
// 已于权限路由收敛时移除。如需恢复，请同步处理与静态路由的冲突。
