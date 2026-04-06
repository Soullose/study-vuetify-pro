<template>
  <v-navigation-drawer
    theme="light"
    :model-value="modelValue"
    :rail="rail"
    permanent
    :mobile-breakpoint="960"
    @update:model-value="$emit('update:modelValue', $event)"
    @update:rail="$emit('update:rail', $event)"
  >
    <SidebarHeader avatar="https://randomuser.me/api/portraits/lego/1.jpg" title="Sandra Adams" subtitle="sandra_a88@gmailcom" />

    <v-divider />

    <SidebarMenu />

    <template #append>
      <SidebarFooter />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import SidebarHeader from './sidebar/SidebarHeader.vue';
import SidebarMenu from './sidebar/SidebarMenu.vue';
import SidebarFooter from './sidebar/SidebarFooter.vue';

defineProps<{
  modelValue: boolean;
  rail: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
  'update:rail': [value: boolean];
}>();
</script>
