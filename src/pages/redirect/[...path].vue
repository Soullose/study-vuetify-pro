<!--
  重定向中转页面 - 用于实现页签刷新功能

  刷新流程：
  1. 右键点击「刷新」→ store.refreshView 清除缓存
  2. router.push('/redirect/xxx') → 进入此页面
  3. 此页面立即 router.replace('/xxx') → 组件重新创建

  通过设置 meta.requireAuth = false 跳过认证守卫，
  避免此中转页面被添加到 tagsView
-->
<script lang="ts" setup>
/**
 * @description 重定向中转页面 - 用于页签刷新机制
 * @author Architecture Team
 * @date 2026-04-08
 */

/* 设置路由元信息，跳过认证守卫，避免被添加到 tagsView */
definePage({
  meta: {
    requireAuth: false
  }
});

const route = useRoute();
const router = useRouter();

/**
 * 获取重定向目标路径并立即跳转
 * 保留原始查询参数和哈希片段
 */
const pathParam = (route.params as Record<string, string | string[]>).path;
const redirectPath = '/' + (Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam ?? ''));

router.replace({
  path: redirectPath,
  query: route.query as Record<string, string>,
  hash: route.hash
});
</script>

<template>
  <!-- 空模板，此页面仅做中转跳转，不渲染任何内容 -->
  <div />
</template>
