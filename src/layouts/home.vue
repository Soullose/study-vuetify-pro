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

      <v-list nav density="compact">
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-group dense link>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle">
              <v-list-item-title class="font-weight-bold">测试</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item class="d-flex align-center ml-0" link title="Dashboard" value="dashboard" to="/dashboard">
            <template v-slot:prepend>
              <!-- <div class="d-flex align-center ml-4"> -->
              <v-icon dense>mdi-plus-outline</v-icon>
              <!-- </div> -->
            </template>
          </v-list-item>
          <v-list-item class="d-flex align-center ml-0" link title="Home" value="Home" to="/">
            <template v-slot:prepend>
              <!-- <div class="d-flex align-center ml-4"> -->
              <v-icon dense>mdi-plus-outline</v-icon>
              <!-- </div> -->
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-file-outline" title="Test" value="Test" to="/test"></v-list-item>
        </v-list-group>
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
          测试123
          <!-- <template v-slot:append>
            <v-icon color="warning"></v-icon>
          </template> -->
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <!-- 渲染 txxx -->
      <component :is="txxx" />
      <router-view v-slot="{ Component, route }">
        <transition name="slide">
          <component :is="Component" :key="route" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router/auto';
//
import { w2RouterStore } from '@/stores/router';

import { themeStore } from '@/stores/framework/theme';

const theme = themeStore();

const w2Router = w2RouterStore();

const route = useRoute();

watch(
  () => route.path,
  (newRoute, oldRoute) => {
    console.log('newRoute', newRoute);
    console.log('oldRoute', oldRoute);
  }
);

function showRoutes() {
  console.log('showRoutes');
  const routes = w2Router.getRouter;
  console.log(routes.router);
  const route = routes.router;
  console.log(route[0]);
}

// const rail = ref(false);

const txxx = h('div', 'xxxxxxxxxxxxxxxxxx');
</script>
<style lang="scss" scoped>
@use '@/styles/test';

.v-list-group :deep(.v-list-item) {
  padding-inline-start: test.$spacer !important;
}

.v-list-group--subgroup :deep(.v-list-group__items .v-list-item) {
  padding-inline-start: test.$spacer * 5 !important;
}
</style>
