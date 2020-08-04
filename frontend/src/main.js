import Vue from 'vue'
import App from './App.vue'
import router from './router/images.js'

import store from './store'
import Buefy from 'buefy'
import vueMoment from 'vue-moment'
import VueMq from 'vue-mq'

Vue.use(Buefy)
Vue.use(vueMoment)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250
  }
})


Vue.config.productionTip = false

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")