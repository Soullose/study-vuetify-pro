<template>
  <v-menu min-width="260" transition="slide-y-transition">
    <template #activator="{ props }">
      <v-btn class="text-none" v-bind="props">
        <v-badge color="error" dot bordered :content="items.length">
          <v-icon>{{ icon }}</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-list class="pa-0">
        <v-list-subheader>{{ title }}</v-list-subheader>
        <v-divider />
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>
            <div class="text-truncate">
              <span class="font-weight-medium">{{ item.title }}</span>
              <span v-if="item.subtitle" class="caption text--secondary">&mdash; {{ item.subtitle }}</span>
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
interface NotificationItem {
  title: string;
  subtitle?: string;
}

defineProps<{
  icon: string;
  title: string;
  items: NotificationItem[];
}>();
</script>
