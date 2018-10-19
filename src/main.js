// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//tost
import './components/toast/toast.css';
import Toast from './components/toast/index';
Vue.use(Toast);

//axios
import axios from 'axios'
//Vue.config.productionTip = false
Vue.prototype.$axios= axios
Vue.prototype.HOST = '/api'
Vue.prototype.baseUrl = 'https://weixin.gaosiedu.com/api';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//权限验证
/*router.beforeEach(function (to, from, next) {
  if (to.meta.auth) { // 是否验证
    if (window.localStorage.getItem('token')) { // 是否登录
      console.log('token:' + window.localStorage.getItem('token'))
      next()
    } else { // 未登录则跳转到登录页面
      alert('请登录')
      next({name: 'login', query: {redirect: to.fullPath}})
    }
  } else {
    next()
  }
})*/