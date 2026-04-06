<!--
  @description 登录页面表单组件
  @author Architecture Team
  @date 2026-04-06
  包含用户名/密码输入、记住我复选框、登录按钮和测试账号提示
  支持表单验证、加载状态、键盘导航和暗黑模式
-->
<template>
  <div class="login-form-wrapper">
    <!-- 表单头部 -->
    <div class="form-header">
      <h1 class="form-title">欢迎回来</h1>
      <p class="form-subtitle">请登录您的账号以继续</p>
    </div>

    <!-- 登录表单 -->
    <v-form ref="formRef" v-model="isValid" class="login-form" @submit.prevent="handleLogin">
      <!-- 用户名输入框 -->
      <v-text-field
        v-model="formData.username"
        label="用户名"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        :rules="usernameRules"
        :disabled="loading"
        autocomplete="username"
        density="comfortable"
        class="form-field"
        bg-color="transparent"
        @keyup.enter="focusPassword"
      />

      <!-- 密码输入框 -->
      <v-text-field
        ref="passwordRef"
        v-model="formData.password"
        label="密码"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :rules="passwordRules"
        :disabled="loading"
        autocomplete="current-password"
        density="comfortable"
        class="form-field"
        bg-color="transparent"
        @click:append-inner="showPassword = !showPassword"
        @keyup.enter="handleLogin"
      />

      <!-- 记住我 -->
      <div class="form-options">
        <v-checkbox
          v-model="formData.rememberMe"
          label="记住我"
          density="compact"
          hide-details
          color="primary"
          class="remember-me-checkbox"
        />
      </div>

      <!-- 登录按钮 -->
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        :disabled="!isValid || loading"
        class="login-btn"
        rounded="lg"
      >
        <template #prepend>
          <v-icon icon="mdi-login-variant" />
        </template>
        登 录
      </v-btn>
    </v-form>

    <!-- 测试账号提示 -->
    <v-alert
      type="info"
      variant="tonal"
      density="comfortable"
      rounded="lg"
      class="test-account-alert"
    >
      <template #prepend>
        <v-icon icon="mdi-information-outline" size="20" />
      </template>
      <div class="test-account-content">
        <strong class="test-account-label">测试账号：</strong>
        <div class="test-account-chips">
          <v-chip size="small" color="primary" variant="flat" class="account-chip">
            admin / admin123
          </v-chip>
          <v-chip size="small" color="secondary" variant="flat" class="account-chip">
            user / user123
          </v-chip>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
/**
 * @description 登录页面表单组件
 * 处理用户登录逻辑，包括表单验证、登录请求、记住我功能
 * @emits login-success - 登录成功时触发
 */

import { useSnackbar } from '@/composables/useSnackbar';
import { useAuthStore } from '@/stores/auth';

/** 组件事件定义 */
const emit = defineEmits<{
  /** 登录成功事件 */
  (e: 'login-success'): void;
}>();

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const snackbar = useSnackbar();

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref();
/** 密码输入框引用 */
const passwordRef = ref();
/** 表单是否有效 */
const isValid = ref(false);
/** 是否正在加载 */
const loading = ref(false);
/** 是否显示密码 */
const showPassword = ref(false);

/** 表单数据 */
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// ==================== 验证规则 ====================

/** 用户名验证规则 */
const usernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => v.length >= 2 || '用户名至少 2 个字符'
];

/** 密码验证规则 */
const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => v.length >= 5 || '密码至少 5 个字符'
];

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始化时获取记住的用户名
  const rememberedUsername = authStore.getRememberedUsername();
  if (rememberedUsername) {
    formData.username = rememberedUsername;
    formData.rememberMe = true;
  }
});

// ==================== 方法 ====================

/**
 * 聚焦密码输入框
 * 用于用户名输入框回车后自动跳转
 */
function focusPassword(): void {
  passwordRef.value?.focus();
}

/**
 * 处理登录操作
 * 验证表单 → 调用登录接口 → 跳转页面
 */
async function handleLogin(): Promise<void> {
  // 验证表单
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    await authStore.login(
      {
        username: formData.username,
        password: formData.password
      },
      formData.rememberMe
    );

    snackbar.success('登录成功，正在跳转...');

    // 获取重定向地址或默认首页
    const redirect = (route.query.redirect as string) || '/dashboard';

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      router.push(redirect);
    }, 500);

    emit('login-success');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '登录失败，请重试';
    snackbar.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-form-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

/* 表单头部 */
.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 0.9375rem;
  opacity: 0.6;
  font-weight: 400;
}

/* 表单字段 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field {
  margin-bottom: 8px;
}

/* 表单选项行 */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.remember-me-checkbox {
  margin-top: 0;
  padding-top: 0;
}

/* 登录按钮 */
.login-btn {
  margin-top: 8px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  height: 48px !important;
}

/* 测试账号提示 */
.test-account-alert {
  margin-top: 24px;
}

.test-account-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.test-account-label {
  font-size: 0.8125rem;
}

.test-account-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.account-chip {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
}
</style>
