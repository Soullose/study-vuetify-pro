<!-- 登录页面 -->
<template>
  <v-container fluid class="login-container fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <v-card class="login-card elevation-12 rounded-lg">
          <!-- 卡片头部 -->
          <v-card-title class="text-center pt-8 pb-4">
            <v-avatar size="64" color="primary" class="mb-4">
              <v-icon icon="mdi-account-circle" size="48" color="white" />
            </v-avatar>
            <h1 class="text-h4 font-weight-bold">用户登录</h1>
            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">请输入您的账号密码</p>
          </v-card-title>

          <v-divider />

          <!-- 登录表单 -->
          <v-card-text class="px-8 py-6">
            <v-form ref="formRef" v-model="isValid" @submit.prevent="handleLogin">
              <!-- 用户名输入框 -->
              <v-text-field
                v-model="formData.username"
                label="用户名"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="usernameRules"
                :disabled="loading"
                class="mb-3"
                autocomplete="username"
                @keyup.enter="handleLogin"
              />

              <!-- 密码输入框 -->
              <v-text-field
                v-model="formData.password"
                label="密码"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="passwordRules"
                :disabled="loading"
                class="mb-4"
                autocomplete="current-password"
                @click:append-inner="showPassword = !showPassword"
                @keyup.enter="handleLogin"
              />

              <!-- 登录按钮 -->
              <v-btn type="submit" color="primary" size="large" block :loading="loading" :disabled="!isValid || loading">
                <v-icon icon="mdi-login" class="mr-2" />
                登 录
              </v-btn>
            </v-form>

            <!-- 测试账号提示 -->
            <v-alert type="info" variant="tonal" class="mt-6" density="comfortable" rounded="lg">
              <template #prepend>
                <v-icon icon="mdi-information-outline" />
              </template>
              <div class="text-body-2">
                <strong class="d-block mb-2">测试账号：</strong>
                <v-chip size="small" class="mr-2 mb-1" color="primary" variant="flat">admin / admin123</v-chip>
                <v-chip size="small" class="mb-1" color="secondary" variant="flat">user / user123</v-chip>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- 底部版权信息 -->
        <div class="text-center mt-6 text-white">
          <p class="text-body-2 mb-0 opacity-70">© 2024 Study Vuetify Pro. All rights reserved.</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuthStore } from '@/stores/auth';

definePage({
  meta: {
    title: '登录',
    requireAuth: false,
    layout: 'public'
  }
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const snackbar = useSnackbar();

// 表单引用
const formRef = ref();
const isValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);

// 表单数据
const formData = reactive({
  username: 'admin',
  password: 'admin123'
});

// 验证规则
const usernameRules = [(v: string) => !!v || '请输入用户名', (v: string) => v.length >= 2 || '用户名至少 2 个字符'];

const passwordRules = [(v: string) => !!v || '请输入密码', (v: string) => v.length >= 5 || '密码至少 5 个字符'];

// 登录处理
async function handleLogin() {
  // 验证表单
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    await authStore.login({
      username: formData.username,
      password: formData.password
    });

    snackbar.success('登录成功，正在跳转...');

    // 获取重定向地址或默认首页
    const redirect = (route.query.redirect as string) || '/dashboard';

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      router.push(redirect);
    }, 500);
  } catch (error: any) {
    snackbar.error(error.message || '登录失败，请重试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

:deep(.v-field__prepend-inner) {
  color: rgb(var(--v-theme-primary));
}
</style>
