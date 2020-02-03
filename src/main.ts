import router from '@/router'
import store from '@/store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import { Compact } from 'vue-color'
import Toasted from 'vue-toasted'
import App from './App.vue'

library.add(fas)
library.add(fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
Vue.component('compact-color-picker', Compact)

Vue.config.productionTip = false
Vue.use(Toasted)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
