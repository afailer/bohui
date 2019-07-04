<template>
  <div class="home-container" style="width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: flex-start">
    <div class="header">
      <div class="logo">
        <img src="@/images/logo.png">
<!--        <span>{{ title }} </span>-->
      </div>
      <div class="nav">
        <ul>
          <li v-for="(item,index) in navdata" :name="item.id" :key="index" class="list" :class="currentid==item.id?'current':''">
            <div class="listtitle">
              <i class="iconfont icon-yuanlin" v-if="item.id==1"></i>
              <i class="iconfont icon-kongqizhiliang" v-else-if="item.id==2"></i>
              <i class="iconfont icon-hangqing" v-else-if="item.id==3"></i>
              <i class="iconfont icon-qian" v-else-if="item.id==4"></i>
              <Icon type="ios-people" v-else/>
              {{item.name}}
              <i class="ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon"></i>
            </div>
            <ul class="navlist">
              <li :name="itemlist.id" v-for="(itemlist,listindex) in item.secondMenu" :key="listindex" class="listmenu"
                  :class="(currentid==item.id)&&(currentlistid==itemlist.id)?'current':''"
                  @click="changelist(item.id,item.name,itemlist.id,itemlist.name,itemlist.type)">{{itemlist.name}}</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
    <!--    <mycontent v-if="hackReset"></mycontent>-->
  </div>
</template>

<script>
  // @ is an alias to /src
  import mycontent from "@/components/contents.vue";

  import $ from "jquery";
  export default {
    name: "home",
    data() {
      return {
        title: "全国生态环境遥感监测展示平台",
        navdata: null,
        currentid: null,
        currentval: null,
        currentlistid: null,
        currentlistval: null,
        type: null,
        hackReset: false
      };
    },
    components: {
      mycontent: mycontent
    },
    mounted() {
      this.getmenu();
    },
    methods: {
      //获取导航
      getmenu() {
        this.axios({
          method: "get",
          url: this.$store.state.ipaddress + "manager/menu",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).then(res => {
          if (res.status == 200) {
            this.navdata = res.data.data.reverse();
            this.currentid = this.navdata[0].id;
            this.currentval = this.navdata[0].name;
            this.currentlistid = this.navdata[0].secondMenu[0].id;
            this.currentlistval = this.navdata[0].secondMenu[0].name;
            this.type = this.navdata[0].secondMenu[0].type;
            this.$store.commit("changeMenu", [
              this.currentid,
              this.currentval,
              this.currentlistid,
              this.currentlistval,
              this.type
            ]);
            this.$nextTick(() => {
              this.hackReset = true;
            });
          } else {
            alert(res.statusText);
          }
        }).catch(error => {
          console.log(error);
        });
      },
      changelist (id, idval, listid, listval, type) {
        if (type === 2) {
          if (listid === 39) {
            this.$router.push({
              path: 'redline'
            })
          } else if (listid === 40) {
            this.$router.push({
              path: 'active'
            })
          }
        } else {
          if (this.type !== type) {
            this.$router.push({
              path: 'content'
            })
          }
          if ($('.leaflet-popup').length > 0) {
            $('.leaflet-popup').remove();
          }
          this.currentid = id;
          this.currentval = idval;
          this.currentlistid = listid;
          this.currentlistval = listval;
          this.type = type;
          this.$store.commit("changeMenu", [
            this.currentid,
            this.currentval,
            this.currentlistid,
            this.currentlistval,
            this.type
          ]);
        }
      },
      // 弹框信息，type:弹框属性，titles：弹框标题，txt：弹框内容
      instance(type, titles, txt) {
        const title = titles;
        const content = "<p>" + txt + "</p>";
        switch (type) {
          case "info":
            this.$Modal.info({
              title: title,
              content: content
            });
            break;
          case "success":
            this.$Modal.success({
              title: title,
              content: content
            });
            break;
          case "warning":
            this.$Modal.warning({
              title: title,
              content: content
            });
            break;
          case "error":
            this.$Modal.error({
              title: title,
              content: content
            });
            break;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "//at.alicdn.com/t/font_820428_ttmgy5e4e5.css";
  li {
    list-style: none;
  }
  $primary-color: #d05b2f;
  .home-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    height: 65px;
    border-bottom: 1px solid #003452;
    display: flex;
    justify-content: space-between;

    .logo {
      display: flex;
      align-items: center;
      margin-left: 15px;

      img {
        width: 160px;
        line-height:100px;
      }

      span {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-left: 5px;
      }
    }
  }
  .nav {
    z-index: 999999;
    position: fixed;
    right: 10px;
    & > ul {
      display: flex;
      height: 60px;
      font-size: 14px;
      color: #fff;
      .listtitle {
        padding: 0 20px;
        position: relative;
        cursor: pointer;
        z-index: 3;
        line-height: 60px;
        border-bottom: 2px solid transparent;
      }
      .list.current,
      .list:hover {
        .listtitle {
          border-color: $primary-color;
        }
      }
      .list:hover .navlist {
        display: block;
      }
      .listmenu.current,
      .listmenu:hover {
        background: #cc7453;
      }

      .navlist {
        display: none;
        cursor: pointer;
        background: #002035;
        position: absolute;
        top: 52px;
        min-width: 150px;
        overflow: auto;
        margin: 5px 0;
        padding: 5px 0;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        li {
          text-align: center;
          cursor: pointer;
          padding: 7px 16px 8px;
          font-size: 14px !important;
        }
      }
    }
  }

  .ivu-table-wrapper {
    border: none !important;
  }
  .ivu-table,
  .ivu-table td,
  .ivu-table th,
  .ivu-table:before,
  .ivu-table::after {
    color: #fff;
    background: transparent !important;
    border-bottom: 1px solid #225670 !important;
  }

  .ivu-table-cell {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .ivu-table-row-hover,.ivu-table-row-highlight {
    background: #cc7453 !important;
  }

  .ivu-table td,
  .ivu-table th {
    height: 35px !important;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 3px;
    height: 16px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    // border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    // background-color: #555;
    border-radius: 10px;
    background-color: #2268ac;
    background-image: -webkit-linear-gradient(
        90deg,
        #2268ac 25%,
        transparent 25%,
        rgba(131, 191, 246, 0.1) 75%,
        transparent 75%,
        transparent
    );
  }
  .leaflet-popup-content-wrapper {
    background: url(../images/clickbg.png) no-repeat;
    background-size: 100%;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 0 !important;
    box-shadow: none;
  }
  .leaflet-container a.leaflet-popup-close-button {
    top: 4px;
    color: #fff;
  }
  .leaflet-popup-content .title {
    // font-size: 15px;
    // font-weight: bold;
    // padding-left: 20px;
    // height: 26px;
    // line-height: 26px;
    // color:#00192e;
    // letter-spacing: 2px;

    font-size: 18px;
    font-weight: bold;
    padding-top: 30px;
    height: 60px;
    line-height: 26px;
    color:#fff;
    letter-spacing: 2px;

  }
  .leaflet-popup-content .num{
    font-size:18px;
    color:#fff;
  }
  .leaflet-popup-tip{
    background:#d05b2f;
  }
  .leaflet-top.leaflet-right{
    top:62px;
  }
  .leaflet-control-zoom.leaflet-bar.leaflet-control{
    border:none;
    a{
      background: rgba(0, 33, 53, 0.8);
      border: 1px solid #006ca8;
      color:#fff;
    }
  }
</style>
