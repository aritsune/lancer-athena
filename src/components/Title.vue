<template>
  <div class="z-10">
    <h1 class="font-bold leading-none font-display text-7xl md:text-6xl">
      ATHENA
    </h1>
    <div ref="consoleSubtitle" class="subtitle font-console"
      ></div
    >
  </div>
</template>

<script>
import TypeIt from 'typeit'

export default {
  name: 'Title',
  mounted () {
    const typeit = new TypeIt(this.$refs.consoleSubtitle, {
      speed: 35,
      lifeLike: false,
      cursor: false
    })
    typeit.pause(800).type('// LANCER tactical tool').go()
  }
}
</script>

<style scoped>
</style>
