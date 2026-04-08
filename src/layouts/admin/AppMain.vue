<!-- 主内容区容器组件 -->
<template>
  <!-- Vuetify主内容区域，自动撑开剩余空间 -->
  <v-main>
    <!--
      使用 slot 渲染父组件传入的内容（包含 router-view），
      不再自行包含 <router-view>，避免重复渲染出口，由上层布局决定动态页面内容。
    -->
    <slot />
  </v-main>
</template>
