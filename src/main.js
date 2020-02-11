import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './assets/fonts.css'
import './assets/tailwind.css'
import './assets/animations.css'

import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
Vue.use(Chartkick.use(Chart))

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
