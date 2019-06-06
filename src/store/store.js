import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var usernames = '';
if(localStorage.getItem("checkdata")){
    usernames=JSON.parse(localStorage.getItem("checkdata")).name;
}
var prov ='';
if(localStorage.getItem("provstorage")){
    var value = localStorage.getItem("provstorage");
    if(value==""||value==undefined){
        prov=""
    }else if(value.slice(0,2)==13){
        prov=130000
    }else{
        prov=JSON.parse(value);
    }
}
var offset = 0;
if(localStorage.getItem("offsetval")){
    offset= localStorage.getItem("offsetval");
}

//初始化
const state = {
    ipaddress:"http://39.104.185.135/qgnq/api/v2/",
    bohuiAddress: "http://10.5.10.169:8084",
    client:'country',//目前展示级别（全国或者地区）--全国
    terminal:'web',//终端
    prov:prov,
    limit:11,
    prodtype:0,
    crop:5,
    cropval:'小麦',
    prodtypeval:'产量预估',
    username:usernames, 
    level:1,
    offset:offset
};

const mutations = {
    changeCrop(state,num){
        state.crop=num[0];
        state.cropval=num[1];
    },
    changeProType(state,num){
        state.prodtype=num[0];
        state.prodtypeval=num[1];
    },
    changeprovclient(state,num){
        state.prov=num[0];
        state.client=num[1];
    },
    changeusername(state,num){
        state.username=num;
    },
    changelevel(state,num){
        state.level=num;
    },
    changeterminal(state,num){
        state.terminal=num;
    },
    changeoffset(state,num){
        state.offset=num;
    },
};


var vuexStore = new Vuex.Store({
    state,
    mutations,
  });

export default vuexStore;