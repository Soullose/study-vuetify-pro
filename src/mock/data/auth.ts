import type { UserInfo } from '@/api/modules/auth';

// ==================== Mock 数据定义 ====================

const users: Array<UserInfo & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['*']
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    nickname: '普通用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    email: 'user@example.com',
    phone: '13800138001',
    roles: ['user'],
    permissions: ['dashboard:view', 'profile:view', 'profile:edit']
  }
];

export { users };
