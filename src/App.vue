<template>
  <div class="f" @click="toggleFullScreen">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16 3h6v6h-2V5h-4V3ZM2 3h6v2H4v4H2V3Zm18 16v-4h2v6h-6v-2h4ZM4 19h4v2H2v-6h2v4Z" />
    </svg>
  </div>
  <div class="d" @click="toggleDark">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="currentColor"
        d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 0 1 7.5 2m11.57 1.5l1.43 1.43L4.93 20.5L3.5 19.07L19.07 3.5m-6.18 2.43L11.41 5L9.97 6l.42-1.7L9 3.24l1.75-.12l.58-1.65L12 3.1l1.73.03l-1.35 1.13l.51 1.67m-3.3 3.61l-1.16-.73l-1.12.78l.34-1.32l-1.09-.83l1.36-.09l.45-1.29l.51 1.27l1.36.03l-1.05.87l.4 1.31M19 13.5a5.5 5.5 0 0 1-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15l-.24 3.35l-2.53-2.2m4.33-2.7l1.15-2.77l2.2 2.54l-3.35.23m1.15-4.96l-1.14-2.78l3.34.24l-2.2 2.54M9.63 18.93l2.77 1.15l-2.53 2.19l-.24-3.34Z" />
    </svg>
  </div>
  <VueNaturalFalling :masterConfig="naturalFallingConfig" :easyMode="false" :hide="false" />
  <button class="sd">自定义按钮</button>
</template>
<script>
import VueNaturalFalling from 'vue-natural-falling'
//import VueNaturalFalling from './vue-natural-falling/vue-natural-falling.vue'

export default {
  name: 'App',
  components: {
    VueNaturalFalling
  },
  data() {
    return {
      naturalFallingConfig: {
        //open: true,
        imgNumSetting: [40, 40, 80, 50],
      },
    }
  },
  methods: {
    toggleDark() {
      document.documentElement.classList.toggle('dark')
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }
  },
  created() {

  },
  mounted() {
    document.documentElement.classList.add('dark')
  },
}
</script>

<style>
.sd {
  position: fixed;
  right: 2.5vw;
  bottom: 50vh;
}

.f {
  z-index: 10;
  padding: 10px;
  height: 48px;
  position: fixed;
  right: 2.5vw;
  bottom: 34vh;
  border-radius: 50%;
  background-color: #ccc;
  border: 1px rgb(255, 255, 255) solid;
  cursor: pointer;
}

.d {
  z-index: 10;
  padding: 10px;
  height: 48px;
  position: fixed;
  right: 2.5vw;
  bottom: 22vh;
  border-radius: 50%;
  background-color: #ccc;
  border: 1px rgb(255, 255, 255) solid;
  cursor: pointer;
}

.f:before,
.d:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 5px 4px 8px 3px rgba(150, 150, 150, 0.2);
  border: 1px rgb(255, 255, 255) solid;
}

.f:after,
.d:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset -3px -4px 13px 3px rgba(255, 255, 255, 0.5);
  border: 1px rgb(255, 255, 255) solid;
}

body {
  margin: 0;
  background-image: url('./bg.webp');
  width: 100%;
  min-height: 100vh;
}

.dark body {
  background-image: url('./bg2.webp');
}
</style>
