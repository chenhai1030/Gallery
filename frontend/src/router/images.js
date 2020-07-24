 import Vue from 'vue'
 import Router from 'vue-router'
 import Images from '@/components/Images'

 Vue.use(Router)

 export default new Router({
  routes: [
    {
      path: '/',
      name: 'images',
      mode: 'hash',
      component: Images
    }
  ]
})
