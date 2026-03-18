<template>
  <div class="fill-height d-flex">
    <!-- <v-app> -->
    <!-- v-model:rail="theme.getRail" -->
    <v-navigation-drawer theme="light" v-model="drawerVisible" :rail="theme.getRail" permanent :mobile-breakpoint="960" @update:rail="theme.setRail">
      <v-list>
        <v-list-item slim prepend-avatar="https://randomuser.me/api/portraits/lego/1.jpg" subtitle="sandra_a88@gmailcom" title="Sandra Adams">
          <template v-slot:append>
            <!-- <v-btn icon="mdi-chevron-left" variant="text" @click.stop="theme.toggleAsideMenuFolded"></v-btn> -->
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav slim density="compact" lines="one" indent="0">
        <v-list-item prepend-icon="mdi-home" title="Home" value="Home" to="/" />
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-group fluid>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle">
              <v-list-item-title class="font-weight-bold">测试</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item prepend-icon="mdi-view-dashboard" nav title="Dashboard" value="dashboard" to="/dashboard" />
          <v-list-item prepend-icon="mdi-home" title="Home" value="Home2" to="/" />
          <v-list-item prepend-icon="mdi-image" value="Icon" to="/icon">
            <v-list-item-title>Icon选择器</v-list-item-title>
            <v-list-item-subtitle>Icon选择器</v-list-item-subtitle>
          </v-list-item>
          <v-list-item prepend-icon="mdi-plus" value="Test" to="/test">
            <v-list-item-title>Test123111</v-list-item-title>
            <v-list-item-subtitle>xxxxxx</v-list-item-subtitle>
          </v-list-item>
        </v-list-group>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
      <!-- 底部插槽 -->
      <template #append>
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings"></v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="background" elevation="2" border="b" density="comfortable">
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
        <v-menu min-width="260" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn class="text-none" v-bind="props">
              <v-badge color="error" dot bordered :content="messages.length">
                <v-icon>mdi-email-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-card>
            <v-list class="pa-0">
              <v-list-subheader>消息中心</v-list-subheader>
              <v-divider />
              <v-list-item>
                <v-list-item-title>
                  <div class="text-truncate">
                    <span class="font-weight-medium">New message</span>
                    <span class="caption text--secondary">&mdash; Jane Doe</span>
                  </div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-menu min-width="260" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn class="text-none" v-bind="props">
              <v-badge color="error" dot bordered :content="messages.length">
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-card>
            <v-list class="pa-0">
              <v-list-subheader>系统通知</v-list-subheader>
              <v-divider />
              <v-list-item>
                <v-list-item-title>
                  <div class="text-truncate">
                    <span class="font-weight-medium">New message</span>
                    <span class="caption text--secondary">&mdash; Jane Doe</span>
                  </div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- 用户菜单 -->
        <UserMenu />
      </template>
    </v-app-bar>

    <v-main>
      <!-- 渲染 txxx -->
      <!-- <component :is="txxx" /> -->
      <router-view v-slot="{ Component, route }">
        <v-slide-x-transition mode="out-in">
          <component :is="Component" :key="route.path" />
        </v-slide-x-transition>
      </router-view>
    </v-main>

    <v-footer theme="light" app height="48">
      <v-spacer />
      <span class="text-body-2 mr-2">版权所有</span>
      <span class="text-body-2">W2.com</span>
    </v-footer>
    <!-- </v-app> -->
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';
//
// import { w2RouterStore } from '@/stores/router';

import { themeStore } from '@/stores/framework/theme';
import UserMenu from '@/components/common/UserMenu/index.vue';

const theme = themeStore();
const route = useRoute();
const { mobile } = useDisplay();

// const w2Router = w2RouterStore();

// 消息列表
const messages = ref<string[]>([]);

// 响应式侧边栏可见性
const drawerVisible = computed({
  get: () => !mobile.value,
  set: () => {
    // 移动端切换由 mobile 自动控制
  }
});

// function showRoutes() {
//   console.log('showRoutes');
//   const routes = w2Router.getRouter;
//   console.log(routes.router);
//   const route = routes.router;
//   console.log(route[0]);
// }

// const rail = ref(false);

// const txxx = h('div', 'xxxxxxxxxxxxxxxxxx');
</script>
<style lang="scss" scoped>
@use '@/styles/test';
</style>
