<template>
  <div class="box">
    <div class="hovertips" v-show="hoverbool">{{hoverval}}</div>
    <div class="mapid" id="mapid">
      <div class="basemapchange baseicon" @click="showbasemap">
        <div class="mapimg">
          <Icon type="ios-globe-outline" />
        </div>
        <div class="mapselect" v-if="baseboolean">
          <div name="ditu" class="ditu" :class="basemap=='ditu'?'open':''" @click="changebase('ditu')">
            <img src="../images/maplogo.png" alt>
            <span>地图</span>
          </div>
          <div name="rsimage" class="rsimage" :class="basemap=='rsimage'?'open':''" @click="changebase('rsimage')">
            <img src="../images/imglogo.png" alt>
            <span>影像</span>
          </div>
          <div name="dems" class="dems" :class="basemap=='dems'?'open':''" @click="changebase('dems')">
            <img src="../images/demlogo.png" alt>
            <span>地形</span>
          </div>
        </div>
      </div>
      <div class="basemapchange2 baseicon" @click="showchange">
        <div class="mapimg">
          <Icon type="md-eye" v-if="openeye" title="隐藏图层" />
          <Icon type="md-eye-off" v-else title="显示图层" />
        </div>
      </div>
    </div>
    <div class="rightcontent">
      <div class="bottomcontent">
        <div class="mystatistics" v-if="popdata">
          <div class="list">
            <div class="list_l">
              <img src="../images/icon1.png">
            </div>
            <div class="list_r">
              <p class="num">{{popdata[0].num}}</p>
              <p class="title">{{popdata[0].title}}</p>
            </div>
          </div>
          <div class="list">
            <div class="list_l">
              <img src="../images/icon2.png">
            </div>
            <div class="list_r">
              <p class="num">{{popdata[1].num}}</p>
              <p class="title">{{popdata[1].title}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="topcontent">
        <div class="lefttable">
          <div class="contenttitle">{{tabletitleval}}</div>
          <div class="tablebox" :style="'height:'+tableheight">
            <Table :columns="columns" :data="tables" :max-height="tableheight-40"></Table>
          </div>
        </div>
        <div class="rightchart">
          <div class="contenttitle">
            {{charttitleval}}
            <Icon type="md-stats" title="切换到柱状图" v-if="currentshape" @click="changetype('bar')" />
            <Icon type="md-pie" title="切换到饼图" v-if="!currentshape" @click="changetype('pie')" />
          </div>
          <div id="rightchart"></div>
        </div>
      </div>
    </div>
    <!-- 轮播 -->
    <div class="rotation">
      <div class="timebottom">
        <img src="../images/rotationicon2.png">
        <div class="iconbox">
          <i class="iconfont icon-zuo-yuan-tianchong left" title="上一页" @click="changebtn('left')"></i>
          <i class="iconfont icon-iconbofang center" title="播放" v-if="played" @click="changebtn('play')"></i>
          <i class="iconfont icon-zanting center" title="暂停" v-if="!played" @click="changebtn('stop')"></i>
          <i class="iconfont icon-you-yuan-tianchong right" title="下一页" @click="changebtn('right')"></i>
        </div>
      </div>
      <div class="timelist">
        <span class="dates" v-for="(item,index) in times" :key="index" :class="currentdate==item?'current':''" @click="changetime(item)">
          <span class="roicon"></span>
          {{item | filtertime()}}
        </span>
      </div>
    </div>
    <!-- 图例 -->
    <div class="legendbox">
      <div class="legendcontents" v-if="legenddata">
        <div :style="(codeId=='000000'&&typeId==1)||menuId==5?'margin-bottom:0px':'margin-bottom:5px'">图例</div>
        <div v-if="typeId==2&&codeId=='000000'">
          <div class="colorleft">
            <img src="../images/1.png" v-if="menuId==16||menuId==18||menuId==20">
            <img src="../images/2.png" v-else>
          </div>
          <div class="txtright">
            <span>高</span>
            <span>低</span>
          </div>
        </div>
        <div v-for="(item,index) in legenddata" :key="index" :style="(codeId=='000000'&&typeId==1)||menuId==5?'height:auto':'height:10px;'" v-else>
          <i :style="'background:'+item.color"></i>
          {{item.description}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import L from "leaflet";
import prov from "../geom/prov";
import { all } from "q";
import { type } from "os";

export default {
  name: "contents",
  data() {
    return {
      codeId: null,
      typeId: null,
      menuId: null,
      played: true, //roration
      timer: null, //roration定时
      popdata: null, //总体数据
      columns: [],
      tables: [], //表格数据
      tabletitle: [
        {
          5: {
            name: "生态系统",
            area: "面积",
            rate: "变化率"
          },
          others: {
            shortName: "行政区",
            area: "面积",
            rate: "变化率"
          }
        },
        {
          others: {
            shortName: "行政区",
            area: "面积",
            rate: "变化率"
          }
        },
        {
          others: {
            shortName: "行政区",
            area: "面积",
            rate: "变化率"
          }
        },
        {
          others: {
            name: "行政区",
            directVal: "直接价值",
            indirectVal: "间接价值",
            ecologyVal: "生态环境价值",
            sumVal: "总价值"
          }
        }
      ],
      tabletitlearr: [
        "绿地质量（NPP*Veg）",
        "水域质量（反射率）",
        "农田质量（NPP*Veg）",
        "地表温度（℃）",
        "空气质量（PM2.5）"
      ],//生态环境质量状态表格标题
      tableheight: null, //表格高度
      currentdate: null,
      times: [],
      legenddata: null, //图例数据
      legendclass: null, //图例分层
      legendcolor: {
        6: ["#ffaa01", "#ffbb1c", "#fcc72c", "#fdd744", "#ffed7d", "#fffdb3"],//农田
        7: ["#1b5e20", "#2e7d32", "#43a047", "#66bb6a", "#a5d6a7", "#c8e6c9"],//森林
        8: ["#33691e", "#558b2f", "#7cb342", "#9ccc65", "#c5e1a5", "#dcedc8"],//草地
        9: ["#004d40", "#00695c", "#00897b", "#26a69a", "#80cbc4", "#b2dfdb"],//灌木
        10: ["#006fff", "#0a84ff", "#21b5ff", "#32d3ff", "#4af6ff", "#65feea"],//水体
        11: ["#bf360c", "#d84315", "#ff5722", "#ff7043", "#ff8a65", "#ffccbc"],//人居
        12: ["#006064", "#00838f", "#00acc1", "#00bcd4", "#4dd0e1", "#b2ebf2"],//湿地
        13: ["#ff6f00", "#ff8f00", "#ffb300", "#ffca28", "#ffe082", "#ffecb3"],//荒地
        14: ["#1a237e", "#303f9f", "#3f51b5", "#5c6bc0", "#9fa8da", "#c5cae9"],//冻土
        15: ["#0d47a1", "#1565c0", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb"],//冰雪

        27: ["#11F500", "#A5F700", "#DFF701", "#FE9C01", "#F76003", "#F73D00"],//全国生态系统服务价值
        28: ["#ffaa01", "#ffbb1c", "#fcc72c", "#fdd744", "#ffed7d", "#fffdb3"],//农田
        29: ["#1b5e20", "#2e7d32", "#43a047", "#66bb6a", "#a5d6a7", "#c8e6c9"],//森林
        30: ["#33691e", "#558b2f", "#7cb342", "#9ccc65", "#c5e1a5", "#dcedc8"],//草地
        31: ["#004d40", "#00695c", "#00897b", "#26a69a", "#80cbc4", "#b2dfdb"],//灌木
        32: ["#006fff", "#0a84ff", "#21b5ff", "#32d3ff", "#4af6ff", "#65feea"],//水体
        33: ["#006064", "#00838f", "#00acc1", "#00bcd4", "#4dd0e1", "#b2ebf2"],//湿地
        34: ["#bf360c", "#d84315", "#ff5722", "#ff7043", "#ff8a65", "#ffccbc"],//人居
        35: ["#ff6f00", "#ff8f00", "#ffb300", "#ffca28", "#ffe082", "#ffecb3"],//荒地
        36: ["#1a237e", "#303f9f", "#3f51b5", "#5c6bc0", "#9fa8da", "#c5cae9"],//冻土
        37: ["#0d47a1", "#1565c0", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb"],//冰雪
      },//图例颜色
      bardata: [], //柱状图数据
      piedata: [], //饼状图数据
      charttitleval: "", //图表标题
      tabletitleval: "", //表格标题
      currentshape: true, //展示pie

      layerGeo: null, //分布数据
      maps: null, //地图
      imageBounds: [[54.95, 70.44], [15.89, 138.15]], //图片定位

      polygonjson: null, //渲染
      popups: null, //点选弹框
      provdata: null, //省级数据
      citydata: null, //市级数据
      citygeo: null, //市级区划
      baseboolean: false, //当前底图
      basemap: "ditu", //当前底图
      clicktimer: null,
      openeye: true, //展示图层
      hoverval: "",//hover展示内容
      hoverbool: false,
    };
  },
  computed: {
    wMenuid() {
      return this.$store.state.menuid;
    },
    wCode() {
      return this.$store.state.code;
    }
  },
  filters: {
    //时间过滤
    filtertime(value) {
      let values;
      let arr = value.split("-");
      if (arr[1] == "01" && arr[2] == "01") {
        values = arr[0] + "年";
      } else {
        values = value.replace(/-/g, ".");
      }
      return values;
    }
  },
  mounted() {
    window.fullHeight = document.documentElement.clientHeight;
    $(".box,.rotation").height(window.fullHeight - 66 + "px");
    $(".topcontent").height(window.fullHeight - 246 + "px");
    if (window.fullHeight > 900) {
      $(".timelist").css("maxHeight", "600px");
    } else {
      $(".timelist").css("maxHeight", window.fullHeight - 300 + "px");
    }
    this.tableheight = (window.fullHeight - 80) / 2 - 80;
    window.onresize = () => {
      return (() => {
        $(".box").height(window.fullHeight - 66 + "px");
        $(".box,.rotation").height(window.fullHeight - 66 + "px");
        $(".topcontent").height(window.fullHeight - 246 + "px");
        if (window.fullHeight > 900) {
          $(".timelist").height("600px");
        } else {
          $(".timelist").height(window.fullHeight - 300 + "px");
        }
        this.tableheight = (window.fullHeight - 80) / 2 - 80;
      })();
    };

    //获取时间轴
    this.gettimes();

    //加载地图
    this.initmap("mapid");
  },
  watch: {
    wMenuid: {
      handler: function (newVal, oldVal) {
        //获取时间轴
        this.gettimes();
        this.currentshape = true; //展示pie
      }
    },
    wCode: {
      handler: function (newVal, oldVal) {
        if (
          newVal != "110000" &&
          newVal != "120000" &&
          newVal != "310000" &&
          newVal != "810000" &&
          newVal != "820000" &&
          newVal != "500000"
        ) {
          //获取时间轴
          this.gettimes();
          this.currentshape = true; //展示pie
        }
      }
    }
  },
  methods: {
    //时间轴获取
    gettimes() {
      this.codeId = this.$store.state.code;
      this.typeId = this.$store.state.typeid;
      this.menuId = this.$store.state.menuid;

      let parm = {
        areaCode: this.codeId,
        menuId: this.menuId,
        // type: this.$store.state.type
        pageNum: 1,
        pageSize: 10
      };
      this.axios
        .get(this.$store.state.ipaddress + "ecologySta/time", { params: parm })
        .then(res => {
          if (res.data.code == "0000") {
            let data = res.data.data.list;
            let timesarr = [];
            for (let i = 0; i < data.length; i++) {
              timesarr.push(data[i].dataTime);
            }
            this.times = timesarr;
            this.currentdate = timesarr[0];

            //获取表格数据
            this.gettable();

            //分布数据--清除地图图片层
            if (this.layerGeo != null) {
              this.layerGeo.remove();
            }
            //分布数据--清除tms
            if (this.layerTms) {
              this.layerTms.remove();
            }
            //获取分布数据
            if ((this.codeId == "000000" && (this.typeId == 1 || this.typeId == 2)) || this.menuId == 5) {
              this.getresorce();
            }
          } else {
            this.$Message.warning({ content: res.data.message, duration: 2 });
          }
        }).catch(error => {
          console.log(error);
        });
    },

    //分布数据
    getresorce() {
      let codeval = this.codeId;
      this.menuId == 5 ? codeval = "000000" : codeval = this.codeId;

      let parm = {
        areaCode: codeval,
        menuId: this.menuId,
        dataTime: this.currentdate
      };
      this.axios.get(this.$store.state.ipaddress + "ecologyRs/resources", { params: parm }).then(res => {
        if (res.data.code == "0000") {
          if (res.data.data[0].showType == 1) {
            let geoval = res.data.data[0].img;
            if (geoval) {
              if (this.layerGeo == null) {
                //（长势，土壤，病虫害加载图片图层）
                this.layerGeo = L.imageOverlay(
                  this.$store.state.ipaddress + geoval,
                  this.imageBounds,
                  { opacity: 1 }
                );
                this.layerGeo.addTo(this.maps);
              } else {
                this.layerGeo._image.src = this.$store.state.ipaddress + geoval;
                this.layerGeo.addTo(this.maps);
                this.maps.fitBounds();
              }
            }
          } else {
            let tmsval = res.data.data[0].url;
            if (tmsval) {
              this.layerTms = L.tileLayer(tmsval, {
                tms: true,
                zIndex: 999
              });
              this.layerTms.addTo(this.maps);
            }
          }
        } else {
          this.$Message.warning({ content: res.data.message, duration: 2 });
        }
      }).catch(error => {
        console.log(error);
      });
    },

    //获取表格数据
    gettable() {
      let parm = {
        areaCode: this.codeId,
        menuId: this.menuId,
        dataTime: this.currentdate,
        type: this.$store.state.type
      };
      if (this.typeId == 4) {
        parm.type = 0
      }
      //生态价值table
      let ipadst;
      this.typeId != 4 ? ipadst = "ecologySta/tables" : ipadst = "ecologyVal/values";
      this.axios.get(this.$store.state.ipaddress + ipadst, { params: parm }).then(res => {
        if (res.data.code == "0000") {
          //加载总体数据
          this.reloadpop(res.data.data);

          let otherval = "";
          if (this.typeId == 1) {
            otherval = "资源量";
            this.tabletitleval = this.$store.state.menuval + otherval;
          } else if (this.typeId == 4) {
            otherval = "服务价值（亿元）";
            this.tabletitleval = this.$store.state.menuval + otherval;
            if (this.codeId != "000000" && this.menuId == 27) {
              this.tabletitleval = "生态系统服务价值（亿元）";
            }
          }else{
            this.tabletitleval = this.$store.state.menuval + otherval;
          }

          //调整表格标题
          this.handletableheader();

          //表格数据
          this.typeId == 4 ? this.tables = res.data.data.vals : this.tables = res.data.data.stas;

          //获取图例数据
          this.getlegend();

          //处理图表数据
          this.handlechart(this.tables);

          //柱状图
          this.mychart("rightchart", "pie");
        } else {
          this.$Message.warning({ content: res.data.message, duration: 2 });
        }
      }).catch(error => {
        console.log(error);
      });
    },

    //加载总览
    reloadpop(data) {
      let titles;
      if (this.typeId == 1 || this.typeId == 2 || this.typeId == 3 || this.typeId == 4) {
        let filterval = data.area;
        let codeval = this.$store.state.codeval;
        if (this.codeId == "000000") {
          if (this.typeId == 1) {
            //全国状态的生态资源量数据->万平方公里，标题+“全国”
            filterval = (filterval / 10000).toFixed(2);
            this.menuId == 5 ? titles = this.$store.state.menuval + "资源量（万平方公里）" : titles = "全国" + this.$store.state.menuval + "资源量（万平方公里）";
          } else if (this.typeId == 2) {
            titles = "全国" + this.tabletitlearr[this.menuId - 16];
          } else {
            if (this.menuId == 27) {
              titles = this.$store.state.menuval;
            } else {
              titles = "全国" + this.$store.state.menuval;
            }

          }
        } else {
          if (this.typeId == 1) {
            this.menuId == 5 ? titles = codeval + "生态资源量（平方公里）" : titles = codeval + this.$store.state.menuval + "资源量（平方公里）";
          } else if (this.typeId == 2) {
            titles = codeval + this.tabletitlearr[this.menuId - 16];
          } else {
            if (this.menuId == 27) {
              titles = codeval + "生态系统";
            } else {
              titles = codeval + this.$store.state.menuval;
            }
          }
        }

        if (this.typeId == 4) {
          this.popdata = [
            { title: titles + "服务价值（亿元）", num: data.sumVal },
            { title: codeval + "生态环境价值（亿元）", num: data.ecologyVal }
          ];
        } else {
          this.popdata = [
            { title: titles, num: filterval },
            { title: "变化率", num: data.rate * 100 + "%" }
          ];
        }

      }
    },

    //获取图例
    getlegend() {
      this.legenddata = [];
      this.axios({ method: "get", url: this.$store.state.ipaddress + "legend/legend/" + this.menuId }).then(res => {
        if (res.data.code == "0000") {
          //处理lengend
          if (this.codeId == "000000" && this.typeId != 4) {
            this.legenddata = res.data.data;
            if (this.typeId == 1 || this.typeId == 2) {
              this.legenddata = res.data.data;
            } else if (this.typeId == 3) {
              this.handlelegend(res.data.data);
            }
          } else {
            if ((this.typeId == 1 && this.menuId != 5) || this.typeId == 4) {
              let colors = this.legendcolor[this.menuId];
              // if (this.typeId == 4) {
              //   colors=this.legendcolor[this.menuId - 22]
              // }
              this.legenddata = [
                {
                  color: colors[0],
                  description: "高",
                  menuId: this.menuId
                },
                {
                  color: colors[1],
                  description: "",
                  menuId: this.menuId
                },
                {
                  color: colors[2],
                  description: "",
                  menuId: this.menuId
                },
                {
                  color: colors[3],
                  description: "",
                  menuId: this.menuId
                },
                {
                  color: colors[4],
                  description: "",
                  menuId: this.menuId
                },
                {
                  color: colors[5],
                  description: "低",
                  menuId: this.menuId
                }
              ];
            } else {
              this.legenddata = res.data.data;
            }
            this.handlelegend(res.data.data);
          }

          //加载地图
          this.reloadmap();
        } else {
          this.$Message.warning({ content: res.data.message, duration: 2 });
        }
      }).catch(error => {
        console.log(error);
      });
    },

    //处理表格表头
    handletableheader(data) {
      this.columns = [];
      let headerdata;
      let titledata = this.tabletitle[this.typeId - 1];
      if (this.typeId == 1 || this.typeId == 4) {
        headerdata = titledata.others;
        if (this.menuId == 5) {
          headerdata = titledata[this.menuId];
        }
      } else if (this.typeId == 2 || this.typeId == 3) {
        headerdata = titledata.others;
      }

      for (let key in headerdata) {
        let obj = {};
        obj.key = key;

        if (key == "area") {
          if (this.typeId != 1) {
            if (this.typeId == 2) {
              obj.title = this.tabletitlearr[this.menuId - 16];
            } else {
              obj.title = this.$store.state.menuval;
            }
          } else {
            if (this.codeId == "000000") {
              obj.title = headerdata[key] + "(万平方公里)";
              obj.render = function (h, params) {
                return h("span", (params.row.area / 10000).toFixed(2));
              };
            } else {
              obj.title = headerdata[key] + "(平方公里)";
            }
          }
        } else if (key == "rate") {
          obj.title = headerdata[key];
          obj.render = function (h, params) {
            return h("span", params.row.rate * 100 + "%");
          };
        } else {
          obj.title = headerdata[key];
        }

        obj.sortable = true;
        this.columns.push(obj);
      }
    },

    //处理图表数据
    handlechart(alldata) {
      let xdata = [];
      let ydata = [];
      let piedatas = [];
      let data;
      if (this.typeId == 4) {
        data = alldata.sort(this.resortby("sumVal")).reverse();
      } else {
        data = alldata.sort(this.resortby("area")).reverse();
      }
      if (this.typeId == 1) {
        for (let i = 0; i < data.length; i++) {
          let obj = {};
          if (this.menuId == 5) {
            xdata.push(data[i].name);
            obj.name = data[i].name;
          } else {
            xdata.push(data[i].shortName);
            obj.name = data[i].shortName;
          }
          if (this.codeId == "000000") {
            ydata.push((data[i].area / 10000).toFixed(2));
            obj.value = (data[i].area / 10000).toFixed(2);
          } else {
            ydata.push(data[i].area);
            obj.value = data[i].area;
          }

          piedatas.push(obj);
        }
      } else if (this.typeId == 2 || this.typeId == 3) {
        for (let i = 0; i < data.length; i++) {
          xdata.push(data[i].shortName);
          ydata.push(data[i].area);

          let obj = {};
          obj.name = data[i].shortName;
          obj.value = data[i].area;
          piedatas.push(obj);
        }
      } else if (this.typeId == 4) {
        for (let i = 0; i < data.length; i++) {
          xdata.push(data[i].name);
          ydata.push(data[i].sumVal);

          let obj = {};
          obj.name = data[i].name;
          obj.value = data[i].sumVal;
          piedatas.push(obj);
        }
      }

      this.bardata = [xdata, ydata];
      this.piedata = [xdata, piedatas];
    },

    //饼图
    mychart(id, type) {
      let titleval = "对比";
      if (this.typeId == 1) {
        titleval = "资源量对比";
        this.charttitleval = this.$store.state.menuval + titleval;
      } else if (this.typeId == 4) {
        titleval = "服务价值对比";
        this.charttitleval = this.$store.state.menuval + titleval;
        if (this.codeId != "000000" && this.menuId == 27) {
          this.charttitleval = "生态系统服务价值对比"
        }
      }else{
        this.charttitleval = this.$store.state.menuval + titleval;
      }

      //加载图表
      this.$echarts.init(document.getElementById(id)).dispose();
      let mycharts = this.$echarts.init(document.getElementById(id), "dark");
      let datazoomval = { show: false };
      let bottomval = "10";
      if (this.menuId != 5) {
        datazoomval = {
          type: "slider", //图表下方的伸缩条
          show: true, //是否显示
          backgroundColor: "#02476e",

          fillerColor: "#37a2da",
          borderColor: "#202020",
          handleSize: 0,
          height: 30, //组件高度
          start: 0, //伸缩条开始位置（1-100），可以随时更改
          end: 30, //伸缩条结束位置（1-100），可以随时更改
          left: 40, //右边的距离
          bottom: 10, //右边的距离
          right: 40
        };
        bottomval = "60";
      }
      let option;
      if (type == "pie") {
        option = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            type: "scroll",
            orient: "vertical",
            top: 10,
            x: "left",
            itemWidth: 13, // 设置宽度
            itemHeight: 13, // 设置高度
            pageIconColor: "#fff",
            pageIconInactiveColor: "#666",
            pageIconSize: "12",
            pageTextStyle: {
              fontSize: 12,
              color: "#fff"
            },
            show: true,
            formatter: function (name) {
              return name.length > 8 ? name.slice(0, 8) + "..." : name;
            },
            data: this.piedata[0]
          },
          series: [
            {
              type: "pie",
              radius: ["50%", "80%"],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "25",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.piedata[1]
            }
          ]
        };
      } else {
        option = {
          backgroundColor: "transparent",
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            top: "20",
            bottom: bottomval,
            containLabel: true
          },
          dataZoom: datazoomval,
          xAxis: [
            {
              type: "category",
              data: this.bardata[0],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: this.$store.state.menuval,
              type: "bar",
              barWidth: "60%",
              data: this.bardata[1]
            }
          ]
        };
      }

      mycharts.setOption(option, true);
      window.onresize = this.$echarts.resize;
    },

    //切换图表
    changetype(type) {
      this.mychart("rightchart", type);
      this.currentshape = !this.currentshape;
    },

    //加载区划
    reloadmap() {
      if (this.polygonjson != null) {
        this.polygonjson.clearLayers();
      }
      if (this.codeId == "000000") {
        this.addProvLayers(prov);
      } else {
        this.citygeo = null;
        this.axios.get("http://39.104.185.135/qgnq/api/v2/maps?level=2&prov=" + this.codeId).then(res => {
          if (res.data.status) {
            this.citygeo = res.data.data;
            this.addProvLayers(this.citygeo);
          } else {
            this.$Message.warning({ content: res.data.msg, duration: 2 });
          }
        });
      }
    },

    //加载地图颜色
    addProvLayers(states, boolean) {
      //boolean为1是隐藏底图->透明区划且不缩放地图，boolean为2显示底图->加载原区划且不缩放地图
      let that = this;
      let values = this.tables;
      this.polygonjson = L.geoJSON(states, {
        style: function (feature) {
          if ((that.codeId == "000000" && (that.typeId == 1 || that.typeId == 2)) || boolean == 1) {
            //全国状态下生态系统资源量+生态环境质量状况边界区划
            //boolean == 1为点击隐藏tms/图片时加载边界区划
            return {
              fillColor: "transparent",
              weight: 2,
              opacity: 1,
              color: "#1d8bea",
              fillOpacity: 0.9,
              dashArray: "3"
            };
          } else if (that.menuId == 5) {
            //非全国状态下的全国生态系统边界区划
            return {
              fillColor: "transparent",
              weight: 3,
              opacity: 1,
              color: "#fff",
              fillOpacity: 0.9,
              dashArray: "3"
            };
          } else {
            let value;
            for (let i = 0; i < values.length; i++) {
              if (values[i].areaCode == feature.properties.code) {
                if (that.typeId == 4) {
                  value = values[i].sumVal;
                } else {
                  value = values[i].area;
                }
              }
            }
            return {
              fillColor: that.getColor(value),
              weight: 2,
              opacity: 1,
              dashArray: "3",
              color: "#fff",
              fillOpacity: 0.9
            };
          }
        },
        onEachFeature: function (feature, layer) {
          layer.on({
            mouseover: that.highlightFeature,
            mouseout: function (e) {
              that.polygonjson.resetStyle(e.target);
              that.hoverbool = false;
              if (this.menuId != 5) {
                $(".ivu-table-tbody .ivu-table-row-hover").removeClass("ivu-table-row-hover");
              }
            },
            dblclick: that.zoomToFeature,
            click: that.showtrendchart
          });
        }
      });
      this.polygonjson.addTo(this.maps);
      //boolean为1与2->不缩放地图
      if (!(boolean == 1 || boolean == 2)) {
        this.maps.fitBounds(this.polygonjson.getBounds());
      }
    },

    //板块添加颜色
    getColor(attrvalue) {
      let legendval = this.legendclass;
      for (let i = 0; i < legendval.length; i++) {
        if (attrvalue <= legendval[0]) {
          return this.legenddata[5].color;
        } else if (attrvalue > legendval[0] && attrvalue <= legendval[1]) {
          return this.legenddata[4].color;
        } else if (attrvalue > legendval[1] && attrvalue <= legendval[2]) {
          return this.legenddata[3].color;
        } else if (attrvalue > legendval[2] && attrvalue <= legendval[3]) {
          return this.legenddata[2].color;
        } else if (attrvalue > legendval[3] && attrvalue <= legendval[4]) {
          return this.legenddata[1].color;
        } else if (attrvalue > legendval[4]) {
          return this.legenddata[0].color;
        }
      }
    },

    //地图鼠标经过
    highlightFeature(e) {
      var layer = e.target; //触发事件的对象
      if (!(layer.feature.properties.name == this.hoverval)) {
        layer.setStyle({
          weight: 5,
          color: "#fff",
          dashArray: "",
          fillOpacity: 0.8
        });
        layer.bringToFront();
      }

      let xx;
      let yy;
      $("body").mousemove(function (e) {
        xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        yy = e.originalEvent.y || e.originalEvent.layerY || 0;
        $(".hovertips").css({ "left": e.originalEvent.x, "top": e.originalEvent.y - 20 });
      });

      this.hoverbool = true;
      this.hoverval = layer.feature.properties.name;

      //设定选中tr
      if (this.menuId != 5) {
        for (let i = 0; i < this.tables.length; i++) {
          let names = this.tables[i].shortName;
          if (this.typeId == 4) {
            names = this.tables[i].name;
          }
          if (this.hoverval == names || names.indexOf(this.hoverval) != -1) {
            $(".ivu-table-tbody .ivu-table-row-hover").removeClass("ivu-table-row-hover");
            $(".ivu-table-tbody tr").eq(i).addClass("ivu-table-row-hover");
          }
        }
      }
    },

    //点选
    showtrendchart(e) {
      clearTimeout(this.clicktimer);
      var that = this;
      this.clicktimer = setTimeout(function () {
        //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
        that.addshowcontent(e);
      }, 1000);
    },
    addshowcontent(e) {
      if ($("#marker").length > 0) {
        $("#marker").remove();
      }
      //'<div style="width: 300px; height: 232px;background:transparent;" id="marker"><div class="title">内蒙古森林面积变化趋势</div></div>';
      let markertitle = e.sourceTarget.feature.properties.name;
      let parm = {
        areaCode: e.sourceTarget.feature.properties.code,
        menuId: this.menuId,
        dataTime: this.currentdate,
        type: this.$store.state.type
      };
      if (this.menuId == 5) {
        if (this.codeId == "000000") {
          //生态系统资源量中全国生态系统需获取全国省的数据
          this.axios.get(this.$store.state.ipaddress + "ecologySta/tables", { params: parm }).then(res => {
            if (res.data.code == "0000") {
              this.provdata = res.data.data;
              this.addcontent(markertitle, this.provdata, e.latlng);
            } else {
              this.$Message.warning({ content: res.data.message, duration: 2 });
            }
          }).catch(error => {
            console.log(error);
          });
        } else {
          if (this.citydata == null) {
            //生态系统资源量中全国生态系统需获取全省内市的数据
            this.axios.get(this.$store.state.ipaddress + "ecologySta/tables", { params: parm }).then(res => {
              if (res.data.code == "0000") {
                this.citydata = res.data.data;
                this.addcontent(markertitle, this.citydata, e.latlng);
              } else {
                this.$Message.warning({ content: res.data.message, duration: 2 });
              }
            }).catch(error => {
              console.log(error);
            });
          } else {
            this.addcontent(markertitle, this.provdata, e.latlng);
          }
        }
      } else {
        this.addcontent(markertitle, this.tables, e.latlng);
      }
    },
    addcontent(title, data, latlng) {
      let markerunit = "";
      let markernum;
      if (this.menuId == 5) {
        markernum = data.area;
      } else {
        for (let i = 0; i < data.length; i++) {
          let names = data[i].shortName;
          if (this.typeId == 4) {
            names = data[i].name;
          }
          if (title == names || names.indexOf(title) != -1) {
            if (this.typeId == 4) {
              markernum = data[i].sumVal;
            } else {
              markernum = data[i].area;
            }

          }
        }
      }
      if (this.typeId == 1) {
        markerunit = "平方公里";
        if (this.codeId == "000000") {
          markernum = (markernum / 10000).toFixed(2);
          markerunit = "万平方公里";
        }
      } else if (this.typeId == 4) {
        markerunit = "亿元";
      }
      var content =
        '<div style="width: 150px; height: 118px;background:transparent;" id="marker"><div class="title">' +
        title +
        '</div><div class="num" style="float: left;">' +
        markernum +
        '</div><div class="unit" style="float: left;color: #fff;line-height: 26px;margin-left: 5px;">' +
        markerunit +
        "</div></div>";
      this.popups = L.popup().setLatLng(latlng).setContent(content).openOn(this.maps);
    },

    //双击切换省市
    zoomToFeature(e) {
      clearTimeout(this.clicktimer);
      var currentprov = e.target.feature.properties.code;
      var currentprovval = e.target.feature.properties.name;
      if (!(currentprov == "110000" || currentprov == "120000" || currentprov == "310000" || currentprov == "500000" || currentprov == "810000" || currentprov == "820000")) {
        //全国状态才可切换到省市
        this.$store.commit("changeCode", [currentprov, currentprovval]);
      }
    },

    //设置legend
    handlelegend(alldata) {
      let val = JSON.stringify(this.tables);
      if ((this.codeId == "000000" && (this.typeId == 3 || this.typeId == 4)) || this.codeId != "000000") {
        val = JSON.parse(val).reverse();
        let params = "area";
        if (this.typeId == 4) {
          params = "sumVal";
        }
        var num = 0;
        for (var i = 0; i < val.length; i++) {
          if (val[i][params] == 0) {
            num++;
          }
        }
        var nlength = Math.floor((val.length - num) / 5);

        //let legendsarr = [];
        let lengends = [
          //val[0][params],
          val[nlength + num - 1][params],
          val[2 * nlength + num - 1][params],
          val[3 * nlength + num - 1][params],
          val[4 * nlength + num - 1][params],
          val[5 * nlength + num - 1][params],
          val[5 * nlength + num - 1][params]
        ];
        this.legendclass = lengends;
      }
    },

    //点击time切换
    changetime(changedate, boolean) {
      this.currentdate = changedate;
    },

    // 轮播切换-上一页、播放/暂停、下一页
    changebtn(direction) {
      if (direction == "left") {
        this.$Message.warning({ content: "暂无上一页数据", duration: 2 });
      } else if (direction == "right") {
        this.$Message.warning({ content: "暂无下一页数据", duration: 2 });
      } else {
        if (this.times.length > 1) {
          this.played = !this.played;
          if (this.timer) clearInterval(this.timer);
          if (direction == "play") {
            let timeslength = this.times.length;
            let num = 0;
            if (timeslength == 10) {
              num = 1;
            }
            this.timer = setInterval(() => {
              if (num < timeslength) {
                this.changetime(this.times[num]);
              } else {
                clearInterval(this.timer);
                this.$Message.success({ content: "播放完成", duration: 2 });
                this.played = !this.played;
              }
              num++;
            }, 1000);
          }
        }
      }
    },

    //初始化地图
    initmap(id) {
      this.maps = L.map(id, {
        center: [31.69, 104.32], //地图的初始地理中心
        zoom: 4,
        minZoom: 1, //地图的最小缩放级别
        //maxZoom: 13, //地图的最大缩放级别
        doubleClickZoom: false,
        attributionControl: false,
        zoomControl: true,
        crs: L.CRS.EPSG3857, //要使用的坐标参考系统
        animate: true,
        detectRetina: true,
        scrollWheelZoom: true
      });
      this.maps.zoomControl.setPosition("topright");
      this.basemapval = L.tileLayer(
        "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
      );
      this.basemapval.addTo(this.maps);
      this.maps.on("zoomend", this.resetLayer);
    },

    //缩小展示全国
    resetLayer() {
      // var changezoom = 13;
      var zoomval = this.maps._zoom;

      if (zoomval <= 4) {
        //全国状态才可切换到省市
        this.$store.commit("changeCode", ["000000", "全国"]);
      }
    },

    //底图
    showbasemap() {
      this.baseboolean = !this.baseboolean;
    },

    //显示/隐藏图层
    showchange() {
      if (this.openeye) {
        //目前是显示，隐藏图层
        //清除地图图片层
        if (this.layerGeo != null) {
          this.layerGeo.remove();
        }
        //清除tms
        if (this.layerTms) {
          this.layerTms.remove();
        }
        //清除区划
        if (this.codeId != "000000") {
          if (this.polygonjson != null) {
            this.polygonjson.clearLayers();
            this.addProvLayers(this.citygeo, 1);
          }
        }
      } else {
        if ((this.codeId == "000000" && (this.typeId == 1 || this.typeId == 2)) || this.menuId == 5) {
          this.getresorce();
        }
        if (this.codeId != "000000") {
          this.addProvLayers(this.citygeo, 2);
        }
      }
      this.openeye = !this.openeye;
    },

    //切换底图
    changebase(name) {
      var ditu = L.layerGroup([
        L.tileLayer(
          "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
        )
      ]);
      var rsimage = L.layerGroup([
        L.tileLayer(
          "https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
          { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
        )
      ]);
      var dems = L.layerGroup([
        L.tileLayer(
          "https://mt1.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
          { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
        )
      ]);

      this.basemapval.remove();
      if (name == "ditu") {
        this.basemapval = ditu;
      } else if (name == "rsimage") {
        this.basemapval = rsimage;
      } else if (name == "dems") {
        this.basemapval = dems;
      }
      this.basemapval.addTo(this.maps);
      this.basemap = name;
    },

    //排序
    resortby(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import "//at.alicdn.com/t/font_820428_ttmgy5e4e5.css";
@import "../../node_modules/leaflet/dist/leaflet.css";
$bdcolor: #006ca8;

.box {
  display: flex;
  .mapid {
    width: 73%;
    height: 100%;
    overflow: hidden;
  }
  .contenttitle {
    font-size: 15px;
    color: #00b4fe;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    text-align: left;
    .ivu-icon {
      color: #d05b2f;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .rightcontent {
    width: 27%;
    height: 100%;
    z-index: 9999;
    .bottomcontent {
      width: 100%;
      height: 150px;
      margin: 10px 0;
      background: #083248;
      .mystatistics {
        display: flex;
        height: 100%;
        align-items: center;
        .list {
          width: 50%;
          align-items: center;
          display: flex;
          justify-content: center;
          .list_l img {
            width: 72px;
            margin-right: 10px;
          }
          .list_r {
            text-align: left;
            max-width: 150px;
            overflow: hidden;
          }
          .num {
            font-size: 26px;
            font-weight: bold;
            color: #fff;
          }
          .title {
            font-size: 14px;
            color: #b7b7b7;
          }
        }
      }
    }
    .topcontent {
      display: flex;

      flex-flow: column;
      width: 100%;
      // height: 66%;
      // margin: 1% 0;
      background: #083248;
      .lefttable {
        display: flex;
        flex-flow: column;
        margin: 1% 2%;
        width: 96%;
        height: 49%;
        .mytables div,
        .mytables td {
          background: blue !important;
          color: red !important;
        }
      }
      .rightchart {
        display: flex;
        flex-flow: column;
        margin: 2% 2% 1%;
        width: 96%;
        height: 46%;
        #rightchart {
          height: 98%;
          width: 100%;
        }
      }
    }
  }
  .rotation {
    width: 120px;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    z-index: 999999;
    &:hover .timelist {
      opacity: 1;
    }
    .timebottom {
      cursor: pointer;
      img {
        width: 120px;
      }
    }
    .timelist {
      display: flex;
      flex-flow: column;
      //opacity: 0;
      align-items: flex-start;
      //height: 500px;
      justify-content: space-between;
      margin-left: 59px;
      border-left: 1px solid #135d84;
      padding: 10px 0;
      .dates {
        cursor: pointer;
        display: flex;
        background-color: #0d4664;
        width: auto;
        border-radius: 10px;
        color: #fff;
        line-height: 19px;
        height: 19px;
        padding-right: 8px;
        margin-left: -13px;
        .roicon {
          width: 17px;
          height: 19px;
          background: url(../images/roicon1.png);
          margin-right: 5px;
        }
      }
      .dates.current {
        background-color: #d05b2f;
        .roicon {
          background: url(../images/roicon2.png);
        }
      }
    }
  }
  .legendbox {
    position: absolute;
    right: 28%;
    bottom: 20px;
    z-index: 999;
    top: inherit;
    color: #fff;
    padding: 10px;
    background: rgba(0, 33, 53, 0.8);
    border: 1px solid $bdcolor;
    display: flex;
    flex-flow: column;
    box-shadow: 0px 0px 2px $bdcolor;

    .legendcontents {
      div {
        display: flex;
        flex-flow: row;
        align-items: center;
        i {
          width: 10px;
          height: 10px;
          margin-right: 3px;
        }
      }
      .lendimg {
        display: flex;
        img {
          width: 13px;
          height: 70px;
        }
        .imgright {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          height: 70px;
          margin-left: 5px;
        }
      }
    }
    .colorleft {
      img {
        width: 10px;
        height: 60px;
      }
    }
    .txtright {
      height: 60px;
      display: flex;
      flex-flow: column !important;
      justify-content: space-between;
      margin-left: 5px;
    }
  }
}
.iconbox {
  .iconfont {
    font-size: 22px;
    color: #fff;
    margin: 2px;
  }
  position: absolute;
  z-index: 999999;
  bottom: 38px;
  left: 21px;
}
.baseicon {
  z-index: 999;
  right: 10px;
  i {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
  }
}
.basemapchange {
  top: 12px;
  position: absolute;
  .mapimg {
    text-align: center;
    width: 30px;
    height: 30px;
    background: rgba(0, 33, 53, 0.8);
    border: 1px solid #006ca8;
    border-radius: 2px;
  }
  .mapselect {
    position: absolute;
    width: auto;
    right: 33px;
    top: 0;
    display: flex;
    border: 1px solid #fff;
    background: rgba(0, 33, 53, 0.8);
    > div {
      width: 50px;
      height: 50px;
      position: relative;
      margin: 2px;
      overflow: hidden;
      cursor: pointer;
      img {
        height: 50px;
      }
      span {
        display: block;
        width: 50px;
        height: 50px;
        background: rgba(0, 33, 53, 0.2) !important;
        color: #fff;
        text-align: center;
        position: absolute;
        line-height: 50px;
        left: 0;
        top: 0;
      }
    }
    > div.open {
      border: 2px solid #006ca8;
    }
    > div:hover {
      span {
        background: rgba(0, 33, 53, 0.5) !important;
      }
    }
  }
}
.basemapchange2 {
  top: 42px;
  position: absolute;

  .mapimg {
    text-align: center;
    width: 30px;
    height: 30px;
    background: rgba(0, 33, 53, 0.8);
    border: 1px solid #006ca8;

    border-radius: 2px;
  }
}
.hovertips {
  position: absolute;
  left: 10px;
  top: 10px;
  background: #d05b2f;
  color: #fff;
  padding: 2px 5px;
  border-radius: 10px;
  z-index: 99999999;
}
</style>
