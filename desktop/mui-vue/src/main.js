import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Alert from './components/alert/alert.js'

// 引入mui
import mui from '@/assets/MUI/js/mui.js'
import '@/assets/MUI/css/mui.css'
import '@/assets/MUI/js/mui.picker.all.js'
import '@/assets/MUI/css/mui.picker.all.css'

Vue.prototype.$mui = mui

Vue.prototype.$Alert = Alert

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
