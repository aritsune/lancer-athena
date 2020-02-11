<template>
  <div>
    <line-chart :data="data" :colors="['#fff']" :library="{
      borderWidth: 10,
      elements: {
          line: {
              tension: 0,
              width: '5px'
          },
          point:{
              radius: 0
          }
      }
    }"></line-chart>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: {
      1: 100,
      2: 33,
      4: 77
    }
  })
}
</script>

<style>

</style>
