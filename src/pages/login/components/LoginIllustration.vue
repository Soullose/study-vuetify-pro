<!--
  @description 登录页面左侧 SVG 抽象插画组件
  @author Architecture Team
  @date 2026-04-06
  展示现代几何图形科技感插画，支持主题色动态变化和微动画效果
-->
<template>
  <div class="illustration-wrapper">
    <!-- 背景装饰层 -->
    <div class="illustration-bg">
      <div class="bg-circle bg-circle--1" />
      <div class="bg-circle bg-circle--2" />
      <div class="bg-circle bg-circle--3" />
    </div>

    <!-- SVG 插画主体 -->
    <svg
      class="illustration-svg"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 装饰性网格线 -->
      <g class="grid-lines" opacity="0.08">
        <line v-for="i in 10" :key="'h' + i" x1="0" :y1="i * 50" x2="500" :y2="i * 50" stroke="currentColor" stroke-width="0.5" />
        <line v-for="i in 10" :key="'v' + i" :x1="i * 50" y1="0" :x2="i * 50" y2="500" stroke="currentColor" stroke-width="0.5" />
      </g>

      <!-- 中心六边形 -->
      <g class="hexagon-group" transform="translate(250, 230)">
        <!-- 外层六边形 -->
        <polygon
          class="hex hex-outer"
          points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
          stroke-width="2"
          fill="none"
        />
        <!-- 中层六边形 -->
        <polygon
          class="hex hex-mid"
          points="0,-65 56,-32.5 56,32.5 0,65 -56,32.5 -56,-32.5"
          stroke-width="1.5"
          fill="none"
        />
        <!-- 内层六边形 -->
        <polygon
          class="hex hex-inner"
          points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"
          stroke-width="1"
          fill="none"
        />
        <!-- 中心圆点 -->
        <circle class="center-dot" cx="0" cy="0" r="8" />
      </g>

      <!-- 连接线与节点 -->
      <g class="connection-lines">
        <!-- 左上连接 -->
        <line class="conn conn-1" x1="100" y1="100" x2="172" y2="185" stroke-width="1.5" />
        <circle class="node node-1" cx="100" cy="100" r="5" />

        <!-- 右上连接 -->
        <line class="conn conn-2" x1="400" y1="80" x2="328" y2="185" stroke-width="1.5" />
        <circle class="node node-2" cx="400" cy="80" r="5" />

        <!-- 左下连接 -->
        <line class="conn conn-3" x1="80" y1="350" x2="172" y2="275" stroke-width="1.5" />
        <circle class="node node-3" cx="80" cy="350" r="5" />

        <!-- 右下连接 -->
        <line class="conn conn-4" x1="420" y1="370" x2="328" y2="275" stroke-width="1.5" />
        <circle class="node node-4" cx="420" cy="370" r="5" />

        <!-- 顶部连接 -->
        <line class="conn conn-5" x1="250" y1="60" x2="250" y2="140" stroke-width="1.5" />
        <circle class="node node-5" cx="250" cy="60" r="5" />

        <!-- 底部连接 -->
        <line class="conn conn-6" x1="250" y1="400" x2="250" y2="320" stroke-width="1.5" />
        <circle class="node node-6" cx="250" cy="400" r="5" />
      </g>

      <!-- 装饰性圆环 -->
      <circle class="orbit orbit-1" cx="250" cy="230" r="130" stroke-width="0.8" fill="none" stroke-dasharray="8 12" />
      <circle class="orbit orbit-2" cx="250" cy="230" r="160" stroke-width="0.5" fill="none" stroke-dasharray="4 16" />

      <!-- 浮动粒子 -->
      <g class="particles">
        <circle class="particle particle-1" cx="150" cy="150" r="3" />
        <circle class="particle particle-2" cx="350" cy="130" r="2" />
        <circle class="particle particle-3" cx="120" cy="300" r="2.5" />
        <circle class="particle particle-4" cx="380" cy="320" r="3" />
        <circle class="particle particle-5" cx="200" cy="420" r="2" />
        <circle class="particle particle-6" cx="320" cy="80" r="2.5" />
        <circle class="particle particle-7" cx="60" cy="220" r="2" />
        <circle class="particle particle-8" cx="440" cy="240" r="2.5" />
      </g>

      <!-- 数据流线条 -->
      <g class="data-flow" opacity="0.3">
        <path class="flow flow-1" d="M50 250 Q150 200 250 230 T450 210" stroke-width="1" fill="none" />
        <path class="flow flow-2" d="M50 280 Q150 320 250 280 T450 300" stroke-width="1" fill="none" />
      </g>
    </svg>

    <!-- 品牌文字 -->
    <div class="brand-text">
      <div class="brand-logo">
        <v-icon icon="mdi-shield-check" size="32" color="white" />
      </div>
      <h2 class="brand-title">Study Vuetify Pro</h2>
      <p class="brand-subtitle">现代化后台管理系统</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * @description 登录页面左侧 SVG 抽象插画组件
 * 展示现代几何图形科技感插画，包含六边形、连接线、粒子等元素
 * 支持主题色动态变化和 CSS 微动画
 */
