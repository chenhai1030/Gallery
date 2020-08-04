 import Vue from 'vue'
 import Router from 'vue-router'
 import Images from '@/components/Images'
 import Search from '@/components/search-panel'
 import Home   from '@/components/Home'

 Vue.use(Router)

 export default new Router({
  routes: [
    {
      path: '/all',
      name: 'images',
      component: Images
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
  ]
})
