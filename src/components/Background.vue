<template>
  <div id="background" class="opacity-50 xl:opacity-25">
    <div ref="typed" class="text-black typed font-console lg:hidden" />
    <img src="@/assets/img/bg.png" class="max-w-none in-fade" />
  </div>
</template>

<script>
import TypeIt from 'typeit'

function getTimeString () {
  const now = new Date()
  const hours = now.getHours()

  if (hours > 17 || hours <= 4) return 'evening'
  else if (hours > 11) return 'afternoon'
  else if (hours > 4) return 'morning'
  else return 'day'
}

export default {
  name: 'Background',
  mounted () {
    const typeit = new TypeIt(this.$refs.typed, {
      speed: 10,
      lifeLike: false,
      cursor: true,
      cursorChar: '▋'
    })
    typeit.pause(500).type('>>> ssc.premier-5 boot')
      .pause(100).type('.').pause(100).type('.').pause(100).type('.').pause(100)
      .type(`
- frame OK
- kernel OK
- network OK
- externals OK
`
      )
      .type('- nhp-bootstrap')
      .pause(100).type('.').pause(100).type('.').pause(100).type('.').pause(100)
      .type(`OK=>>ATHENA[csk.id.150131] connected/loaded //
- shackle-stab 100% TTNS 1201d //
- geometry-core OK algebra-core OK
- strategy-core OK tactics-core OK
> lstgt
5.0km?4.9kmO4.3kmO4.2km?4.2kmO4.2kmX3.5kmX3.5kmX3.4km?3.4km?3.4kmO3.2kmO2.5kmX2.5kmO2.5km?2.5km?1.6kmO1.3kmX1.3kmO1165m?1111m?1064mO1062mO964m?856m?847mX821mX730mO679mX673m?658mO597mO593m?540mO529mX516m?467mO425m?406mO377mX329mO300m?262mX201m?133mO115mX88m?69mX

>[Good ${getTimeString()}, pilot.]`)
      .go()
  }
}
</script>

<style scoped>
#background > * {
  z-index: -999;
  user-select: none;
}

.typed {
  position: fixed;
  white-space: pre-wrap;
  top: 50px;
  right: 100px;
  width: 41%;
}

@media screen and (max-width: 768px) {
  .bgImage {
    width: 200vw;
  }
}

</style>