</script>

<style scoped>
.illustration-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, #4a6cf7 50%, #6c5ce7 100%);
}

/* 背景装饰圆 */
.illustration-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.bg-circle--1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float-slow 20s ease-in-out infinite;
}

.bg-circle--2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  left: -80px;
  animation: float-slow 15s ease-in-out infinite reverse;
}

.bg-circle--3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-slow 8s ease-in-out infinite;
}

/* SVG 插画 */
.illustration-svg {
  position: relative;
  width: 80%;
  max-width: 400px;
  height: auto;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

/* 六边形样式 */
.hex {
  stroke: rgba(255, 255, 255, 0.8);
}

.hex-outer {
  animation: rotate-slow 30s linear infinite;
}

.hex-mid {
  animation: rotate-slow 20s linear infinite reverse;
}

.hex-inner {
  animation: rotate-slow 15s linear infinite;
}

.center-dot {
  fill: rgba(255, 255, 255, 0.9);
  animation: pulse-dot 3s ease-in-out infinite;
}

/* 连接线与节点 */
.conn {
  stroke: rgba(255, 255, 255, 0.4);
}

.node {
  fill: rgba(255, 255, 255, 0.7);
}

.node-1 { animation: pulse-dot 4s ease-in-out infinite; }
.node-2 { animation: pulse-dot 4s ease-in-out infinite 0.5s; }
.node-3 { animation: pulse-dot 4s ease-in-out infinite 1s; }
.node-4 { animation: pulse-dot 4s ease-in-out infinite 1.5s; }
.node-5 { animation: pulse-dot 4s ease-in-out infinite 2s; }
.node-6 { animation: pulse-dot 4s ease-in-out infinite 2.5s; }

/* 轨道圆环 */
.orbit {
  stroke: rgba(255, 255, 255, 0.2);
}

.orbit-1 {
  animation: rotate-slow 40s linear infinite;
}

.orbit-2 {
  animation: rotate-slow 50s linear infinite reverse;
}

/* 浮动粒子 */
.particle {
  fill: rgba(255, 255, 255, 0.6);
}

.particle-1 { animation: float-particle 6s ease-in-out infinite; }
.particle-2 { animation: float-particle 5s ease-in-out infinite 0.5s; }
.particle-3 { animation: float-particle 7s ease-in-out infinite 1s; }
.particle-4 { animation: float-particle 6s ease-in-out infinite 1.5s; }
.particle-5 { animation: float-particle 5s ease-in-out infinite 2s; }
.particle-6 { animation: float-particle 7s ease-in-out infinite 2.5s; }
.particle-7 { animation: float-particle 6s ease-in-out infinite 3s; }
.particle-8 { animation: float-particle 5s ease-in-out infinite 3.5s; }

/* 数据流线条 */
.flow {
  stroke: rgba(255, 255, 255, 0.5);
  stroke-dasharray: 200;
  animation: dash-flow 4s linear infinite;
}

.flow-2 {
  animation-delay: 2s;
}

/* 品牌文字 */
.brand-text {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 24px;
  color: white;
}

.brand-logo {
  margin-bottom: 12px;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand-subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 400;
  letter-spacing: 1px;
}

/* ==================== 动画定义 ==================== */

@keyframes rotate-slow {
  from { transform-origin: center; }
  to { transform-origin: center; transform: rotate(360deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@keyframes pulse-slow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.06; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes float-particle {
  0%, 100% { transform: translate(0, 0); opacity: 0.6; }
  25% { transform: translate(5px, -8px); opacity: 0.8; }
  50% { transform: translate(-3px, -12px); opacity: 0.4; }
  75% { transform: translate(8px, -5px); opacity: 0.7; }
}

@keyframes dash-flow {
  from { stroke-dashoffset: 400; }
  to { stroke-dashoffset: 0; }
}
</style>
