<template>
  <v-list-item :prepend-icon="prependIcon" :title="title" :subtitle="subtitle" :value="value" :to="to" :nav="nav" :link="!!to">
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
  prependIcon?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  to?: string;
  nav?: boolean;
}>();
</script>
