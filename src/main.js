import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import echarts from 'echarts'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/reset.css'
Vue.prototype.$echarts = echarts

Vue.prototype.axios = axios
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.use(iView);
const eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = new Vue();
  }
};
Vue.use(eventBus);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
