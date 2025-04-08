<template>
  <v-app>
    <!-- <v-main> -->
    <v-slide-x-transition>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route" />
      </router-view>
    </v-slide-x-transition>
    <!-- <router-view /> -->
    <!-- </v-main> -->
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
