<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="text-h5">欢迎回来，{{ authStore.displayName }}！</v-card-title>
          <v-card-text>
            <p class="text-body-1">这是您的仪表盘页面，您可以在这里查看系统概览。</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="primary" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-account-group" size="48" class="mr-4" />
            <div>
              <div class="text-h4">1,234</div>
              <div class="text-body-2">用户总数</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-file-document-multiple" size="48" class="mr-4" />
            <div>
              <div class="text-h4">567</div>
              <div class="text-body-2">文档数量</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="warning" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-chart-line" size="48" class="mr-4" />
            <div>
              <div class="text-h4">89%</div>
              <div class="text-body-2">系统健康度</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>快速操作</v-card-title>
          <v-card-text>
            <v-btn color="primary" variant="outlined" class="mr-2 mb-2" to="/profile">
              <v-icon icon="mdi-account" class="mr-2" />
              个人中心
            </v-btn>
            <v-btn color="secondary" variant="outlined" class="mr-2 mb-2" to="/settings">
              <v-icon icon="mdi-cog" class="mr-2" />
              系统设置
            </v-btn>
            <v-btn color="info" variant="outlined" class="mb-2" to="/system/user">
              <v-icon icon="mdi-account-cog" class="mr-2" />
              用户管理
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
/**
 * @description 仪表盘首页 - 展示系统概览和快捷操作
 * @author Architecture Team
 * @date 2026-04-05
 *
 * 注意：本页面由模块注册中心（src/modules/dashboard/index.ts）管理路由，
 * 不使用 definePage() 宏，因为已被 vite.config.mts 排除在文件路由之外。
 */

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
