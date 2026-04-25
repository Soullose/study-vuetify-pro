/**
 * mock/modules/grid-demo.ts
 *
 * Grid Demo 页面的 Mock 数据
 * 模拟用户列表接口，支持分页、排序、筛选
 *
 * @author Architecture Team
 * @date 2026-04-19
 */

import type { MockMethod } from 'vite-plugin-mock';

/** 用户数据接口 */
interface MockUser {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'disabled' | 'pending';
  enabled: boolean;
  isAdmin: boolean;
  createdAt: string;
  department: string;
}

/** 部门列表 */
const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部'];

/** 生成模拟用户数据 */
function generateUsers(count: number): MockUser[] {
  const users: MockUser[] = [];
  for (let i = 1; i <= count; i++) {
    const statusOptions: Array<'active' | 'disabled' | 'pending'> = ['active', 'disabled', 'pending'];
    users.push({
      id: `user-${i}`,
      username: `user_${String(i).padStart(3, '0')}`,
      email: `user${i}@example.com`,
      status: statusOptions[i % 3],
      enabled: i % 5 !== 0,
      isAdmin: i === 1 || i === 2,
      createdAt: new Date(2025, 0, 1 + (i % 28), 8 + (i % 10), i % 60, 0).toISOString(),
      department: departments[i % departments.length]
    });
  }
  return users;
}

// 预生成 100 条用户数据
const allUsers = generateUsers(100);

/**
 * 解析查询参数
 * @param url - 请求 URL
 * @returns 解析后的参数对象
 */
function parseQueryParams(url: string): Record<string, string> {
  const query: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (!queryString) return query;

  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) {
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return query;
}

/** Mock 接口定义 */
const mockMethods: MockMethod[] = [
  {
    url: '/api/grid-demo/users',
    method: 'get',
    response: ({ url }: { url: string }) => {
      const query = parseQueryParams(url);

      // 解析分页参数
      const page = parseInt(query.page || '1', 10);
      const pageSize = parseInt(query.pageSize || '20', 10);

      // 解析排序参数
      const sortField = query.sortField || '';
      const sortOrder = query.sortOrder || 'asc';

      // 解析筛选参数
      const filterStatus = query.filterStatus || '';
      const filterDepartment = query.filterDepartment || '';
      const searchKeyword = query.keyword || '';

      // 筛选
      let filtered = [...allUsers];
      if (filterStatus) {
        filtered = filtered.filter((u) => u.status === filterStatus);
      }
      if (filterDepartment) {
        filtered = filtered.filter((u) => u.department === filterDepartment);
      }
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        filtered = filtered.filter((u) => u.username.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw));
      }

      // 排序
      if (sortField) {
        filtered.sort((a, b) => {
          const aVal = String(a[sortField as keyof MockUser] ?? '');
          const bVal = String(b[sortField as keyof MockUser] ?? '');
          const cmp = aVal.localeCompare(bVal);
          return sortOrder === 'desc' ? -cmp : cmp;
        });
      }

      // 分页
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const rows = filtered.slice(start, start + pageSize);

      // 模拟延迟
      return {
        code: 200,
        message: 'success',
        data: {
          rows,
          total,
          page,
          pageSize
        }
      };
    }
  }
];

export default mockMethods;
