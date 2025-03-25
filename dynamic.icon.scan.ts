// 修复后的代码
type IconCollection = 'carbon' | 'mdi' | 'fa';

export async function getIconJson(): Promise<string[]> {
  const iconMap: IconCollection[] = ['carbon', 'mdi', 'fa'];

  // 使用 Promise.all 处理并行异步操作
  const collections = await Promise.all(
    iconMap.map(async (collection) => {
      try {
        // 正确解构模块的默认导出
        const module = await import(
          /* @vite-ignore */
          `@iconify/json/json/${collection}.json`
        );
        return Object.keys(module.default.icons).map((iconName) => `i-${collection}:${iconName}`);
      } catch (error) {
        console.error(`加载 ${collection} 图标集失败:`, error);
        return []; // 返回空数组保持程序继续执行
      }
    })
  );

  // 合并并去重所有图标名称
  return [...new Set(collections.flat())];
}
