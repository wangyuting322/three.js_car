<template>
  <router-view />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Vconsole from 'vconsole'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    const vConsole = new Vconsole()
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
