<template>
  <v-form v-model="valid">
    <v-btn @click="xxxx"></v-btn>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="firstname" :counter="10" label="First name" required :rules="nameRules" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="lastname" :counter="10" label="Last name" required :rules="nameRules"></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="email" label="E-mail" :rules="emailRules" required></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
/// https://uvr.esm.is/guide/extending-routes
// definePage({
//   alias: ['/n/:name'],
//   meta: {
//     requiresAuth: true,
//     keepAlive: true
//   }
// });
const valid = ref(false);
const firstname = ref('');
const lastname = ref('');
const email = ref('');

const nameRules = reactive([
  (value: string | null) => {
    if (value) return true;
    return 'Name is required.';
  },
  (value: string | null) => {
    if (value && value?.length <= 10) return true;
    return 'Name must be less than 10 characters.';
  }
]);

const emailRules = reactive([
  (value: string | null) => {
    if (value) return true;
    return 'E-mail is required.';
  },
  (value: string | null) => {
    if (value && /.+@.+\..+/.test(value)) return true;
    return 'E-mail must be valid.';
  }
]);

function xxxx() {
  // alert('xxxx');
  console.log('xxxx');
}
</script>
