<template>
  <v-main>
    <!--
      使用 slot 渲染父组件传入的内容（包含 router-view），
      不再自行包含 <router-view>，避免重复渲染出口
    -->
    <slot />
  </v-main>
</template>
