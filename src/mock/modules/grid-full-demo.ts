/**
 * mock/modules/grid-full-demo.ts
 *
 * ProGrid 完整功能演示 Mock 数据
 * 覆盖 string / number / boolean / date / status / tags / progress / image 等字段
 *
 * @author Architecture Team
 * @date 2026-05-07
 */

import type { MockMethod } from 'vite-plugin-mock'

/** 完整演示用数据类型 */
interface DemoEmployee {
  id: string
  name: string
  email: string
  age: number
  salary: number
  department: string
  status: 'active' | 'inactive' | 'pending' | 'archived'
  active: boolean
  joinDate: string
  progress: number
  description: string
  tags: string[]
  avatar: string
  rating: number
  remote: boolean
  level: 'junior' | 'mid' | 'senior' | 'lead'
  region: 'east' | 'west' | 'north' | 'south'
}

const firstNames = ['张伟', '王芳', '李娜', '刘洋', '陈静', '杨帆', '赵敏', '黄磊', '周杰', '吴桐',
  '徐峰', '孙悦', '马超', '朱琳', '胡明', '郭鑫', '何雨', '高远', '林涛', '郑洁']
const lastNames = ['', '', '', '']
const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部']
const statuses: DemoEmployee['status'][] = ['active', 'inactive', 'pending', 'archived']
const levels: DemoEmployee['level'][] = ['junior', 'mid', 'senior', 'lead']
const regions: DemoEmployee['region'][] = ['east', 'west', 'north', 'south']
const tagPool = ['Vue', 'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'Docker', 'K8s', 'SQL']

function generateEmployees(count: number): DemoEmployee[] {
  const employees: DemoEmployee[] = []
  for (let i = 1; i <= count; i++) {
    const fi = i % firstNames.length
    const joinMonth = (i % 12)
    const joinDay = (i % 28) + 1
    employees.push({
      id: `emp-${String(i).padStart(4, '0')}`,
      name: `${firstNames[fi]}`,
      email: `employee${i}@company.com`,
      age: 22 + (i % 28),
      salary: Math.round((8000 + (i % 12) * 1500 + Math.random() * 2000) * 100) / 100,
      department: departments[i % departments.length],
      status: statuses[i % statuses.length],
      active: i % 7 !== 0,
      joinDate: new Date(2020 + (i % 5), joinMonth, joinDay).toISOString(),
      progress: Math.round((i % 10) * 11.11),
      description: `${departments[i % departments.length]}工程师，负责${i % 3 === 0 ? '核心系统' : i % 3 === 1 ? '平台工具' : '业务支撑'}开发。`,
      tags: tagPool.slice(0, 2 + (i % 4)),
      avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
      rating: 1 + (i % 5),
      remote: i % 3 === 0,
      level: levels[i % levels.length],
      region: regions[i % regions.length],
    })
  }
  return employees
}

const allEmployees = generateEmployees(150)

function parseQueryParams(url: string): Record<string, string> {
  const query: Record<string, string> = {}
  const queryString = url.split('?')[1]
  if (!queryString) return query

  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    if (key && value) {
      query[decodeURIComponent(key)] = decodeURIComponent(value)
    }
  })

  return query
}

const mockMethods: MockMethod[] = [
  {
    url: '/api/grid-full-demo/employees',
    method: 'get',
    timeout: 300,
    response: ({ url }: { url: string }) => {
      const query = parseQueryParams(url)

      const page = parseInt(query.page || '1', 10)
      const pageSize = parseInt(query.pageSize || '20', 10)
      const sortField = query.sortField || ''
      const sortOrder = query.sortOrder || 'asc'
      const filterStatus = query.filterStatus || ''
      const filterDepartment = query.filterDepartment || ''
      const filterLevel = query.filterLevel || ''
      const filterRegion = query.filterRegion || ''
      const keyword = query.keyword || ''

      let filtered = [...allEmployees]

      if (filterStatus) {
        filtered = filtered.filter((e) => e.status === filterStatus)
      }
      if (filterDepartment) {
        filtered = filtered.filter((e) => e.department === filterDepartment)
      }
      if (filterLevel) {
        filtered = filtered.filter((e) => e.level === filterLevel)
      }
      if (filterRegion) {
        filtered = filtered.filter((e) => e.region === filterRegion)
      }
      if (keyword) {
        const kw = keyword.toLowerCase()
        filtered = filtered.filter(
          (e) => e.name.toLowerCase().includes(kw) || e.email.toLowerCase().includes(kw)
        )
      }

      if (sortField) {
        filtered.sort((a, b) => {
          const aVal = a[sortField as keyof DemoEmployee]
          const bVal = b[sortField as keyof DemoEmployee]
          let cmp = 0
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            cmp = aVal.localeCompare(bVal)
          } else if (typeof aVal === 'number' && typeof bVal === 'number') {
            cmp = aVal - bVal
          } else {
            cmp = String(aVal).localeCompare(String(bVal))
          }
          return sortOrder === 'desc' ? -cmp : cmp
        })
      }

      const total = filtered.length
      const start = (page - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)

      return {
        code: 200,
        message: 'success',
        data: { rows, total, page, pageSize },
      }
    },
  },

  /**
   * 快速获取全量数据（不带分页）
   * GET /api/grid-full-demo/employees-all
   */
  {
    url: '/api/grid-full-demo/employees-all',
    method: 'get',
    timeout: 200,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: allEmployees.slice(0, 50), // 前端模式只给前 50 条
      }
    },
  },
]

export default mockMethods
