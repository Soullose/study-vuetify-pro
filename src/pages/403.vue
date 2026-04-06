<template>
  <v-container fluid class="fill-height bg-background">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="120" color="error" class="mb-4">mdi-lock-outline</v-icon>
        <h1 class="text-h4 font-weight-bold text-error mb-4">403</h1>
        <h2 class="text-h5 text-medium-emphasis mb-8">抱歉，您没有权限访问此页面</h2>
        <v-btn color="primary" size="large" prepend-icon="mdi-arrow-left" @click="goBack">返回上一页</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.go(-1);
}

definePage({
  meta: {
    title: '无访问权限',
    requireAuth: false,
    layout: 'blank'
  }
});
</script>
