<template>
  <div class="icon-picker-container border rounded">
    <div class="px-4 pt-2 bg-grey-lighten-4">
      <v-tabs v-model="activeTab" density="compact">
        <v-tab value="carbon">Carbon</v-tab>
        <v-tab value="mdi">Material</v-tab>
        <v-tab value="fa">Font Awesome</v-tab>
      </v-tabs>

      <v-text-field v-model="searchMap[activeTab]" density="compact" placeholder="搜索图标..." prepend-inner-icon="mdi-magnify" hide-details class="mb-2" />
    </div>

    <div class="icon-grid-container pa-4">
      <template v-if="loadingStates[activeTab]">
        <div class="text-center py-4">
          <v-progress-circular indeterminate />
        </div>
      </template>

      <template v-else>
        <div v-if="!currentIcons.length" class="text-center text-gray-500 py-4">未找到匹配的图标</div>

        <div v-else class="grid grid-cols-8 gap-2">
          <div
            v-for="(icon, index) in currentIcons"
            :key="index"
            class="icon-item cursor-pointer p-2 rounded-lg transition-all"
            :class="{
              'bg-primary/20': modelValue === `${activeTab}:${icon}`,
              'hover:bg-primary/10': modelValue !== `${activeTab}:${icon}`
            }"
            @click="selectIcon(icon)"
          >
            <div class="flex flex-col items-center">
              <span class="text-2xl mb-1" :class="theme.global.name.value === 'dark' ? 'text-white' : 'text-gray-800'">
                <i :class="`i-${activeTab}-${icon}`" />
              </span>
              <span class="text-xs text-gray-500 truncate w-full text-center">
                {{ icon }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IconifyJSON } from '@iconify/types';
import { useTheme } from 'vuetify';

type CollectionType = 'carbon' | 'mdi' | 'fa';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const theme = useTheme();
const activeTab = ref<CollectionType>('carbon');
const searchMap = ref<Record<CollectionType, string>>({
  carbon: '',
  mdi: '',
  fa: ''
});

// 图标数据缓存
interface IconCollections {
  carbon: string[];
  mdi: string[];
  fa: string[];
}
const iconCollections = ref<IconCollections>({
  carbon: [],
  mdi: [],
  fa: []
});

// 加载状态
interface LoadingStates {
  carbon: boolean;
  mdi: boolean;
  fa: boolean;
}
const loadingStates = ref<LoadingStates>({
  carbon: false,
  mdi: false,
  fa: false
});

// 动态加载图标数据
const loadIcons = async (collection: CollectionType) => {
  if (iconCollections.value[collection].length > 0 || loadingStates.value[collection]) return;

  loadingStates.value[collection] = true;
  try {
    const module = (await import(
      /* @vite-ignore */
      `@iconify/json/json/${collection}.json`
    )) as Promise<{ default: IconifyJSON }>;
    const icons = Object.keys((await module).default.icons);
    iconCollections.value[collection] = icons;
  } finally {
    loadingStates.value[collection] = false;
  }
};

// 当前显示的图标
const currentIcons = computed(() => {
  const searchTerm = searchMap.value[activeTab.value].toLowerCase();
  return iconCollections.value[activeTab.value].filter((name) => name.toLowerCase().includes(searchTerm)).slice(0, 300);
});

// 切换标签时加载数据
watch(
  activeTab,
  (newVal) => {
    loadIcons(newVal as CollectionType);
  },
  { immediate: true }
);

const selectIcon = (icon: string) => {
  emit('update:modelValue', `${activeTab.value}:${icon}`);
};
</script>

<style scoped>
.icon-picker-container {
  background: rgba(var(--v-theme-background), 1);
}

.icon-grid-container {
  height: 400px;
  overflow-y: auto;
}

.icon-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.dark {
  .icon-item {
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
