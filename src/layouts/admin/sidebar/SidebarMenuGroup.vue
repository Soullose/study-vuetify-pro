<template>
  <v-list-group fluid>
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="prependIcon">
        <v-list-item-title class="font-weight-bold">{{ title }}</v-list-item-title>
      </v-list-item>
    </template>
    <slot />
  </v-list-group>
</template>

<script setup lang="ts">
defineProps<{
  prependIcon?: string;
  title?: string;
}>();
</script>
