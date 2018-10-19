import Vue from 'vue'
import router from 'vue-router'
//import login from '@/components/login'
import live from '@/components/live'
import login from '@/components/login'
import pwsLogin from '@/components/pwsLogin'
import liveTest from '@/components/liveTest'

Vue.use(router)

export default new router({
  routes: [
    { path: '/', redirect: '/live' }, // 默认跳转此页面
    {
      path: '/live',
      name: 'live',
      component: live
    },{
      path: '/login',
      name: 'login',
      component: login,
     
    },{
      path: '/pwsLogin',
      name: 'pwsLogin',
      component: pwsLogin
      
    },,{
      path: '/liveTest',
      component: liveTest
    }
  ]
})
