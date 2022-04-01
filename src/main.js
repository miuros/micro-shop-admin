import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import { Button, Form, FormItem, Input } from 'element-ui'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$qs = qs

axios.defaults.baseURL = 'http://miuros.fun:10000/'
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
