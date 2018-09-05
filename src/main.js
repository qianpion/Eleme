// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Goods from './components/tab/goods'
import Seller from './components/tab/seller'
import Rating from './components/tab/rating'

import './common/stylus/index.styl'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {
  	path:'/goods',
  	component:Goods
  },
  {
  	path:'/rating',
  	component:Rating
  },
  {
  	path:'/seller',
  	component:Seller
  }
]

const router = new VueRouter({
	routes,
	linkActiveClass: 'active'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
