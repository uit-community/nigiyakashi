<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    const windowSizeSet = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    window.addEventListener('resize', () => {
      windowSizeSet()
    })
    windowSizeSet()
  }
})
</script>

<style>
html {
  touch-action: manipulation;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: calc(var(--vh, 1vh) * 100);
}

.container {
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  padding: 1rem 2rem;
  background-color: #fcfcfd;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08),
    0 1px 1px 0 rgba(10, 31, 68, 0.08);
  border: none;
  border-radius: 4px;
}

header {
  position: fixed;
  width: 100%;
  height: 60px;
  background: #fcfcfd;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  font-weight: bold;
  text-align: center;
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
