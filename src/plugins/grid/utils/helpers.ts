/**
 * plugins/grid/utils/helpers.ts
 *
 * Grid 工具函数 - 日期格式化、类型判断等通用工具
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

/**
 * 日期格式化 token 定义
 * 按长度降序排列，确保长 token 优先匹配（如 YYYY 在 YY 之前）
 */
const DATE_TOKENS: ReadonlyArray<{ pattern: RegExp; replacer: (date: Date) => string }> = [
  { pattern: /YYYY/g, replacer: (d) => d.getFullYear().toString() },
  { pattern: /MM/g, replacer: (d) => (d.getMonth() + 1).toString().padStart(2, '0') },
  { pattern: /DD/g, replacer: (d) => d.getDate().toString().padStart(2, '0') },
  { pattern: /HH/g, replacer: (d) => d.getHours().toString().padStart(2, '0') },
  { pattern: /mm/g, replacer: (d) => d.getMinutes().toString().padStart(2, '0') },
  { pattern: /ss/g, replacer: (d) => d.getSeconds().toString().padStart(2, '0') }
];

/**
 * 日期格式化函数
 *
 * 支持以下占位符：
 * - YYYY: 四位年份
 * - MM:   两位月份
 * - DD:   两位日期
 * - HH:   两位小时（24小时制）
 * - mm:   两位分钟
 * - ss:   两位秒数
 *
 * 使用逐 token 替换策略，避免 String.replace 链式替换的冲突问题
 * （如先替换 mm 后 YYYY 中的 MM 被误匹配）
 *
 * @param value - 日期值（Date 对象、时间戳、日期字符串）
 * @param format - 格式化字符串，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串，无效值返回空字符串
 */
export function formatDate(value: unknown, format: string = 'YYYY-MM-DD'): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    // 时间戳处理
    date = new Date(value);
  } else if (typeof value === 'string') {
    // 尝试解析 ISO 日期字符串或其他常见格式
    date = new Date(value);
  } else {
    return String(value);
  }

  // 验证日期有效性
  if (isNaN(date.getTime())) {
    return String(value);
  }

  // 逐 token 替换，每次只替换一个 token 类型
  let result = format;
  for (const token of DATE_TOKENS) {
    result = result.replace(token.pattern, token.replacer(date));
  }

  return result;
}

/**
 * 判断值是否为真值（用于 checkbox/switch 渲染器）
 *
 * @param value - 任意值
 * @returns 布尔值
 */
export function isTruthy(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}
