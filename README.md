# Study Vuetify Pro

> 基于 Vue 3 + Vuetify 3 的企业级后台管理系统框架，采用模块化架构设计，支持动态路由、RBAC 权限控制、多布局切换、主题定制等企业级特性。

---

## 📑 目录

- [✨ 特性概览](#-特性概览)
- [🛠 技术栈](#-技术栈)
- [📁 目录结构](#-目录结构)
- [🏗 架构设计](#-架构设计)
  - [模块注册中心](#模块注册中心-moduleregistry)
  - [布局包裹机制](#布局包裹机制)
  - [路由与导航守卫](#路由与导航守卫)
  - [权限控制流](#权限控制流)
  - [主题与样式系统](#主题与样式系统)
- [🚀 快速开始](#-快速开始)
- [📖 开发指南](#-开发指南)
  - [新建业务模块](#新建业务模块)
  - [新建页面](#新建页面)
  - [新建 API 接口](#新建-api-接口)
  - [新建 Store](#新建-store)
  - [新建 Composable](#新建-composable)
- [🧪 测试指南](#-测试指南)
- [🎭 Mock 数据指南](#-mock-数据指南)
- [📏 代码规范](#-代码规范)
- [📦 构建与部署](#-构建与部署)

---

## ✨ 特性概览

| 特性 | 说明 |
|------|------|
| 🧩 **模块化架构** | 基于 `ModuleRegistry` 的自动模块扫描与注册，业务模块即插即用 |
| 🎨 **多布局系统** | 内置 admin（后台管理）、portal（门户）、blank（空白）三种布局，路由级自动切换 |
| 🔐 **RBAC 权限** | 角色 + 细粒度权限双轨制，支持路由级和按钮级权限控制 |
| 🌓 **主题定制** | Vuetify MD3 Blueprint + 浅/深色主题 + 5 套预设色板，运行时动态切换 |
| 📊 **企业级表格** | 集成 AG Grid，支持虚拟滚动、排序、筛选、分组、Excel 导出等 |
| 🚦 **动态路由** | 后端返回路由配置，前端动态注册，支持菜单树自动构建 |
| 🏷 **多页签** | 类浏览器多标签页，支持右键菜单、刷新、关闭、固定标签 |
| 📡 **Mock 服务** | 开发环境内置 Mock API，支持热更新，前后端并行开发 |
| ⚡ **性能优化** | Vite 构建 + Gzip/Brotli 压缩 + 路由懒加载 + 组件按需导入 + es-toolkit 自动替换 |
| 🔧 **TypeScript** | 全量严格模式，路由元信息类型安全，API 响应泛型约束 |

---

## 🛠 技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue](https://vuejs.org/) | 3.5.26 | Composition API + `<script setup>` |
| [Vuetify](https://vuetifyjs.com/) | 3.11.5 | Material Design 3 组件库 |
| [Vue Router](https://router.vuejs.org/) | 4.6.3 | SPA 路由管理 |
| [Pinia](https://pinia.vuejs.org/) | 3.0.0 | 状态管理（Composition API 风格） |
| [TypeScript](https://www.typescriptlang.org/) | 5.4.2+ | 严格模式（`strict: true`） |

### 构建工具链

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vite](https://vitejs.dev/) | 7.2.2 | 下一代前端构建工具 |
| [vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader) | 2.1.3 | Vuetify 组件按需导入 + 样式 Tree-shaking |
| [vite-plugin-compression2](https://github.com/nonzzz/vite-plugin-compression) | 2.4.0 | Gzip/Brotli 压缩 |
| [vite-plugin-es-toolkit](https://github.com/privatenumber/vite-plugin-es-toolkit) | 1.1.0 | 自动将 lodash-es 替换为高性能 es-toolkit |

### CSS 工具链

| 技术 | 说明 |
|------|------|
| [UnoCSS](https://unocss.dev/) | 即时原子化 CSS 引擎（presetWind3 + presetAttributify + presetIcons） |
| [SASS](https://sass-lang.com/) | Vuetify SASS Variables 覆写，自定义设计令牌 |

### 自动导入插件链

| 技术 | 版本 | 说明 |
|------|------|------|
| [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) | 20.3.0 | 自动导入 Vue / Pinia / Vue Router / Vuetify API |
| [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) | 29.0.0 | 组件自动注册 |
| [unplugin-icons](https://github.com/unplugin/unplugin-icons) | 22.5.0 | 按需图标组件（MDI / Carbon / FontAwesome） |
| [unplugin-fonts](https://github.com/cssninjaStudio/unplugin-fonts) | 1.4.0 | 字体自动加载（Google Fonts + 本地字体） |

### 工具库

| 技术 | 版本 | 说明 |
|------|------|------|
| [es-toolkit](https://github.com/toss/es-toolkit) | 1.45.1 | 高性能工具函数（优先使用，自动替换 lodash-es） |
| [lodash-es](https://lodash.com/) | 4.18.1 | 工具函数库（Tree-shakable） |
| [axios](https://axios-http.com/) | 1.13.5 | HTTP 客户端 |
| [ag-grid-vue3](https://www.ag-grid.com/) | 33.1.1 | 企业级数据表格 |
| [decimal.js](https://mikemcl.github.io/decimal.js/) | 10.6.0 | 高精度数值运算 |

### Mock 与测试

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vitest](https://vitest.dev/) | 3.2.4 | 单元测试框架 |
| [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock) | 3.0.2 | Mock 数据服务 |
| [mockjs-extend](https://github.com/nuysoft/Mock) | 1.7.0 | Mock 数据生成 |

---

## 📁 目录结构

```
study-vuetify-pro/
├── index.html                          # HTML 入口
├── package.json                        # 项目依赖与脚本
├── vite.config.mts                     # Vite 构建配置（插件链、代理、分包策略）
├── tsconfig.json                       # TypeScript 配置（严格模式）
├── tsconfig.node.json                  # Node 环境 TS 配置
├── uno.config.ts                       # UnoCSS 配置（预设、图标集、Web Fonts）
├── .eslintrc.js                        # ESLint 规则
├── .prettierrc.json                    # Prettier 格式化配置
├── .browserslistrc                     # 浏览器兼容范围
├── .editorconfig                       # 编辑器格式统一
├── dynamic.icon.scan.ts                # 动态图标扫描脚本
│
├── env/                                # 环境变量目录（.env / .env.development / .env.production）
│
└── src/
    ├── main.ts                         # 应用入口（创建 Vue 实例、注册插件、挂载）
    ├── App.vue                         # 根组件（<v-app> + <router-view> + 全局 Snackbar）
    ├── vite-env.d.ts                   # Vite 环境类型声明
    ├── auto-imports.d.ts               # 自动导入类型声明（自动生成）
    ├── components.d.ts                 # 组件自动注册类型声明（自动生成）
    │
    ├── core/                           # 🔑 核心架构层
    │   ├── index.ts                    #   统一导出
    │   ├── types.ts                    #   核心类型（ModuleConfig、MenuItem、LayoutName 等）
    │   ├── module-registry.ts          #   模块注册中心（自动扫描、排序、注册路由）
    │   └── layout-wrapper.ts           #   布局包裹器（为路由自动包裹布局组件）
    │
    ├── modules/                        # 📦 业务模块目录（每个子目录 = 一个独立模块）
    │   ├── auth/                       #   认证模块（登录页，blank 布局）
    │   │   ├── index.ts                #     模块配置（ModuleConfig）
    │   │   └── router/index.ts         #     路由定义（ModuleRouteRecord[]）
    │   ├── dashboard/                  #   仪表盘模块（admin 布局）
    │   ├── home/                       #   首页模块（portal 布局）
    │   ├── system/                     #   系统管理模块（用户/角色/权限，admin 布局）
    │   ├── portal/                     #   门户模块
    │   ├── test/                       #   测试/示例模块
    │   └── error/                      #   错误页模块（403/404，order=9999 最后注册）
    │
    ├── pages/                          # 📄 页面组件（按模块组织）
    │   ├── login/                      #   登录页
    │   │   ├── index.vue               #     页面入口
    │   │   └── components/             #     页面私有组件
    │   │       ├── LoginForm.vue       #       登录表单
    │   │       ├── LoginIllustration.vue #     登录插画
    │   │       └── ThemeToggle.vue     #       主题切换
    │   ├── dashboard/                  #   仪表盘页
    │   ├── system/                     #   系统管理页
    │   │   ├── user/                   #     用户管理
    │   │   ├── role/                   #     角色管理
    │   │   └── permission/             #     权限管理
    │   ├── icon/                       #   图标示例页
    │   ├── test/                       #   测试页
    │   ├── 403.vue                     #   禁止访问页
    │   ├── 404.vue                     #   未找到页
    │   └── redirect/[...path].vue      #   重定向中转页
    │
    ├── layouts/                        # 🎨 布局组件
    │   ├── admin.vue                   #   后台管理布局（侧边栏 + 头部 + 标签页 + 内容 + 页脚）
    │   ├── portal.vue                  #   门户布局
    │   ├── blank.vue                   #   空白布局（登录页等）
    │   └── admin/                      #   admin 布局子组件
    │       ├── AppHeader.vue           #     顶部导航栏
    │       ├── AppSidebar.vue          #     侧边栏
    │       ├── AppMain.vue             #     主内容区（<v-main>）
    │       ├── AppFooter.vue           #     页脚
    │       ├── header/                 #     头部子组件
    │       │   ├── HeaderLogo.vue      #       Logo
    │       │   └── NotificationMenu.vue #      通知菜单
    │       └── sidebar/                #     侧边栏子组件
    │           ├── SidebarHeader.vue   #       侧边栏头部
    │           ├── SidebarFooter.vue   #       侧边栏底部
    │           ├── SidebarMenu.vue     #       菜单容器
    │           ├── SidebarMenuGroup.vue #      菜单分组
    │           └── SidebarMenuItem.vue #       菜单项
    │
    ├── components/                     # 🧩 公共组件
    │   ├── common/                     #   通用业务组件
    │   │   ├── AppSnackbar/            #     全局消息提示
    │   │   ├── TagsView/               #     多页签栏
    │   │   ├── RouterViewWrapper/      #     路由视图包装器
    │   │   └── UserMenu/               #     用户下拉菜单
    │   ├── IconPicker.vue              #   图标选择器
    │   ├── AppFooter.vue               #   全局页脚
    │   └── HelloWorld.vue              #   示例组件
    │
    ├── composables/                    # 🎣 组合式函数
    │   └── useSnackbar.ts              #   全局 Snackbar 状态管理
    │
    ├── stores/                         # 📊 Pinia 状态管理
    │   ├── index.ts                    #   Pinia 实例创建
    │   ├── app.ts                      #   应用全局状态
    │   ├── menu.ts                     #   菜单状态
    │   ├── auth/                       #   认证状态（Token、用户信息、权限）
    │   ├── permission/                 #   权限状态（动态路由、菜单树）
    │   ├── settings/                   #   设置状态（主题模式、布局配置）
    │   ├── framework/theme.ts          #   主题布局状态（侧边栏折叠、Rail 模式）
    │   └── tagsView/                   #   多页签状态
    │
    ├── api/                            # 📡 API 接口层
    │   ├── index.ts                    #   Axios 实例（拦截器、统一响应结构）
    │   └── modules/                    #   按模块组织的 API
    │       ├── auth.ts                 #     认证接口（登录/登出/刷新Token/用户信息）
    │       └── permission.ts           #     权限接口（路由/菜单）
    │
    ├── router/                         # 🚦 路由配置
    │   └── index.ts                    #   路由实例 + 导航守卫（7 步验证链）
    │
    ├── plugins/                        # 🔌 插件注册
    │   ├── index.ts                    #   统一注册（Pinia → Vuetify → Router）
    │   ├── vuetify.ts                  #   Vuetify 配置（MD3 Blueprint、中文 locale）
    │   ├── vuetify/theme.ts            #   主题配置（浅/深色主题、自定义颜色令牌）
    │   └── grid/index.ts               #   AG Grid 模块注册
    │
    ├── mock/                           # 🎭 Mock 数据
    │   └── modules/                    #   按模块组织的 Mock API
    │       ├── auth.ts                 #     认证 Mock（登录/登出/用户信息）
    │       └── permission.ts           #     权限 Mock（路由/菜单）
    │
    ├── utils/                          # 🔧 工具函数
    │   ├── permission.ts               #   权限检查（角色/权限/路由级权限）
    │   └── route-transform.ts          #   后端路由 → 前端路由转换 + 菜单树构建
    │
    ├── types/                          # 📝 全局类型声明
    │   └── router.d.ts                 #   Vue Router RouteMeta 类型扩展
    │
    ├── styles/                         # 🎨 全局样式
    │   ├── settings.scss               #   Vuetify SASS Variables 覆写
    │   ├── font.scss                   #   字体定义
    │   └── test.scss                   #   SASS 变量测试/工具
    │
    └── assets/                         # 🖼 静态资源
        ├── logo.svg                    #   SVG Logo
        └── logo.png                    #   PNG Logo
```

---

## 🏗 架构设计

### 模块注册中心（ModuleRegistry）

项目采用**模块化架构**，核心是 [`ModuleRegistry`](src/core/module-registry.ts) 类，它负责自动发现、加载和注册所有业务模块。

#### 工作流程

```
┌──────────────────────────────────────────────────────────────────┐
│                        应用启动                                   │
│                           │                                      │
│                    main.ts 创建 Vue App                           │
│                           │                                      │
│                  registerPlugins(app)                             │
│                     │            │                                │
│               Pinia 注册    Router 创建                           │
│                                  │                               │
│                   moduleRegistry.registerRoutes(router)           │
│                                  │                               │
│                    ┌─────────────┴──────────────┐                │
│                    │  scanModules()              │                │
│                    │  import.meta.glob           │                │
│                    │  '../modules/*/index.ts'    │                │
│                    └─────────────┬──────────────┘                │
│                                  │                               │
│              ┌───────────────────┼───────────────────┐           │
│              ▼                   ▼                   ▼           │
│         auth 模块          dashboard 模块        system 模块      │
│        (order: 1)          (order: 10)          (order: 20)      │
│              │                   │                   │           │
│              └───────────────────┼───────────────────┘           │
│                                  │                               │
│                    getSortedModules()                             │
│                    (按 meta.order 升序排列)                        │
│                                  │                               │
│                    wrapModuleRoutes()                             │
│                    (为每条路由包裹布局组件)                          │
│                                  │                               │
│                    router.addRoute()                              │
│                    (动态注册到 Vue Router)                         │
└──────────────────────────────────────────────────────────────────┘
```

#### 模块配置规范

每个模块必须导出一个符合 [`ModuleConfig`](src/core/types.ts) 接口的对象：

```typescript
// src/modules/example/index.ts
import type { ModuleConfig } from '@/core/types';
import routes from './router';

const exampleModule: ModuleConfig = {
  meta: {
    name: 'example',           // 模块唯一标识（不可重复）
    title: '示例模块',          // 模块显示名称
    icon: 'mdi-puzzle',        // 模块图标
    layout: 'admin',           // 使用的布局：'admin' | 'portal' | 'blank'
    order: 30,                 // 注册顺序（值越小越先注册，catch-all 路由设 9999）
    description: '示例模块描述',
    enabled: true              // 是否启用（false 则跳过注册）
  },
  routes                       // 路由列表（ModuleRouteRecord[]）
};

export default exampleModule;
```

#### 路由定义规范

```typescript
// src/modules/example/router/index.ts
import type { ModuleRouteRecord } from '@/core/types';

const routes: ModuleRouteRecord[] = [
  {
    path: '/example',
    name: 'example',
    component: () => import('@/pages/example/index.vue'),
    meta: {
      title: '示例页面',
      icon: 'mdi-puzzle',
      requireAuth: true,       // 需要登录
      permissions: ['example:view'],  // 所需权限
      keepAlive: true          // 缓存页面
    },
    children: [
      {
        path: 'detail/:id',
        name: 'example-detail',
        component: () => import('@/pages/example/detail.vue'),
        meta: {
          title: '示例详情',
          requireAuth: true
        }
      }
    ]
  }
];

export default routes;
```

### 布局包裹机制

[`wrapRouteWithLayout()`](src/core/layout-wrapper.ts) 函数将模块路由自动包裹对应的布局组件，使动态路由也能使用布局系统。

#### 三种布局

| 布局 | 组件 | 适用场景 |
|------|------|---------|
| `admin` | [`src/layouts/admin.vue`](src/layouts/admin.vue) | 后台管理页面（侧边栏 + 顶部导航 + 多页签） |
| `portal` | [`src/layouts/portal.vue`](src/layouts/portal.vue) | 门户/展示页面 |
| `blank` | [`src/layouts/blank.vue`](src/layouts/blank.vue) | 登录/注册/错误页等独立页面 |

#### 包裹后的路由结构

```javascript
// 原始模块路由
{ path: '/dashboard', name: 'dashboard', component: DashboardPage }

// 包裹 admin 布局后
{
  path: '/dashboard',
  component: AdminLayout,        // ← 布局组件（懒加载）
  children: [
    {
      path: '',                   // ← 空路径匹配父级
      name: 'dashboard',
      component: DashboardPage    // ← 实际页面组件
    }
  ]
}
```

### 路由与导航守卫

[`src/router/index.ts`](src/router/index.ts) 实现了 7 步导航守卫验证链：

```
路由跳转
    │
    ▼
① 设置页面标题（TITLE_PREFIX + meta.title）
    │
    ▼
② 白名单检查（/login、/register、/404、/403 直接放行）
    │
    ▼
③ 初始化/恢复登录状态（从 Storage 恢复 Token）
    │
    ▼
④ 登录状态检查（未登录 → 重定向 /login）
    │
    ▼
⑤ 用户信息验证（无用户信息 → 调用 API 获取）
    │
    ▼
⑥ 动态路由加载（首次进入 → 从后端获取路由并 addRoute）
    │
    ▼
⑦ 权限检查（检查 meta.permissions / meta.roles）
    │
    ▼
  放行 ✓ / 拒绝 → /403
```

### 权限控制流

系统采用 **RBAC 角色 + 细粒度权限** 双轨制：

```
┌─────────────────────────────────────────────────┐
│                  权限控制层级                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  路由级权限（导航守卫）                             │
│  ├── meta.requireAuth: 是否需要登录               │
│  ├── meta.roles: 所需角色（如 ['admin']）         │
│  └── meta.permissions: 所需权限（如 ['user:view']）│
│                                                  │
│  按钮级权限（指令/函数）                            │
│  ├── checkPermission('user:edit')                │
│  ├── checkRole('admin')                          │
│  └── parsePermissionValue() 解析复杂权限表达式     │
│                                                  │
│  数据来源                                         │
│  ├── auth store: userInfo.roles / permissions     │
│  └── permission store: 动态路由 + 菜单树           │
└─────────────────────────────────────────────────┘
```

### 主题与样式系统

项目采用三层样式体系：

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Vuetify Theme（运行时）                 │
│  ├── plugins/vuetify/theme.ts                    │
│  │   ├── MD3 Blueprint                           │
│  │   ├── light / dark 双主题                      │
│  │   └── 自定义颜色令牌（header-bg、sidebar-bg…）  │
│  └── stores/settings/                            │
│      ├── 5 套预设色板                             │
│      └── 运行时动态切换主题色                       │
│                                                  │
│  Layer 2: SASS Variables（编译时）                │
│  └── styles/settings.scss                        │
│      ├── 字体覆写（$body-font-family）             │
│      ├── 自定义工具类（fill-height、h-screen…）    │
│      └── $color-pack: false（减小 CSS 体积）      │
│                                                  │
│  Layer 3: UnoCSS（原子化）                        │
│  └── uno.config.ts                               │
│      ├── presetWind3（Tailwind 兼容）             │
│      ├── presetAttributify（属性化写法）           │
│      ├── presetIcons（图标即类名）                 │
│      └── presetWebFonts（Google Fonts 本地缓存）  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **包管理器**：npm（推荐）/ pnpm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 [http://localhost:4000](http://localhost:4000) 启动。

> Mock API 已内置，可直接使用以下测试账号：
>
> | 用户名 | 密码 | 角色 | 权限 |
> |--------|------|------|------|
> | `admin` | `admin123` | admin | `*`（全部权限） |
> | `user` | `user123` | user | `dashboard:view`、`profile:view`、`profile:edit` |

### 构建生产版本

```bash
npm run build
```

构建流程：`vue-tsc --noEmit`（类型检查） → `vite build`（打包） → `vite-plugin-compression2`（Gzip 压缩）

### 预览生产构建

```bash
npm run preview
```

### 其他命令

```bash
npm run lint        # ESLint 检查并自动修复
npm run test        # 运行 Vitest 测试（watch 模式）
npm run coverage    # 运行测试并生成覆盖率报告
```

---

## 📖 开发指南

### 新建业务模块

以创建「商品管理」模块为例，完整步骤如下：

#### 1. 创建模块目录结构

```
src/modules/product/
├── index.ts              # 模块配置
└── router/
    └── index.ts          # 路由定义
```

#### 2. 编写模块配置

```typescript
// src/modules/product/index.ts
/**
 * @description 商品管理模块
 * @author Your Name
 * @date 2026-04-18
 */
import type { ModuleConfig } from '@/core/types';
import routes from './router';

const productModule: ModuleConfig = {
  meta: {
    name: 'product',
    title: '商品管理',
    icon: 'mdi-shopping',
    layout: 'admin',
    order: 30,
    description: '商品的增删改查管理'
  },
  routes
};

export default productModule;
```

> **无需手动注册** — `ModuleRegistry` 会通过 `import.meta.glob('../modules/*/index.ts')` 自动发现并加载。

#### 3. 编写路由定义

```typescript
// src/modules/product/router/index.ts
/**
 * @description 商品管理路由
 */
import type { ModuleRouteRecord } from '@/core/types';

const routes: ModuleRouteRecord[] = [
  {
    path: '/product',
    name: 'product',
    component: () => import('@/pages/product/index.vue'),
    meta: {
      title: '商品列表',
      icon: 'mdi-shopping',
      requireAuth: true,
      permissions: ['product:view']
    },
    children: [
      {
        path: 'create',
        name: 'product-create',
        component: () => import('@/pages/product/create.vue'),
        meta: {
          title: '新建商品',
          requireAuth: true,
          permissions: ['product:create']
        }
      },
      {
        path: 'edit/:id',
        name: 'product-edit',
        component: () => import('@/pages/product/edit.vue'),
        meta: {
          title: '编辑商品',
          requireAuth: true,
          permissions: ['product:edit']
        }
      }
    ]
  }
];

export default routes;
```

### 新建页面

#### 页面组件模板

```vue
<!-- src/pages/product/index.vue -->
<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-shopping</v-icon>
        商品列表
        <v-spacer />
        <v-btn color="primary" @click="handleCreate">
          <v-icon start>mdi-plus</v-icon>
          新建商品
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- 数据表格 -->
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
      >
        <!-- 操作列 -->
        <template #item.actions="{ item }">
          <v-btn icon variant="text" size="small" @click="handleEdit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small" color="error" @click="handleDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
/**
 * @description 商品列表页面
 * @author Your Name
 * @date 2026-04-18
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const items = ref([]);

const headers = [
  { title: '名称', key: 'name' },
  { title: '价格', key: 'price' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'actions', sortable: false }
];

function handleCreate(): void {
  router.push({ name: 'product-create' });
}

function handleEdit(item: Record<string, unknown>): void {
  router.push({ name: 'product-edit', params: { id: item.id } });
}

function handleDelete(item: Record<string, unknown>): void {
  // 删除逻辑
}

onMounted(async () => {
  loading.value = true;
  try {
    // 调用 API 加载数据
  } finally {
    loading.value = false;
  }
});
</script>
```

### 新建 API 接口

#### 1. 定义接口类型与函数

```typescript
// src/api/modules/product.ts
/**
 * @description 商品管理 API
 * @author Your Name
 * @date 2026-04-18
 */
import { post, get, put, del } from '../index';

/** 商品信息 */
export interface ProductInfo {
  id: string | number;
  name: string;
  price: number;
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** 创建商品参数 */
export interface CreateProductParams {
  name: string;
  price: number;
  status?: 'active' | 'inactive';
  description?: string;
}

/** 更新商品参数 */
export interface UpdateProductParams extends Partial<CreateProductParams> {
  id: string | number;
}

/** 商品列表查询参数 */
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

/** 获取商品列表 */
export function getProductList(params?: ProductQueryParams): Promise<{ list: ProductInfo[]; total: number }> {
  return get('/product/list', params);
}

/** 获取商品详情 */
export function getProductDetail(id: string | number): Promise<ProductInfo> {
  return get(`/product/detail/${id}`);
}

/** 创建商品 */
export function createProduct(data: CreateProductParams): Promise<ProductInfo> {
  return post('/product/create', data);
}

/** 更新商品 */
export function updateProduct(data: UpdateProductParams): Promise<ProductInfo> {
  return put(`/product/update/${data.id}`, data);
}

/** 删除商品 */
export function deleteProduct(id: string | number): Promise<void> {
  return del(`/product/delete/${id}`);
}
```

#### 2. 创建对应 Mock 数据（开发环境）

参见 [Mock 数据指南](#-mock-数据指南)。

### 新建 Store

```typescript
// src/stores/product/index.ts
/**
 * @description 商品状态管理
 * @author Your Name
 * @date 2026-04-18
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProductInfo, ProductQueryParams } from '@/api/modules/product';
import * as productApi from '@/api/modules/product';

export const useProductStore = defineStore('product', () => {
  // ==================== State ====================

  /** 商品列表 */
  const products = ref<ProductInfo[]>([]);

  /** 当前选中商品 */
  const currentProduct = ref<ProductInfo | null>(null);

  /** 加载状态 */
  const loading = ref(false);

  /** 总数 */
  const total = ref(0);

  // ==================== Getters ====================

  /** 活跃商品数量 */
  const activeCount = computed(() =>
    products.value.filter((p) => p.status === 'active').length
  );

  // ==================== Actions ====================

  /**
   * 加载商品列表
   * @param params - 查询参数
   */
  async function fetchProducts(params?: ProductQueryParams): Promise<void> {
    loading.value = true;
    try {
      const result = await productApi.getProductList(params);
      products.value = result.list;
      total.value = result.total;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 加载商品详情
   * @param id - 商品 ID
   */
  async function fetchProductDetail(id: string | number): Promise<void> {
    try {
      currentProduct.value = await productApi.getProductDetail(id);
    } catch (error) {
      console.error('获取商品详情失败:', error);
      throw error;
    }
  }

  return {
    products,
    currentProduct,
    loading,
    total,
    activeCount,
    fetchProducts,
    fetchProductDetail
  };
});
```

### 新建 Composable

```typescript
// src/composables/useProductFilter.ts
/**
 * @description 商品筛选组合式函数
 * @author Your Name
 * @date 2026-04-18
 */
import { ref, computed } from 'vue';
import type { ProductInfo } from '@/api/modules/product';

/** 筛选参数 */
interface FilterParams {
  keyword: string;
  status: 'all' | 'active' | 'inactive';
}

/**
 * 商品筛选逻辑
 * @param products - 商品列表
 * @returns 筛选结果与控制方法
 */
export function useProductFilter(products: Ref<ProductInfo[]>) {
  const filter = ref<FilterParams>({
    keyword: '',
    status: 'all'
  });

  /** 筛选后的商品列表 */
  const filteredProducts = computed(() => {
    let result = products.value;

    // 关键字筛选
    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword)
      );
    }

    // 状态筛选
    if (filter.value.status !== 'all') {
      result = result.filter((p) => p.status === filter.value.status);
    }

    return result;
  });

  /** 重置筛选条件 */
  function resetFilter(): void {
    filter.value = { keyword: '', status: 'all' };
  }

  return {
    filter,
    filteredProducts,
    resetFilter
  };
}
```

---

## 🧪 测试指南

### 测试框架配置

项目使用 [Vitest](https://vitest.dev/) 作为测试框架，配置位于 [`vite.config.mts`](vite.config.mts)：

```typescript
// vite.config.mts 中的测试配置
test: {
  include: ['test/**/*.test.ts']  // 测试文件匹配规则
}
```

### 测试目录结构

```
test/
├── stores/                         # Store 测试
│   ├── auth.test.ts                #   认证 Store 测试
│   └── permission.test.ts          #   权限 Store 测试
├── composables/                    # Composable 测试
│   └── useSnackbar.test.ts         #   Snackbar 测试
├── utils/                          # 工具函数测试
│   ├── permission.test.ts          #   权限工具测试
│   └── route-transform.test.ts     #   路由转换测试
└── core/                           # 核心模块测试
    ├── module-registry.test.ts     #   模块注册中心测试
    └── layout-wrapper.test.ts      #   布局包裹器测试
```

### 编写单元测试

#### 示例 1：测试工具函数

```typescript
// test/utils/permission.test.ts
/**
 * @description 权限工具函数测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parsePermissionValue, type PermissionValue } from '@/utils/permission';

describe('parsePermissionValue', () => {
  it('应正确解析字符串权限', () => {
    const result = parsePermissionValue('user:view');
    expect(result).toEqual({ permissions: ['user:view'] });
  });

  it('应正确解析数组权限', () => {
    const result = parsePermissionValue(['user:view', 'user:edit']);
    expect(result).toEqual({ permissions: ['user:view', 'user:edit'] });
  });

  it('应正确解析对象形式权限', () => {
    const result = parsePermissionValue({
      permission: 'user:view',
      role: 'admin'
    });
    expect(result).toEqual({
      permissions: ['user:view'],
      roles: ['admin']
    });
  });

  it('应正确解析空对象', () => {
    const result = parsePermissionValue({});
    expect(result).toEqual({});
  });
});
```

#### 示例 2：测试 Store

```typescript
// test/stores/settings.test.ts
/**
 * @description 设置 Store 测试
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore, PRESET_COLORS } from '@/stores/settings';

describe('useSettingsStore', () => {
  beforeEach(() => {
    // 每个测试前创建新的 Pinia 实例，确保状态隔离
    setActivePinia(createPinia());
  });

  it('应使用默认主题模式', () => {
    const store = useSettingsStore();
    expect(store.themeMode).toBe('light');
  });

  it('应正确切换主题模式', () => {
    const store = useSettingsStore();
    store.setThemeMode('dark');
    expect(store.themeMode).toBe('dark');
  });

  it('应正确设置主题颜色', () => {
    const store = useSettingsStore();
    const newColors = PRESET_COLORS[1];
    store.setThemeColors(newColors);
    expect(store.themeColors.primary).toBe(newColors.primary);
  });
});
```

#### 示例 3：测试 Composable

```typescript
// test/composables/useSnackbar.test.ts
/**
 * @description Snackbar 组合式函数测试
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useSnackbar } from '@/composables/useSnackbar';

describe('useSnackbar', () => {
  it('初始状态应为隐藏', () => {
    const { state } = useSnackbar();
    expect(state.value.show).toBe(false);
  });

  it('show() 应设置消息和显示状态', () => {
    const { state, show } = useSnackbar();
    show('测试消息', { color: 'success' });

    expect(state.value.show).toBe(true);
    expect(state.value.message).toBe('测试消息');
    expect(state.value.color).toBe('success');
  });

  it('success() 应设置绿色消息', () => {
    const { state, success } = useSnackbar();
    success('操作成功');

    expect(state.value.color).toBe('success');
    expect(state.value.message).toBe('操作成功');
  });

  it('close() 应隐藏 Snackbar', () => {
    const { state, show, close } = useSnackbar();
    show('测试');
    close();

    expect(state.value.show).toBe(false);
  });
});
```

#### 示例 4：测试核心模块

```typescript
// test/core/module-registry.test.ts
/**
 * @description 模块注册中心测试
 */
import { describe, it, expect, vi } from 'vitest';
import type { ModuleConfig } from '@/core/types';

describe('ModuleRegistry', () => {
  it('应正确排序模块（按 order 升序）', () => {
    // 验证排序逻辑
    const modules: ModuleConfig[] = [
      { meta: { name: 'c', title: 'C', layout: 'admin', order: 30 }, routes: [] },
      { meta: { name: 'a', title: 'A', layout: 'admin', order: 10 }, routes: [] },
      { meta: { name: 'b', title: 'B', layout: 'admin', order: 20 }, routes: [] }
    ];

    const sorted = modules.sort((a, b) => (a.meta.order ?? 100) - (b.meta.order ?? 100));
    expect(sorted.map((m) => m.meta.name)).toEqual(['a', 'b', 'c']);
  });

  it('未设置 order 的模块应使用默认值 100', () => {
    const module: ModuleConfig = {
      meta: { name: 'test', title: 'Test', layout: 'admin' },
      routes: []
    };
    expect(module.meta.order ?? 100).toBe(100);
  });
});
```

### 运行测试

```bash
# 运行所有测试（watch 模式）
npm run test

# 运行单个测试文件
npx vitest test/utils/permission.test.ts

# 运行测试并生成覆盖率报告
npm run coverage

# 运行测试一次（CI 模式）
npx vitest run
```

---

## 🎭 Mock 数据指南

### Mock 系统架构

项目使用 `vite-plugin-mock` + `mockjs-extend` 在开发环境提供 Mock API 服务。

```
┌─────────────────────────────────────────────────┐
│  vite.config.mts                                │
│  viteMockServe({                                │
│    mockPath: 'src/mock/modules',  ← Mock 文件目录│
│    enable: command === 'serve',   ← 仅开发环境   │
│    watchFiles: true               ← 热更新      │
│  })                                             │
└─────────────────────────────────────────────────┘
```

### 编写 Mock API

#### 完整示例

```typescript
// src/mock/modules/product.ts
/**
 * @description 商品管理 Mock API
 * @author Your Name
 * @date 2026-04-18
 */
import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

/** 模拟商品数据库 */
const mockProducts = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      name: '@ctitle(3, 10)',           // 中文标题
      price: '@float(10, 1000, 2, 2)',  // 10.00 - 1000.00
      'status|1': ['active', 'inactive'],
      description: '@cparagraph(1, 3)',
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
      updatedAt: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list;

export default [
  /**
   * 获取商品列表
   * GET /api/product/list
   */
  {
    url: '/api/product/list',
    method: 'get',
    timeout: 300,
    response: ({ query }: { query: { page?: string; pageSize?: string; keyword?: string } }) => {
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 10;
      const keyword = query.keyword?.toLowerCase() || '';

      let filtered = mockProducts;
      if (keyword) {
        filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(keyword));
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        code: 200,
        message: 'success',
        data: {
          list: filtered.slice(start, end),
          total: filtered.length
        }
      };
    }
  },

  /**
   * 获取商品详情
   * GET /api/product/detail/:id
   */
  {
    url: '/api/product/detail',
    method: 'get',
    timeout: 200,
    response: ({ query }: { query: { id: string } }) => {
      const product = mockProducts.find((p: any) => String(p.id) === query.id);

      if (!product) {
        return { code: 404, message: '商品不存在', data: null };
      }

      return { code: 200, message: 'success', data: product };
    }
  },

  /**
   * 创建商品
   * POST /api/product/create
   */
  {
    url: '/api/product/create',
    method: 'post',
    timeout: 500,
    response: ({ body }: { body: Record<string, unknown> }) => {
      const newProduct = {
        id: Mock.Random.guid(),
        ...body,
        createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      };

      return { code: 200, message: '创建成功', data: newProduct };
    }
  }
] as MockMethod[];
```

### Mock.js 常用占位符

| 占位符 | 说明 | 示例输出 |
|--------|------|---------|
| `@ctitle(3, 10)` | 中文标题（3-10 字） | `商品管理模块` |
| `@cparagraph(1, 3)` | 中文段落（1-3 句） | `这是一段描述文字...` |
| `@float(10, 1000, 2, 2)` | 浮点数 | `128.50` |
| `@integer(1, 100)` | 整数 | `42` |
| `@datetime("yyyy-MM-dd HH:mm:ss")` | 日期时间 | `2026-04-18 14:30:00` |
| `@guid()` | UUID | `a1b2c3d4-e5f6-...` |
| `@url` | URL | `http://xxx.com/xxx` |
| `@image("200x100")` | 图片 URL | `http://dummyimage.com/200x100` |

---

## 📏 代码规范

### TypeScript 规范

- **严格模式**：`tsconfig.json` 启用 `strict: true`、`strictNullChecks: true`
- **禁止 `any`**：除极特殊情况需注释说明，否则禁止使用 `any` 类型
- **显式类型标注**：函数参数与返回值必须显式标注类型
- **接口定义**：所有数据结构必须通过 `interface` 或 `type` 明确定义
- **路由元信息**：通过 [`src/types/router.d.ts`](src/types/router.d.ts) 扩展 `RouteMeta`，确保类型安全

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `use-product-filter.ts` |
| Vue 组件 | PascalCase | `ProductList.vue` |
| 模块目录 | kebab-case | `src/modules/product-management/` |
| Store 文件 | 目录 + index.ts | `src/stores/product/index.ts` |
| Composable | use 前缀 | `useSnackbar.ts` |
| API 模块 | 与后端模块对应 | `src/api/modules/product.ts` |
| 类型/接口 | PascalCase | `ProductInfo`、`LoginParams` |
| 常量 | UPPER_SNAKE_CASE | `TOKEN_KEY`、`DEFAULT_ROUTE_ORDER` |

### 注释规范

所有代码文件必须包含完整注释：

```typescript
/**
 * @description 文件功能描述
 * @author 作者名
 * @date 创建日期
 */

/**
 * 函数功能说明
 *
 * @param params - 参数说明
 * @returns 返回值说明
 * @throws 可能抛出的异常
 */
function example(params: string): boolean {
  // 关键业务逻辑行内注释
}
```

### ESLint + Prettier

```bash
# 检查并自动修复
npm run lint
```

配置文件：
- [`.eslintrc.js`](.eslintrc.js) — ESLint 规则
- [`.prettierrc.json`](.prettierrc.json) — Prettier 格式化配置
- [`.editorconfig`](.editorconfig) — 编辑器格式统一

---

## 📦 构建与部署

### 构建优化策略

#### 1. 代码分包（Manual Chunks）

[`vite.config.mts`](vite.config.mts) 中配置了 `manualChunks`，将大型依赖拆分为独立 chunk：

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vue: ['vue'],
        pinia: ['pinia'],
        vuetify: ['vuetify'],
        'lodash-es': ['lodash-es'],
        'vue-router': ['vue-router'],
        'ag-grid-vue3': ['ag-grid-vue3'],
        'es-toolkit': ['es-toolkit'],
        'roboto-fontface': ['roboto-fontface']
      }
    }
  }
}
```

#### 2. Gzip 压缩

使用 `vite-plugin-compression2` 自动生成 `.gz` 文件：

```typescript
compression()  // 默认 Gzip，threshold: 10KB
```

#### 3. 生产环境优化

```typescript
esbuild: {
  // 生产环境移除 console 和 debugger
  drop: command === 'serve' ? [] : ['debugger', 'console']
}
```

#### 4. es-toolkit 自动替换

`vite-plugin-es-toolkit` 自动将 `lodash-es` 的等价函数替换为 `es-toolkit` 的高性能实现：

```typescript
// 编写时使用 lodash-es
import { debounce } from 'lodash-es';

// 构建时自动替换为
import { debounce } from 'es-toolkit';
```

### 环境变量

环境变量文件位于 `env/` 目录：

```
env/
├── .env                  # 公共变量
├── .env.development      # 开发环境变量
└── .env.production       # 生产环境变量
```

常用变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | API 基础路径 | `/api` |
| `VITE_APP_TITLE` | 应用标题 | `Study Vuetify Pro` |

### 部署检查清单

- [ ] `npm run build` 零错误零警告通过
- [ ] `vue-tsc --noEmit` 类型检查通过
- [ ] `npm run lint` 代码规范检查通过
- [ ] `npm run test` 所有测试用例通过
- [ ] 服务器启用 Gzip/Brotli 静态压缩
- [ ] 配置 SPA 路由回退（所有路径 → `index.html`）

---

## 📄 License

[MIT](http://opensource.org/licenses/MIT)
