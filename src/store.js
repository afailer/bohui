import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ipaddress:"http://39.104.185.135:8084/",//host
    code:'000000',//默认全国
    codeval:'全国',
    typeid:1,
    menuid:5,//选中id
    type:0,
    typeval:"生态系统资源量",
    menuval:"全国生态系统",
    areaCode: 620123, // 兰州620100
    dataTime: '2019-01-05',
    areaName: '榆中县',
    leftDataTime: '',
    rightDataTime: ''
  },
  mutations: {
    changeMenu(state,num){
      state.typeid=num[0];
      state.typeval=num[1];
      state.menuid=num[2];
      state.menuval=num[3];
      state.type=num[4];
    },
    changeCode(state,num){
      state.code = num[0];
      state.codeval = num[1];
    },
    changeLeftDataTime (state, time) {
      state.leftDataTime = time
    },
    changeRightDataTime (state, time) {
      state.rightDataTime = time
    }
  },
  actions: {}
})
