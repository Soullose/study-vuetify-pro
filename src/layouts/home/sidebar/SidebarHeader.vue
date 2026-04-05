<template>
  <v-list>
    <v-list-item slim :prepend-avatar="avatar" :subtitle="subtitle" :title="title">
      <template #append>
        <slot name="append" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
defineProps<{
  avatar?: string;
  title?: string;
  subtitle?: string;
}>();
</script>
