<template>
  <vueNaturalFalling :openSetting="openSetting" @setting="setting"/>
</template>
<script>
import vueNaturalFalling from './vue-natural-falling/vue-natural-falling.vue'

export default {
  name: 'App',
  components: {
    vueNaturalFalling
  },
  data() {
    return {
      openSetting:true
    }
  },
  methods: {
    setting() {
      this.openSetting = !this.openSetting
    },
  },
  created() {

  },
  mounted() {
    //console.log(`The initial.`)
  },
}
</script>

<style>
body {
  margin: 0;
}
</style>
