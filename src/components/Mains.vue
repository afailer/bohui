<template>
  <div>
    <!-- header -->
    <mu-appbar style="width: 100%;" color="primary" id="header">
      <mu-button icon slot="left" @click="changenav" v-if="$store.state.terminal=='phone'">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <mu-button flat slot="left" @click="downloadreport" v-if="$store.state.terminal=='web'&&$store.state.prov!=''&&$store.state.prov!=440000">报告下载</mu-button>
      <img src="../image/logo.png" v-if="$store.state.terminal=='web'">
      <span>{{ title }}</span>
      <!-- 手机端 -->
      <mu-button flat slot="right" v-if="$store.state.terminal=='phone'&&$store.state.username==''"  @click="$router.push('/login')">
        <mu-icon  value="account_box"></mu-icon>
      </mu-button>
      <mu-button flat slot="right"  v-if="$store.state.terminal=='phone'&&$store.state.username!=''"  @click="poweropen = !poweropen">
        <mu-icon  value="view_module"></mu-icon>
      </mu-button>
      <mu-menu cover placement="right" :open.sync="poweropen">
        <mu-list slot="content" class="menubox">
          <mu-list-item button v-if="$store.state.terminal=='phone'&&$store.state.prov!=''"  @click="backhome">
            <mu-list-item-title class="menutitle">返回首页</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="logout" v-if="$store.state.username!=''">
            <mu-list-item-title class="menutitle">退出登录</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-menu>
      <!-- pc端 -->
      <mu-button flat slot="right" @click="backhome" v-if="$store.state.terminal=='web'&&$store.state.prov!=''">返回首页</mu-button>
      <mu-button flat slot="right" @click="$router.push('/login')" v-if="$store.state.terminal=='web'&&$store.state.username==''" >登录/注册</mu-button>
      <mu-tooltip v-if="$store.state.terminal=='web'&&$store.state.username!=''"  content="点击查看账号权限" flat slot="right" >
        <mu-button @click="openSimpleDialog">{{$store.state.username}}</mu-button>
      </mu-tooltip>
      <!-- 账号权限+退出登录 -->
      <mu-dialog width="500" :padding="padding" :open.sync="openSimple">
        <div style="cursor:pointer;text-align:right;"><mu-icon value="close" style="color:#000;" @click="closeSimpleDialog">x</mu-icon></div>
        <mu-card style="width: 100%;  margin: 0 auto;background:#f1f1f1;">
          <mu-card-header
            :title="userdata!=null?userdata.name:''"
            :sub-title="userdata!=null?userdata.unit:''">
            <mu-avatar slot="avatar" style="background:transparent;">
              <img src="../image/userhead.png" alt>
            </mu-avatar>
          </mu-card-header>
        </mu-card>
        <div>
          <div style="overflow: hidden;margin-bottom: 10px;">
            <div class="dialogtitle" style="float:left;">申请省市查看列表</div>
            <mu-button color="error" style="float:right;margin-top:20px;" @click="addapply">添加申请</mu-button>
          </div>
          
          <mu-list style="max-height:213px;overflow-y:auto;">
            <mu-list-item
              v-for="items in list"
              :key="items.provs"
              style="border-bottom: 1px solid #d5d5d5;height:40px;">
              <mu-list-item-content>
                <mu-list-item-title v-if="countrygeo!=null">申请省份：{{items.name}}</mu-list-item-title>
              </mu-list-item-content>
              <mu-list-item-action>{{items.auth==1?"允许访问":(items.auth==0?"拒绝访问":"请等待管理员审核")}}</mu-list-item-action>
            </mu-list-item>
          </mu-list>
          <div style="min-height:50px;">
            <div class="addapply" v-show="applyboolean">
              <mu-select
              label="需要申请的省份(可输入搜索)"
              filterable
              v-model="normal.value"
              full-width
              v-if="countrygeo!=null">
              <mu-option
                v-for="option in (countrygeo.features)"
                :key="option.properties.code"
                :label="option.properties.name"
                :value="option.properties.name"
              >{{option.properties.name}}</mu-option>
            </mu-select>
            <mu-button color="success" @click="signapply(normal.value)">确定</mu-button>
          </div>
          </div>
        </div>
        <div id="apply"></div>
        <mu-button slot="actions" flat color="error" @click="logout">退出登录</mu-button>
        <!-- <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button> -->
        
      </mu-dialog>
    </mu-appbar>
    
    <!--导航-->
    <nav v-if="navboolean">
      <span  @click="clickleft" v-if="$store.state.terminal=='web'">
        <mu-icon value="menu" color="white"></mu-icon>
      </span>
      <slidebarnav @listenToNav="navshow" ></slidebarnav>
      <span @click="clickright" v-if="$store.state.terminal=='web'">
        <mu-icon value="menu" color="white"></mu-icon>
      </span>
    </nav>

    <!-- 地图 -->
    <div class="content">
      <chartcontent @listenToVer="verification"  :messages="[leftnum,rightnum]"></chartcontent>
      <p class="infoval" v-if="$store.state.prov!=''&&$store.state.prov!='440000'">
      国家统计局河北调查总队&nbsp;&nbsp;&nbsp;&nbsp;北京师范大学&nbsp;&nbsp;北京尚德智汇科技有限公司
      </p>
      <p class="infoval" v-if="$store.state.prov=='440000'">
        国家统计局广东调查总队&nbsp;&nbsp;&nbsp;&nbsp;北京师范大学&nbsp;&nbsp;北京尚德智汇科技有限公司
      </p>
      <p class="infoval" v-if="$store.state.prov==''">
        北京师范大学&nbsp;&nbsp;北京尚德智汇科技有限公司
      </p>
    </div>
    <mu-snackbar color="error" :position="this.position" :open.sync="this.open">
      {{this.message}}
      <mu-button flat slot="action" color="secondary" @click="changeopen">x</mu-button>
    </mu-snackbar>
  </div>
