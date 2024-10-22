<template>
  <v-app>
    <v-main>
      <v-btn @click="showRoutes">测试123</v-btn>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { w2Router } from '@/stores/router';

const router = w2Router();

function showRoutes() {
  const routes = router.getRouter;
  console.log(routes.router);
  const route = routes.router;
  console.log(route[0]);
}
</script>
