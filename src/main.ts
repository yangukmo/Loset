import router from '@/router'
import store from '@/store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Vue from 'vue'
import App from './App.vue'

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