</template>

<script>
import $ from "jquery";
import slidebarnav from "./slidebarnav.vue";
import chartcontent from "./content.vue";

export default {
  name: "mains",
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      position: "bottom", //msg位置
      message: "", //msg内容
      open: false, //msg显示
      timeout: 1000, //msg显示时间
      msgtimer: null, //msg定时
      title: "全国农情遥感监测系统",
      openSimple: false, //dialog显示
      userdata: null,
      list: [],
      countrygeo: null,
      normal: {
        value: ""
      },
      applyboolean: false,
      leftnum:0,
      rightnum:0,
      navboolean:true,
      padding:200,
      poweropen:false,
    };
  },
  components: {
    slidebarnav,
    chartcontent
  },
  created() {
    window.fullWidth = document.documentElement.clientWidth;
    if(window.fullWidth<1366){
      this.$store.commit("changeterminal","phone");
      this.navboolean=false;
      this.setFontSize();
      //this.setVertical();
    }
    this.verification();
  },
  mounted() {
    if (this.$store.state.terminal == "web") {
      window.fullHeight = document.documentElement.clientHeight;
      $(".content,.contentbox,#map").height(window.fullHeight - 105 + "px");
      $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
      $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
      $(".mychart.commondiv #rightchart").height(window.fullHeight - 540 + "px");
      
      $(".myoverview.commondiv,.mystatistics.commondiv").height(
        (window.fullHeight - 154) / 2 + "px"
      );
      var margintop = ((window.fullHeight - 154) / 2 - 338) / 2;
      if (margintop < 0) {
        margintop = 0;
      }
      $(".mystatistics #staticschart").css({ marginTop: margintop + "px" });
      var top = (window.fullHeight - 154) / 2 - 358;
      if (top < 0) {
        top = 0;
      }
      $(".myoverview.commondiv .overcontents").css({ paddingTop: top + "px" });
      $(".rotation").width(document.documentElement.clientWidth/2-40+"px");
      $(".rotation").css({"marginLeft":-(document.documentElement.clientWidth/4-20)+"px"});
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          $(".content,.contentbox,#map").height(window.fullHeight - 104 + "px");
          $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
          $(".myoverview.commondiv,.mystatistics.commondiv").height(
            (window.fullHeight - 154) / 2 + "px"
          );
          var margintop = ((window.fullHeight - 154) / 2 - 338) / 2;
          if (margintop < 0) {
            margintop = 0;
          }
          $(".mystatistics #staticschart").css({ marginTop: margintop + "px" });
          var top = (window.fullHeight - 154) / 2 - 358;
          if (top < 0) {
            top = 0;
          }
          $(".myoverview.commondiv .overcontents").css({ paddingTop: top + "px" });
          $(".rotation").width(document.documentElement.clientWidth/2-40+"px");
          $(".rotation").css({"marginLeft":-(document.documentElement.clientWidth/4-20)+"px"});
        })();
      };
    }
  },
  methods: {
    //验证
    verification(prov) {
      var currentprov = prov;
      //验证checkdata
      if (localStorage.getItem("checkdata")) {
        var obj = JSON.parse(localStorage.getItem("checkdata"));
        //验证时间是否过期
        var expire = obj.expire;
        var mydate = new Date();

        if (Date.parse(mydate) > Date.parse(expire)) {
          this.showMsg("时间已过期，即将返回首页");
          this.logout();
        } else {
         var changeboolean=false;
          if (localStorage.getItem("provstorage")) {
            if(currentprov=="hebei"){
              //河北省切市
              currentprov = localStorage.getItem("provstorage");
              this.$store.commit("changeprovclient", [currentprov, "hebei"]);
              this.$store.commit("changelevel", 3);
              localStorage.setItem("leveldata", 3);
            }else if(currentprov=="quanguo"){
              //全国
              currentprov = localStorage.getItem("provstorage");
              changeboolean=true;
              
            }else{
              
              if(this.$store.state.prov==130000){
                //河北
                currentprov = 130000;
                changeboolean=true;
                if(localStorage.getItem("timedata")){
                  localStorage.removeItem("timedata");
                  localStorage.removeItem("offsetval");
                   localStorage.setItem("offsetval",0);
                }
              }else{
                currentprov = localStorage.getItem("provstorage");
                changeboolean=true;
              }
            }
          }

          if(changeboolean){
             //省级-验证权限
            var flag = false;
            var provarr = [];
            this.userdata = obj;
            if (obj.provs != null) {
              if (obj.provs.indexOf(",") != -1) {
                provarr = obj.provs.split(",");
              } else {
                provarr.push(obj.provs);
              }

              for (var i = 0; i < provarr.length; i++) {
                if (provarr[i] == currentprov) {
                  flag = true;
                }
              }
              
              if (flag) {
                var params = "";
                if (currentprov == 130000) {
                  params = "hebei";
                  this.title = "河北省农情遥感监测系统";
                  //改变store内的prodType与crop
                  this.$store.commit("changeProType", [0,"产量预估"]);
                  this.$store.commit("changeCrop", [0,"冬小麦"]);
                } else if (currentprov == 440000) {
                  params = "guangdong";
                  this.title = "广东省农情遥感监测系统";
                  //改变store内的prodType与crop
                  this.$store.commit("changeProType", [0,"产量预估"]);
                  this.$store.commit("changeCrop", [9,"早稻"]);
                }

                this.$store.commit("changeprovclient", [currentprov, params]);
                this.$store.commit("changelevel", 2);
                localStorage.setItem("leveldata", 2);
                
              } else {
                if(localStorage.getItem("provstorage")){
                  localStorage.removeItem("provstorage")
                }
                this.showMsg("您的权限不足，即将返回首页");
              }
            } else {
              if(localStorage.getItem("provstorage")){
                  localStorage.removeItem("provstorage")
                }
              this.showMsg("您的权限不足，即将返回首页");
            }
          }
        }
      }
    },
    //返回首页
    backhome() {
      this.$store.commit("changeprovclient", ["", "country"]);
      localStorage.setItem("provstorage", "");
      //改变store内的prodType与crop
      this.$store.commit("changeProType", [0,"产量预估"]);
      this.$store.commit("changeCrop", [5,"小麦"]);
      this.$store.commit("changelevel", 1);
      localStorage.setItem("leveldata", 1);
      this.$router.push({ path: "/", query: { prov: "quanguo" } });
      this.title = "全国农情遥感监测系统";
      if(localStorage.getItem("timedata")){
        localStorage.removeItem("timedata");
        localStorage.removeItem("offsetval");
      }
      if(this.$store.state.terminal=="phone"){
        this.poweropen = !this.poweropen
      }
    },
    //报告下载
    downloadreport(){
      var parm={code:this.$store.state.prov,crop:0}
      window.location.href=this.$store.state.ipaddress + "reports?code=130000&crop=0";
    },
    //手机端导航显示
    changeopen() {
      this.open = false;
    },
    showMsg(msg, boolean) {
      if (this.msgtimer) clearTimeout(this.msgtimer);
      this.open = true;
      if (!boolean) {
        this.msgtimer = setTimeout(() => {
          this.open = false;
        }, this.timeout);
      }
      this.message = msg;
    },
    //点击用户名显示内容
    openSimpleDialog() {
      this.openSimple = true;
      this.userdata= JSON.parse(localStorage.getItem("checkdata"));
      if (this.countrygeo == null) {
        var url = this.$store.state.ipaddress + "maps?level=1";
        this.$http.get(url).then(function(result) {
          if (result.body.status) {
            this.countrygeo = result.body.data;
            //console.log(result.body.data);
            this.$http
              .get(this.$store.state.ipaddress + "auths/apply", {
                params: { uid: this.userdata.id }
              })
              .then(function(results) {
                if (results.body.status) {
                  var data = this.countrygeo.features;
                  var values = results.body.data;
                  for (var j = 0; j < values.length; j++) {
                    var obj = {};
                    obj.auth = values[j].auth;
                    for (var i = 0; i < data.length; i++) {
                      if (data[i].properties.code == values[j].provs) {
                        obj.name = data[i].properties.name;
                      }
                    }
                    this.list.push(obj);
                  }
                } else {
                  this.showMsg(result.body.msg);
                }
              });
          } else {
            this.showMsg(result.body.msg);
          }
        });
      }
    },
    closeSimpleDialog() {
      this.openSimple = false;
    },
    //退出登录
    logout() {
      localStorage.removeItem("checkdata");
      localStorage.removeItem("nav");
      localStorage.removeItem("provstorage");
      localStorage.removeItem("leveldata");
      this.openSimple=false;
      this.$store.commit("changeusername",'');
      this.backhome();
      this.showMsg("退出登录成功");
    },
    //添加申请
    addapply() {
      
      this.applyboolean = true;
      document.getElementById("apply").scrollIntoView();
    },
    //提交申请
    signapply(val) {
      //判断是否已经申请
      var flag = false;
      if (this.list.length > 0) {
        for (var i = 0; i < this.list.length; i++) {
          if(val==''){
            this.showMsg("请选择要申请的地区名称");
            return;
          }else if (this.list[i].name == val) {
            this.showMsg(val + "已在申请列表,请勿多次申请");
            return;
          }
          flag = true;
        }
      }else{
        flag=true;
      }

      if (flag) {
        var prov;
        var data = this.countrygeo.features;
        for (var j = 0; j < data.length; j++) {
          if (data[j].properties.name == val) {
            prov = data[j].properties.code;
          }
        }
        this.$http
          .post(this.$store.state.ipaddress + "auths/apply",
            { uid: this.userdata.id, provs: prov },
            { emulateJSON: true }
          ).then(function(results) {
            if (results.body.status) {
              var obj = { name: val, auth: "请等待管理员审核" };
              this.list.push(obj);
              this.showMsg("提交成功，请等待管理员审核");
              this.applyboolean = false;
            } else {
              this.showMsg(results.body.msg);
            }
          });
      }
    },

    //点击切换收缩
    clickleft(){
      this.leftnum==0?this.leftnum=1:this.leftnum=0;
      if(this.leftnum==0){
        $(".legend.spritesbox").css("left","370px")
      }else{
        $(".legend.spritesbox").css("left","20px")
      }
    },
    clickright(){
      console.log(this.rightnum);
      this.rightnum==0?this.rightnum=1:this.rightnum=0;
      if(this.rightnum==0){
        $(".rightbtn").css("right","381px");
        $(".leaflet-top.leaflet-right").css("right","370px");
      }else{
        $(".rightbtn").css("right","20px");
        $(".leaflet-top.leaflet-right").css("right","10px");

      }
    },

    // 手机端
    changenav(){
      this.navboolean=!this.navboolean;
    },
    //nav显示与否
    navshow(boolean){
      this.navboolean=!this.navboolean;
    },

    setFontSize () {
      // 设计稿宽,以iPhone7的750px为准
      var designW = 750
      var fontRate = 100
      // 适配
      document.getElementsByTagName('html')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      document.getElementsByTagName('body')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      // 监测窗口大小变化
      window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
        document.getElementsByTagName('html')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
        document.getElementsByTagName('body')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      }, false)
      
      
    },
    setVertical (config) {
      let color = config && config.color ? config.color : '#000'
      let txt = config && config.txt ? config.txt : '为了更好的体验，请使用竖屏浏览'
      let images = config && config.images ? config.images : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAADaCAMAAABU68ovAAAAXVBMVEUAAAD29vb////x8fH////////x8fH5+fn29vby8vL////5+fn39/f6+vr////x8fH////////+/v7////09PT////x8fH39/f////////////////////x8fH///+WLTLGAAAAHXRSTlMAIpML+gb4ZhHWn1c2gvHBvq1uKJcC6k8b187lQ9yhhboAAAQYSURBVHja7d3blpowFIDhTUIAOchZDkre/zE7ycySrbUUpsRN2/1fzO18KzEqxEVgTiZNfgmmtxRc8iaR8HNe8x4BtjQePKayYCIoyBSgvNNE1AkNSHqZyLqk97EgUCCHBzZ5mkg7ScvIJuIyOyXBRFxgpqWZyGsAZLB1KjsJi8nutHU4JCRbFRH8tmirI9k8Jx2sqNs8K/m0LQkrktO2crgcgXGB4AiTEsB0hJfo9MGgX7CGcYiYwQxmMOOvZwRhBG8tCoMXjBDeXvWCEcHbi14wgCBmMIMZzGAGM5jxETNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxY6E2rUQxnH2tz9cirlJFwFBJedaPnUv0M7++egPDE8iAJcIDmxwH5wwv9vUviw2kLbVO3TJU5uul/EyB0FoLp4x60PdGUd3qPurrWyjGGTc05u+1dcgI7/+tCCPARWGhH7o5Y7RCf+bH9ctXLp6v2BVDxfqz0oPXeSVaNtINo/1SXDv4dck8IIkbhtC2ol+iouEonTBCbYvVMnXOjxww6s/RFrBUpXHh/gw1rHj5d/qhYn9Gpk2FWh6xRBRX5Oj3Znh2Sq49/L6+y8pB26q9GbE2dbA2mVbx6I+7MfBglLCttm73ZQi7AD3iL4HqjFYJHSPRppqaUaJ3ATpGa+ckpGak2hRRMyqjGMkvl+xyFeSMwjAqcsZgGDdyhl0oNTnDN4yenJGZFGxNChP5/Y3efh6SM2rDOJMzboYxkDMqwyjIGcIw6F+io2FU1IxIm1JqRmgXSkvNKNCXeTpGrU0JNSO2c6LIGPgCS8AuDHz9ta0SXWDtxoDRH+MqlbC2Dt2G2JFRadtQZt2qq/orGowdGb2euxYiqWEpVWhTBnszoNAPdStuQwxqf0aocdWKW4Z+DfszIh8pxJqbuCE4YAC+4bm0evtipjpgJHeFnyyt1Ku2xa0bhjxr27p75rECNwyI9ZwvXkHq+7aTaMEV44YYy/spfgjgjNHaWW+GeUhGEX7tLlVinIFDDSgnOwhi1V6bU0b6tVS9eAERe863g4dRrtiHdc6o+nn5vtyVVgR79Cqt4uL6gfHPQyGqtP2vf7HADGbcYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JjhtOM+J/AgT008yDMkN/dPP9hzS8zAMQN3OEYeekp5YU7KOKXwVXqiY+QS7smcinGKABWdiBgpPJTSMHJ4KidhhPBUSMLw4CmPhKHgKUXCkHsygum71ftNSgCX6bsl8FQyfbcL5EdYsDk0R3j7aiA5wpt5AjKg/2gLJEBD/0Hf2OOf/vRrj6z/7GtP4B3nMKyjHA12kIPSjnJs3FEO0TvKkYJHOWCR+rjJH0Vn6fI5PjNbAAAAAElFTkSuQmCC'
      let div = document.createElement('div')
      div.innerHTML = '<style type="text/css">@-webkit-keyframes rotation{10%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 50%, 60%{transform: rotate(0deg); -webkit-transform: rotate(0deg)} 90%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 100%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} } @keyframes rotation{10%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 50%, 60%{transform: rotate(0deg); -webkit-transform: rotate(0deg)} 90%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 100%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} } #orientLayer{display: none; z-index: 999999;} @media screen and (min-aspect-ratio: 1/1){#orientLayer{display: block;} } .mod-orient-layer{display: none; position: fixed; height: 100%; width: 100%; left: 0; top: 0; right: 0; bottom: 0; background: ' + color + '; z-index: 9997} .mod-orient-layer__content{position: absolute; width: 100%; top: 45%; margin-top: -75px; text-align: center} .mod-orient-layer__icon-orient{background-image: url(' + images + '); display: inline-block; width: 67px; height: 109px; transform: rotate(90deg); -webkit-transform: rotate(90deg); -webkit-animation: rotation infinite 1.5s ease-in-out; animation: rotation infinite 1.5s ease-in-out; -webkit-background-size: 67px; background-size: 67px} .mod-orient-layer__desc{margin-top: 20px; font-size: 15px; color: #fff}</style><div id="orientLayer" class="mod-orient-layer"> <div class="mod-orient-layer__content"> <i class="icon mod-orient-layer__icon-orient"></i> <div class="mod-orient-layer__desc">' + txt + '</div> </div></div>'
      document.getElementsByTagName('body')[0].appendChild(div)
    },
    
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>

