
import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./router.js";
import VueResource from 'vue-resource'
import echarts from 'echarts';
import Vuex from "vuex";
import store from "./store/store.js"
//import 'lib-flexible/flexible'


//Muse-ui及icon
import MuseUI from 'muse-ui';
import "../static/iconfont2/iconfont.css"
import 'muse-ui/dist/muse-ui.css';
import "../static/iconfont/material-icons.css";



const router = new VueRouter({
  // mode:'history',
  // base: '/dist/',
  routes: routes
});

const eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = new Vue();
  }
};

Vue.use(eventBus);

Vue.use(VueRouter);
Vue.use(MuseUI);
Vue.use(Vuex);
Vue.prototype.$echarts= echarts;
Vue.use(VueResource);

//加载页面样式
import './common/sass/index.scss'
import './common/sass/style.scss'

//设置根rem以及相关配置
// import remAndPhoneConfig from './remConfig.js'
// remAndPhoneConfig();

new Vue({
  router,
  store,
  render: h => h(App, router)
}).$mount("#app");
