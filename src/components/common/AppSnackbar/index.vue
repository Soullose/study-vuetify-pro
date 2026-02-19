<template>
  <v-snackbar v-model="state.show" :color="state.color" :timeout="state.timeout" :location="state.location" @update:model-value="close">
    {{ state.message }}

    <template #actions>
      <v-btn variant="text" @click="close">关闭</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { useSnackbar } from '@/composables/useSnackbar';

const { state, close } = useSnackbar();
</script>
