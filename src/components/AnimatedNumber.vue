<template>
  <span>{{ animatedNumber }}</span>
</template>

<script>
import { TweenLite } from 'gsap'

export default {
  props: {
    number: {
      type: Number,
      required: true
    },
    fixed: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    tweenedNumber: 0
  }),
  mounted () {
    this.tweenedNumber = this.number
  },
  watch: {
    number: function (newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue })
    }
  },
  computed: {
    animatedNumber () {
      return this.tweenedNumber.toFixed(this.fixed)
    }
  }
}
</script>

<style>
</style>
