<template>
  <div id="app" class="min-h-screen px-16 py-8 text-white bg-primary font-body md:py-2 md:px-4">
    <Title class="relative z-10 in-left" />
    <Background class="fixed right-0" />
    <!-- AttackCalculator -->
    <AttackCalculator class="relative z-10 in-fade" />
  </div>
</template>

<script>
import Title from '@/components/Title'
import Background from '@/components/Background'
import AttackCalculator from '@/components/AttackCalculator'

export default {
  name: 'App',
  components: { Title, Background, AttackCalculator }
}
</script>
