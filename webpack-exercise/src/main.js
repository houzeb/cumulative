
import Vue from 'vue'
import App from './app'

import '../assets/css/index.css'
import '../assets/css/index.less'

console.log('call me make, main')

new Vue({
  render: h => h(App)
}).$mount('#app')
