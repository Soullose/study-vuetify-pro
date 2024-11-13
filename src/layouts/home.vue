<template>
  <v-app>
    <!-- v-model:rail="theme.getRail" -->
    <v-navigation-drawer v-model="theme.getAsideMenuFolded" expand-on-hover :rail="theme.getRail" permanent @click="theme.toggleRail">
      <v-list>
        <v-list-item slim prepend-avatar="https://randomuser.me/api/portraits/lego/1.jpg" subtitle="sandra_a88@gmailcom" title="Sandra Adams">
          <template v-slot:append>
            <!-- <v-btn icon="mdi-chevron-left" variant="text" @click.stop="theme.toggleAsideMenuFolded"></v-btn> -->
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
      <!-- 底部插槽 -->
      <template #append>
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings"></v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar :elevation="2" border="b" flat color="#FFFFFF">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="theme.toggleAsideMenuFolded"></v-app-bar-nav-icon>
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

import { themeStore } from '@/stores/framework/theme';

const theme = themeStore();

const router = w2Router();

function showRoutes() {
  const routes = router.getRouter;
  console.log(routes.router);
  const route = routes.router;
  console.log(route[0]);
}

const rail = ref(false);
</script>
