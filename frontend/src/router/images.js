 import Vue from 'vue'
 import Router from 'vue-router'
 import Images from '@/components/Images'
 import Search from '@/components/search-panel'

 Vue.use(Router)

 export default new Router({
  routes: [
    {
      path: '/all',
      name: 'images',
      component: Images
    },
    {
      path: '/',
      name: 'search',
      component: Search
    }
  ]
})
