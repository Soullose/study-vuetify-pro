<!-- 用户下拉菜单组件 -->
<template>
  <v-menu v-model="menu" location="bottom end" :close-on-content-click="false" offset="8">
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text" class="user-btn px-2">
        <v-avatar size="32" color="primary" class="mr-2">
          <v-img v-if="authStore.avatar" :src="authStore.avatar" alt="avatar" />
          <v-icon v-else icon="mdi-account" />
        </v-avatar>
        <span class="text-body-2 d-none d-sm-inline">{{ authStore.displayName }}</span>
        <v-icon icon="mdi-chevron-down" size="small" class="ml-1" />
      </v-btn>
    </template>

    <v-card min-width="220" rounded="lg" elevation="8">
      <!-- 用户信息头部 -->
      <v-card-text class="pa-4 bg-primary">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white">
            <v-img v-if="authStore.avatar" :src="authStore.avatar" alt="avatar" />
            <v-icon v-else icon="mdi-account" color="primary" size="32" />
          </v-avatar>
          <div class="ml-3 text-white">
            <div class="text-subtitle-1 font-weight-medium">{{ authStore.displayName }}</div>
            <div class="text-caption opacity-80">{{ authStore.userInfo?.email || '暂无邮箱' }}</div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <!-- 菜单项 -->
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-account-outline" title="个人中心" to="/profile" @click="menu = false" />
        <v-list-item prepend-icon="mdi-cog-outline" title="系统设置" to="/settings" @click="menu = false" />
        <v-list-item v-if="authStore.hasRole('admin')" prepend-icon="mdi-shield-account-outline" title="系统管理" to="/system/user" @click="menu = false" />
      </v-list>

      <v-divider />

      <!-- 退出登录 -->
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-logout" title="退出登录" class="text-error" @click="handleLogout" />
      </v-list>
    </v-card>
  </v-menu>

  <!-- 退出确认对话框 -->
  <v-dialog v-model="logoutDialog" max-width="400">
    <v-card rounded="lg">
      <v-card-title class="text-h6">确认退出</v-card-title>
      <v-card-text>您确定要退出登录吗？</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="logoutDialog = false">取消</v-btn>
        <v-btn color="error" variant="flat" :loading="logoutLoading" @click="confirmLogout">确认退出</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';
import { useTagsViewStore } from '@/stores/tagsView';
import { resetRouterInitState } from '@/router';

const router = useRouter();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();
const snackbar = useSnackbar();

// 菜单状态
const menu = ref(false);
const logoutDialog = ref(false);
const logoutLoading = ref(false);

// 处理退出登录
function handleLogout() {
  menu.value = false;
  logoutDialog.value = true;
}

// 确认退出
async function confirmLogout() {
  logoutLoading.value = true;

  try {
    // 1. 调用后端登出接口
    await authStore.logout();

    // 2. 清除权限状态
    permissionStore.resetPermission();

    // 3. 清除标签页状态
    tagsViewStore.delAllViews();

    // 4. 重置路由初始化状态
    resetRouterInitState();

    // 5. 关闭对话框
    logoutDialog.value = false;

    // 6. 显示提示
    snackbar.success('已安全退出');

    // 7. 跳转到登录页
    router.push('/login');
  } catch (error) {
    console.error('退出失败:', error);
    // 即使失败也清除本地状态并跳转
    permissionStore.resetPermission();
    tagsViewStore.delAllViews();
    resetRouterInitState();
    logoutDialog.value = false;
    router.push('/login');
  } finally {
    logoutLoading.value = false;
  }
}
</script>

<style scoped>
.user-btn {
  text-transform: none;
}
</style>
