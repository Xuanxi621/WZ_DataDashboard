<template>
  <div class="wrapper">
    <svg
      width="300"
      height="100"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGradWarm" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e8b10a" stop-opacity="0" />
          <stop offset="50%" stop-color="#e8b10a" stop-opacity="1" />
          <stop offset="100%" stop-color="#e8b10a" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="waveGradWarm1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ea580c" stop-opacity="0" />
          <stop offset="50%" stop-color="#ea580c" stop-opacity="1" />
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,50 Q75,100 150,50 T300,50"
        fill="none"
        stroke="url(#waveGradWarm)"
        stroke-width="2">
        <animate
          attributeName="d"
          values="M0,50 Q75,100 150,50 T300,50; M0,50 Q75,0 150,50 T300,50; M0,50 Q75,100 150,50 T300,50"
          dur="4s"
          begin="0s"
          repeatCount="indefinite" />
      </path>
      <path
        d="M0,50 Q75,0 150,50 T300,50"
        fill="none"
        stroke="url(#waveGradWarm1)"
        stroke-width="2">
        <animate
          attributeName="d"
          values="M0,50 Q75,0 150,50 T300,50; M0,50 Q75,100 150,50 T300,50; M0,50 Q75,0 150,50 T300,50"
          dur="4s"
          begin="0s"
          repeatCount="indefinite" />
      </path>
    </svg>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff5e8;
}
</style>

