<template>
  <v-app>
    <v-app-bar :elevation="2" border="b" flat color="#FFFFFF">
      <template #prepend>
        <a class="d-flex ps-2 ml-3" style="text-decoration: none" href="/">
          <v-responsive style="width: 128px" max-width="128">
            <v-img class="" src="https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify-logo-light.png" />
          </v-responsive>
        </a>
        <div class="px-1" />
      </template>
      <template #append>
        <v-btn @click="showRoutes" block>
          测试1234567
          <template v-slot:append>
            <v-icon color="warning"></v-icon>
          </template>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
//
import { w2Router } from '@/stores/router';

const router = w2Router();

function showRoutes() {
  const routes = router.getRouter;
  console.log(routes.router);
  const route = routes.router;
  console.log(route[0]);
}
</script>
