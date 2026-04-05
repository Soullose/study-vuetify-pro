<template>
  <v-main>
    <router-view v-slot="{ Component, route }">
      <v-slide-x-transition mode="out-in">
        <component :is="Component" :key="route.path" />
      </v-slide-x-transition>
    </router-view>
  </v-main>
</template>
