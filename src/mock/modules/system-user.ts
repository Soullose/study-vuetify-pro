/**
 * mock/modules/system-user.ts
 *
 * 用户管理 Mock 数据
 * 模拟用户列表接口，支持分页、排序、筛选、状态切换、删除
 *
 * @author Architecture Team
 * @date 2026-04-25
 */

import type { MockMethod } from 'vite-plugin-mock';

/** 用户数据接口 */
interface SystemUser {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'disabled' | 'pending';
  gender: 'male' | 'female' | 'unknown';
  enabled: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt: string;
}

/** 部门列表 */
const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部', '法务部'];

/** 角色列表 */
const roles = ['超级管理员', '管理员', '编辑', '普通用户', '访客'];

/** 姓氏 */
const surnames = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡'];

/** 名字 */
const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛'];

/** 随机取数组元素 */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 生成模拟用户数据 */
function generateUsers(count: number): SystemUser[] {
  const users: SystemUser[] = [];
  for (let i = 1; i <= count; i++) {
    const surname = pick(surnames);
    const givenName = pick(givenNames);
    const statusOptions: Array<'active' | 'disabled' | 'pending'> = ['active', 'disabled', 'pending'];
    const genderOptions: Array<'male' | 'female' | 'unknown'> = ['male', 'female', 'unknown'];

    users.push({
      id: `usr-${String(i).padStart(5, '0')}`,
      username: `user_${String(i).padStart(3, '0')}`,
      nickname: `${surname}${givenName}`,
      email: `user${i}@example.com`,
      phone: `1${String(3 + (i % 7))}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      department: departments[i % departments.length],
      role: roles[i % roles.length],
      status: statusOptions[i % 3],
      gender: genderOptions[i % 3],
      enabled: i % 5 !== 0,
      isAdmin: i <= 3,
      createdAt: new Date(2025, 0, 1 + (i % 28), 8 + (i % 10), i % 60, 0).toISOString(),
      lastLoginAt: new Date(2026, 3, 1 + (i % 24), 8 + (i % 12), i % 60, 0).toISOString()
    });
  }
  return users;
}

// 预生成 200 条用户数据
const allUsers = generateUsers(200);

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
  /**
   * 获取用户列表（分页）
   * GET /api/system/users
   */
  {
    url: '/api/system/users',
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
      const filterRole = query.filterRole || '';
      const searchKeyword = query.keyword || '';

      // 筛选
      let filtered = [...allUsers];
      if (filterStatus) {
        filtered = filtered.filter((u) => u.status === filterStatus);
      }
      if (filterDepartment) {
        filtered = filtered.filter((u) => u.department === filterDepartment);
      }
      if (filterRole) {
        filtered = filtered.filter((u) => u.role === filterRole);
      }
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        filtered = filtered.filter(
          (u) => u.username.toLowerCase().includes(kw) || u.nickname.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || u.phone.includes(kw)
        );
      }

      // 排序
      if (sortField) {
        filtered.sort((a, b) => {
          const aVal = String(a[sortField as keyof SystemUser] ?? '');
          const bVal = String(b[sortField as keyof SystemUser] ?? '');
          const cmp = aVal.localeCompare(bVal, 'zh-CN');
          return sortOrder === 'desc' ? -cmp : cmp;
        });
      }

      // 分页
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const rows = filtered.slice(start, start + pageSize);

      return {
        code: 200,
        message: 'success',
        data: { rows, total, page, pageSize }
      };
    }
  },

  /**
   * 切换用户启用状态
   * PUT /api/system/users/:id/toggle-status
   */
  {
    url: '/api/system/users/toggle-status',
    method: 'put',
    response: ({ body }: { body: { id: string; enabled: boolean } }) => {
      const user = allUsers.find((u) => u.id === body.id);
      if (user) {
        user.enabled = body.enabled;
      }
      return {
        code: 200,
        message: 'success',
        data: { id: body.id, enabled: body.enabled }
      };
    }
  },

  /**
   * 删除用户
   * DELETE /api/system/users
   */
  {
    url: '/api/system/users',
    method: 'delete',
    response: ({ body }: { body: { ids: string[] } }) => {
      body.ids.forEach((id) => {
        const idx = allUsers.findIndex((u) => u.id === id);
        if (idx >= 0) {
          allUsers.splice(idx, 1);
        }
      });
      return {
        code: 200,
        message: 'success',
        data: { deletedCount: body.ids.length }
      };
    }
  }
];

export default mockMethods;
