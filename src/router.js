
import Vue from "vue";
import VueRouter from "vue-router";
import mains from './components/Mains.vue';
import login from './components/login.vue';

Vue.use(VueRouter)
const router = [
    {
        path : '/',  //到时候地址栏会显示的路径
        name : 'mains',
        component :  mains   // Home是组件的名字，这个路由对应跳转到的组件。。注意component没有加“s”.
    },
    {
        path : '/login',  //到时候地址栏会显示的路径
        name : 'login',
        component :  login   // Home是组件的名字，这个路由对应跳转到的组件。。注意component没有加“s”.
    },
    // {
    //     path : '/login',  //到时候地址栏会显示的路径
    //     name : 'login',
    //     component :  login   // Home是组件的名字，这个路由对应跳转到的组件。。注意component没有加“s”.
    // }
]

export default router;