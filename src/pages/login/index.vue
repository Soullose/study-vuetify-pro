<!--
  @description 登录页面 - 分屏设计风格
  @author Architecture Team
  @date 2026-04-06
  左侧展示 SVG 抽象科技感插画，右侧为登录表单
  支持亮色/暗黑主题切换和响应式布局适配
-->
<template>
  <v-container fluid class="login-page fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- 左侧插画区域 - xs 断点隐藏 -->
      <v-col cols="0" sm="5" md="6" class="illustration-col d-none d-sm-flex">
        <LoginIllustration />
      </v-col>

      <!-- 右侧表单区域 -->
      <v-col cols="12" sm="7" md="6" class="form-col">
        <div class="form-col-inner">
          <!-- 顶部工具栏：主题切换 -->
          <div class="form-toolbar">
            <ThemeToggle />
          </div>

          <!-- 表单内容区域 -->
          <div class="form-content">
            <!-- Logo 区域 -->
            <div class="logo-area">
              <v-avatar size="48" rounded="lg" color="primary" variant="flat">
                <v-icon icon="mdi-shield-check" size="28" color="white" />
              </v-avatar>
            </div>

            <!-- 登录表单 -->
            <LoginForm @login-success="onLoginSuccess" />
          </div>

          <!-- 底部版权信息 -->
          <div class="form-footer">
            <p class="copyright-text">© 2024 Study Vuetify Pro. All rights reserved.</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
/**
 * @description 登录页面主入口
 * 采用分屏设计：左侧 SVG 插画 + 右侧登录表单
 * 使用 blank 布局，支持主题切换和响应式适配
 */
import LoginIllustration from './components/LoginIllustration.vue';
import LoginForm from './components/LoginForm.vue';
import ThemeToggle from './components/ThemeToggle.vue';

// 路由 meta 已移至 src/router/index.ts 手动定义

/**
 * 登录成功回调
 */
function onLoginSuccess(): void {
  // 登录成功后的额外处理（如有需要）
}
</script>

<style scoped>
.login-page {
  overflow: hidden;
}

/* 左侧插画区域 */
.illustration-col {
  position: relative;
  overflow: hidden;
  min-height: 100%;
}

/* 右侧表单区域 */
.form-col {
  position: relative;
  display: flex;
  align-items: stretch;
  background: rgb(var(--v-theme-background));
  transition: background-color 0.3s ease;
}

.form-col-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  position: relative;
}

/* 顶部工具栏 */
.form-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
}

/* 表单内容区域 - 垂直居中 */
.form-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 48px;
}

/* Logo 区域 */
.logo-area {
  margin-bottom: 24px;
}

/* 底部版权信息 */
.form-footer {
  padding: 16px 24px;
  text-align: center;
}

.copyright-text {
  font-size: 0.8125rem;
  opacity: 0.5;
  margin: 0;
}

/* ==================== 响应式适配 ==================== */

/* 平板端适配 */
@media (max-width: 960px) {
  .form-content {
    padding: 24px 32px;
  }
}

/* 移动端适配 */
@media (max-width: 600px) {
  .form-content {
    padding: 24px 20px;
  }

  .form-toolbar {
    padding: 12px 16px;
  }

  .form-footer {
    padding: 12px 16px;
  }
}
</style>
