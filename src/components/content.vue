<template>
  <div class="contentbox">
    <!-- 地图板块经过显示名称 -->
    <mu-chip
      class="demo-chip"
      color="primary"
      :style="{left:positionval[0]+'px',top:positionval[1]+'px'}"
      v-show="showtip"
    >{{showval}}</mu-chip>
    <!-- 地图 -->
    <div class="mymap" id="map" @mousemove="mousemove">
      <!-- 省市切换按钮 -->
      <div class="rightbtn">
        <div>
          <div
            class="changelevel"
            :title="$store.state.level==2?'切换为县级':'切换为市级'"
            v-if="$store.state.prov==130000||$store.state.prov==440000"
            @click="changelevel">
            <span>{{$store.state.level==2?'市':'县'}}</span>
          </div>
          <div
            class="changelevel"
            :title="$store.state.level==1?'切换为市级':'切换为省级'"
            v-if="$store.state.prov==''"
            @click="changelevel">
            <span v-if="$store.state.prov==''">{{$store.state.level==1?'市':'省'}}</span>
          </div>
        </div>
        <div class="basemapchange" @click="showbasemap">
          <div class="mapimg">
            <!-- <img src="../image/map-b.png" alt v-if="this.$store.state.terminal == 'phone'"> -->
            <!-- <img src="../image/map.png" alt> -->
            <mu-icon  value="language"></mu-icon>
          </div>
          <div class="mapselect" v-if="baseboolean">
            <div
              name="ditu"
              class="ditu"
              :class="basemap=='ditu'?'open':''"
              @click="changebase('ditu')"
            >
              <img src="../image/maplogo.png" alt>
              <span>地图</span>
            </div>
            <div
              name="rsimage"
              class="rsimage"
              :class="basemap=='rsimage'?'open':''"
              @click="changebase('rsimage')"
            >
              <img src="../image/imglogo.png" alt>
              <span>影像</span>
            </div>
            <div
              name="dems"
              class="dems"
              :class="basemap=='dems'?'open':''"
              @click="changebase('dems')"
            >
              <img src="../image/demlogo.png" alt>
              <span>地形</span>
            </div>
          </div>
        </div>
        <div @click="openBotttomSheet" style="padding-top:0.1rem;">
          <mu-icon  value="restore"></mu-icon>
        </div>
      </div>
      <!-- 图例 -->
      <div class="legend spritesbox">
        <span class="sprites-lt"></span>
        <span class="sprites-rt"></span>
        <span class="sprites-lb"></span>
        <span class="sprites-rb"></span>
        
        <div class="legendunit" v-if="$store.state.prov!=''&&$store.state.prov!=440000&&($store.state.prodtype==0||$store.state.prodtype==2)&&zoomlegend==false">变化率（%）</div>
        <div class="legendunit" v-else-if="unit!='无'&&zoomlegend==false">单位：{{this.unit}}</div>
        <!-- zoomlegend/河北面积放大legend -->
        <div class="legendcontents" v-if="zoomlegend==true">
          <div>冬小麦覆盖率</div>
          <div>
            <i style="background:#ffffff"></i>未种植
          </div>
          <div>
            <i style="background:#c7e9c0"></i>0-20%
          </div>
          <div>
            <i style="background:#74c476"></i>20%-50%
          </div>
          <div>
            <i style="background:#238b45"></i>50%-80%
          </div>
          <div>
            <i style="background:#00441b"></i>80%-100%
          </div>
        </div>
        <!-- 产量及面积（无河北） -->
        <div class="legendcontents" v-if="zoomlegend==false&&($store.state.prodtype==0||$store.state.prodtype==2)&&($store.state.prov==440000||$store.state.prov=='')">
          <div>
            <i :style="{background:mycolortable[$store.state.prodtype][0]}"></i>未种植
          </div>
          <div>
            <i :style="{background:mycolortable[$store.state.prodtype][1]}"></i>
            &lt;&nbsp;{{this.legend[$store.state.prodtype][1]}}
          </div>
          <div>
            <i :style="{background:mycolortable[$store.state.prodtype][2]}"></i>
            {{this.legend[$store.state.prodtype][1]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][2]}}
          </div>
          <div>
            <i :style="{background:mycolortable[$store.state.prodtype][3]}"></i>
            {{this.legend[$store.state.prodtype][2]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][3]}}
          </div>
          <div>
            <i :style="{background:mycolortable[$store.state.prodtype][4]}"></i>
            &gt;&nbsp;{{this.legend[$store.state.prodtype][3]}}
          </div>
        </div>
        <!-- 产量及面积（河北） -->
        <div class="legendcontents" v-if="zoomlegend==false&&($store.state.prov!=440000&&$store.state.prov!=''&&($store.state.prodtype==0||$store.state.prodtype==2))">
          <div>
            <i :style="{background:mycolortable.h[0]}"></i>未种植
          </div>
          <div>
            <i :style="{background:mycolortable.h[1]}"></i>
            &lt;&nbsp;{{this.legend[$store.state.prodtype][1]}}
          </div>
          <div>
            <i :style="{background:mycolortable.h[2]}"></i>
            {{this.legend[$store.state.prodtype][1]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][2]}}
          </div>
          <div>
            <i :style="{background:mycolortable.h[3]}"></i>
            {{this.legend[$store.state.prodtype][2]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][3]}}
          </div>
          <div>
            <i :style="{background:mycolortable.h[4]}"></i>
            {{this.legend[$store.state.prodtype][3]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][4]}}
          </div>
          <div>
            <i :style="{background:mycolortable.h[5]}"></i>
            {{this.legend[$store.state.prodtype][4]}}&nbsp;-&nbsp;{{this.legend[$store.state.prodtype][5]}}
          </div>
          <div>
            <i :style="{background:mycolortable.h[6]}"></i>
            &gt;&nbsp;{{this.legend[$store.state.prodtype][5]}}
          </div>
        </div>
        <!-- 气象 -->
        <div class="legendcontents" v-else-if="$store.state.prodtype==4">
          <div v-for="(item,index) in legend[$store.state.prodtype][$store.state.crop]" :key="index">
            <i :style="{background:mycolortable[$store.state.prodtype][$store.state.crop][index]}"></i>
            {{item}}
          </div>
        </div>
        
        <div class="legendcontents" v-else-if="($store.state.prodtype==1&&!($store.state.prov!=''&&$store.state.prov!=130000&&$store.state.prov!=440000))||$store.state.prodtype==5||($store.state.prodtype==3&&$store.state.prov!=''&&$store.state.prov!=130000&&$store.state.prov!=440000)">
          <div v-for="(item,index) in legend[$store.state.prodtype]" :key="index">
            <i :style="{background:mycolortable[$store.state.prodtype][index]}"></i>
            {{item}}
          </div>
        </div>
        <div class="legendcontents" v-else-if="$store.state.prodtype==1&&$store.state.prov!=''&&$store.state.prov!=130000&&$store.state.prov!=440000">
          <div>
            <i style="background:#ffffff"></i>未种植
          </div>
          <div v-for="(item,index) in legend[$store.state.prodtype]" :key="index">
            <i :style="{background:mycolortable[$store.state.prodtype][index]}"></i>
            {{item}}
          </div>
        </div>
        <div class="legendcontents" v-else-if="$store.state.prodtype==3&&($store.state.prov==''||$store.state.prov==130000||$store.state.prov==440000)">
          <div class="lendimg">
            <img src="../image/morecolor.png" alt="">
            <div class="imgright">
              <span>高</span>
              <span>低</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 轮播pc -->
    <div class="rotation spritesbox" v-if="$store.state.terminal=='web'">
      <span class="sprites-lt"></span>
      <span class="sprites-rt"></span>
      <span class="sprites-lb"></span>
      <span class="sprites-rb"></span>
      <div class="rotationcontents">
        <span class="left" @click="changenext('left')">
          <img src="../image/up.png" title="上一页">
        </span>
        <span class="play" @click="changenext('play')" v-if="played">
          <img src="../image/play.png" title="播放"/>
        </span>
        <span class="stop" @click="changenext('stop')" v-if="!played">
          <img src="../image/stop.png" title="停止"/>
        </span>
        <div class="rotationdetail">
          <ul ref="rotationli" v-if="times.length==11">
            <li
              class="lilist"
              :timeall="item.date"
              v-for="item in times.slice(1,11)"
              :key="item.date"
              :style="{width:liwidth+'px'}"
              :class="item.date==currentdate?'current':''"
              @click="changeli(item.date)">
              <span class="year">{{item.date | filtertime("year")}}</span>
              <div class="linedot">
                <div class="line"></div>
                <span class="dot"></span>
              </div>
              <span class="mouth">{{item.date | filtertime("mouth")}}</span>
            </li>
          </ul>
          <ul ref="rotationli" v-if="times.length<11">
            <li
              class="lilist"
              :timeall="item.date"
              v-for="item in times"
              :key="item.date"
              :style="{width:liwidth+'px'}"
              :class="item.date==currentdate?'current':''"
              @click="changeli(item.date)"
            >
              <span class="year">{{item.date | filtertime("year",times)}}</span>
              <div class="linedot">
                <div class="line"></div>
                <span class="dot"></span>
              </div>
              <span class="mouth">{{item.date | filtertime("mouth",times)}}</span>
            </li>
          </ul>
        </div>
        <span class="right" @click="changenext('right')">
          <img src="../image/next.png" title="下一页">
        </span>
      </div>
    </div>
    <!-- 轮播phone -->
    <mu-container v-if="$store.state.terminal=='phone'">
      <mu-bottom-sheet :open.sync="openbottom">
        <div v-if="times.length==11">
          <mu-chip 
          class="demo-chip" 
          :timeall="item.date"
          v-for="item in times.slice(1,11)"
          :key="item.date"
          :class="item.date==currentdate?'current':''"
          @click="changeli(item.date)">
            {{item.date | filtertime("year",times)}}{{item.date | filtertime("mouth",$store.state.terminal)}}
          </mu-chip>
        </div>
        <div v-if="times.length<11">
          <mu-chip 
          class="demo-chip" 
          :timeall="item.date"
          v-for="item in times"
          :key="item.date"
          :class="item.date==currentdate?'current':''"
          @click="changeli(item.date)">
            {{item.date | filtertime("year",times)}}{{item.date | filtertime("mouth",$store.state.terminal)}}
          </mu-chip>
        </div>
        <mu-button @click="changenext('left')">上一页</mu-button>
        <mu-button @click="changenext('play')">播放</mu-button>
        <mu-button @click="changenext('right')">下一页</mu-button>
      </mu-bottom-sheet>
    </mu-container>
   
    <!-- 全国数据 -->
    <div class="mystatistics commondiv spritesbox" v-show="leftshow">
      <span class="sprites-lt"></span>
      <span class="sprites-rt"></span>
      <span class="sprites-lb"></span>
      <span class="sprites-rb"></span>
      <div class="title">{{lefttotal[6]}}</div>
      <div class="staticscontents">
        <div class="staticsnum">
          <div>
            <p
              v-if="$store.state.prodtype==0||$store.state.prodtype==2||$store.state.prodtype==5"
            >{{$store.state.cropval}}{{lefttotal[0]}}</p>
            <p v-else>{{lefttotal[0]}}</p>
            <div>
              <span class="num">{{lefttotal[1]}}</span>
              <span class="unit">{{lefttotal[2]}}</span>
            </div>
          </div>
          <div>
            <p
              v-if="$store.state.prodtype==0||$store.state.prodtype==2||$store.state.prodtype==5"
            >{{$store.state.cropval}}{{lefttotal[3]}}</p>
            <p v-else>{{lefttotal[3]}}</p>
            <div>
              <span class="num">{{lefttotal[4]}}</span>
              <span class="unit">{{lefttotal[5]}}</span>
            </div>
          </div>
        </div>
        <div id="staticschart"></div>
      </div>
    </div>
    <!-- 信息总览 -->
    <div class="myoverview commondiv spritesbox" v-show="leftshow">
      <span class="sprites-lt"></span>
      <span class="sprites-rt"></span>
      <span class="sprites-lb"></span>
      <span class="sprites-rb"></span>
      <div class="title">信息总览</div>
      <div class="overcontents">
        <ul v-if="infor.length!=0">
          <li v-for="(items,index) in infor" :key="items.title">
            <p class="overname" v-if="items.name!=''">{{items.name}}</p>
            <div class="overdiv" :class="'overimg'+index">
              <span class="overnum">{{items.num}}</span>
              <span class="overunit" v-if="items.unit!='无'">{{items.unit}}</span>
            </div>
            <p class="overtitle">{{items.title}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 表格 -->
    <div class="mytable commondiv spritesbox" v-show="rightshow">
      <span class="sprites-lt"></span>
      <span class="sprites-rt"></span>
      <span class="sprites-lb"></span>
      <span class="sprites-rb"></span>
      <div class="title">各区域{{$store.state.prodtypeval}}统计（{{$store.state.cropval}}）</div>
      
      <mu-paper :z-depth="1" style="background:transparent">
          <mu-data-table
            height="300"
            :columns="columns"
            :sort.sync="sort"
            @sort-change="handleSortChange"
            :data="list"
            :selects.sync="selects"
            :min-col-width="10"
          >
            <template slot-scope="scope">
              <td class="is-center">{{scope.row.name}}</td>
              <td class="is-center" sortname="value">{{scope.row.value}}</td>
              <!-- 产量 -->
              <td
                class="is-center"
                v-if="$store.state.prodtype==0"
                sortname="total">{{scope.row.total}}</td>
              <td
                class="is-center"
                :class="scope.row.total_change>0?'arrow-up':((scope.row.total_change==0||scope.row.total_change==-999)?'arrow-right':'arrow-down')"
                v-if="$store.state.prodtype==0"
                sortname="total_change">
                {{scope.row.total_change | filtersChange($store.state.prodtype)}}
                <span
                  v-if="scope.row.total_change>0"
                >↑</span>
                <span v-else-if="scope.row.total_change==0">→</span>
                <span v-if="scope.row.total_change<0&&scope.row.total_change!=-999">↓</span>
              </td>
              
              <!-- 面积+气象 -->
              <td
                class="is-center"
                sortname="change"
                :class="scope.row.change>0?'arrow-up':((scope.row.change==0||scope.row.change==-999)?'arrow-right':'arrow-down')"
                v-if="$store.state.prodtype==2||$store.state.prodtype==4">
                {{scope.row.change | filtersChange($store.state.prodtype,$store.state.crop)}}
                <span
                  v-if="scope.row.change>0"
                >↑</span>
                <span v-else-if="scope.row.change==0">→</span>
                <span v-if="scope.row.change<0&&scope.row.change!=-999">↓</span>
              </td>
              <!-- 土壤湿度+病虫害+长势 -->
              <td
                class="is-center"
                v-if="$store.state.prodtype==3||$store.state.prodtype==5||$store.state.prodtype==1"
              >{{scope.row.grade | capitalize(legend,$store.state.prodtype)}}</td>
            </template>
          </mu-data-table>
        </mu-paper>
    </div>
    <!-- 图表 -->
    <div class="mychart commondiv spritesbox" v-show="rightshow">
      <span class="sprites-lt"></span>
      <span class="sprites-rt"></span>
      <span class="sprites-lb"></span>
      <span class="sprites-rb"></span>
      <div class="title" v-if="currentchart==1">各区域{{$store.state.prodtypeval}}占比（{{$store.state.cropval}}）</div>
      <div class="title"  v-if="currentchart==2">各区域{{$store.state.prodtypeval}}排行（{{$store.state.cropval}}）</div>
      <div class="changechart bar" @click="changechart(currentchart)" v-if="currentchart==1">
        <img src="../image/bar.png" alt>
        <a href="javascript:void(0)">柱状图</a>
      </div>
      <div class="changechart pie" @click="changechart(currentchart)" v-if="currentchart==2">
        <img src="../image/pie.png" alt>
        <a href="javascript:void(0)">饼状图</a>
      </div>
      <div id="rightchart"></div>
    </div>
    
    <!-- 错误显示 -->
    <mu-snackbar color="error" :position="this.position" :open.sync="this.open" >
      {{this.message}}
      <mu-button flat slot="action" color="secondary" @click="changeopen">x</mu-button>
    </mu-snackbar>
    <div id="chart" v-show="openchart==true" @click.self="hiddenchart">
      <div id="marker">123</div>
    </div>
  </div>
</template>
<script>
import L from "../../node_modules/leaflet/dist/leaflet";
import markerClusterGroup from "leaflet.markercluster";

export default {
  name: "chartcontent",
  data() {
    return {
      position: "bottom", //msg位置
      message: "", //msg内容
      open: false, //msg显示
      timeout: 1000, //msg显示时间
      msgtimer: null, //msg定时
      timer: null, //roration定时

      leftshow: true,//左侧收缩
      rightshow: true,//右侧收缩

      liwidth: 0,
      times: [], //轮播时间列表
      played:true,

      showtip: false, //地图经过tips显示
      positionval: [], //地图经过tips位置
      showval: "", //地图经过tips内容

      mycolortable: {
        0: ["#fff", "#ff1d1d", "#fff000", "#75FF06", "#00b708"],
        //h: ["#fff", "#FF3900", "#FF7701", "#FFCC00", "#C6FF00", "#3AFF00", "#00AA54"],//河北变化率
        //h: ["#fff", "#FA0000", "#FC6506", "#FFA82C", "#02F601", "#01B402", "#1A6C00"],//河北变化率
        h: ["#fff", "#FF3900", "#FF7701", "#FFCC00", "#A3F06C", "#5DE100", "#3D9200"],//河北变化率
        1: ["#ffa77f", "#ffff73", "#d1ff73", "#00ff00", "#009600"],
        2: ["#fff", "#ff1d1d", "#fff000", "#75FF06", "#00b708"],
        3: ["#FC2B03", "#FEAF00", "#E2F903", "#18BC14", "#15E1D2"],
        4: [
          ["#34befd", "#58fee9", "#eeff37", "#fec800", "#fe7600"],
          ["#fe7600", "#fec800", "#eeff37", "#58fee9", "#34befd"]
        ],
        5: ["#56fe00", "#ffff01", "#ffa902", "#fe0002"]
      },
      legendshebei:[0, -10, -5, 0, 5,10,10],
      legend: {
        0: [],
        1: [
          "较往年差",
          "较往年稍差",
          "与往年持平",
          "较往年稍好",
          "较往年好"
        ],
        2: [],
        3: ["重旱", "中旱", "轻旱", "适宜", "偏湿"],
        4: [
          [
            "较往年低温",
            "较往年偏低温",
            "与往年持平",
            "较往年偏高温",
            "较往年高温"
          ],
          ["低于往年", "稍低于往年", "与往年持平", "稍高于往年", "高于往年"]
        ],
        5: ["健康", "轻度", "中度", "重度"]
      },
      pie: {
        //长势
        1: ["较往年差", "较往年稍差", "与往年持平", "较往年稍好", "较往年好"],
        //土壤湿度
        3: ["重旱", "中旱", "轻旱", "适宜", "偏湿"],
        //气象数据
        4: [
          [
            "较往年低温",
            "较往年偏低温",
            "与往年持平",
            "较往年偏高温",
            "较往年高温"
          ],
          ["低于往年", "稍低于往年", "与往年持平", "稍高于往年", "高于往年"]
        ],
        //病虫害
        5: ["健康", "轻度", "中度", "重度"]
      },
      optionarray: [
        "yields",
        "growths",
        "areas",
        "soils",
        ["tems", "pres"],
        "diseases"
      ],
      optionarray2: [
        "",
        "growths/geom",
        "areas/geom",
        "soils/geom",
        ["tems/geom", "pres/geom"],
        "diseases/geom"
      ],
      optionarray3: [
        "yields/brief",
        "growths/brief",
        "areas/brief",
        "soils/brief",
        ["tems/brief", "pres/brief"],
        "diseases/brief"
      ],
      markers: null,
      polygonjson: null,
      layerTms: null, //地块tms
      layerGeo: null,
      provgeo: false, //省份geo
      countygeo: false, //全省县geo
      countygeo2: false, //全市县geo
      nationgeo: false, //国家geo
      popups:null,
      ipaddress: this.$store.state.ipaddress,
      offsetval: this.$store.state.offset,
      unit: "", //单位
      totaldata: [], //全国/全省
      localTongji: [], //地方统计
      localFenbu: [], //地方分布
      currentdate: null, //当前选中时间
      maps: null,
      zoomed: false,//地块显示
      zoomlegend:false,//长势地块legend
      sort: { name: "", order: "asc" },
      table: {
        0: ["行政区", "单产(千克/亩)", "总产(万吨)", "总产变化率"],
        1: ["行政区", "长势指数", "长势等级"],
        2: ["行政区", "面积（万公顷）", "面积变化率"],
        3: ["行政区", "土壤湿度", "土壤湿度等级"],
        4: [
          ["行政区", "温度累积", "日均温度距平"],
          ["行政区", "降水累积", "累积降水距平"]
        ],
        5: ["行政区", "病虫害面积（万公顷）", "病虫害等级"]
      },
      columns: [
        // table标题{title: "标题内容", name: "calories",align: "center标题居中",sortable: true，标题排序},
      ],
      list: [], //table内容
      list2:[],//当前时间前1数据
      selects: [], //tr选中行
      piedata: [],//饼状图数据
      bardata: [],//柱状图数据
      leftchartdata: [],//左侧全国图表数据
      currentchart: 1,
      lefttotal: {},//左侧全国数据
      baseboolean: false,//当前底图
      basemap: "ditu",//当前底图
      basemapval: null,//底图
      clicktimer: null,//单双击定时器
      infor: [],//信息总览内容
      mainPublic:[],//主产区
      nonMainPublic:[],//非主产区
      miandata:null,//信息总览数据
      openchart:false,//chartdialog
      openbottom:false,
      countryboolean:true,
    };
  },
  props: ["messages"],
  filters: {
    //描述过滤
    capitalize(value, legend, prodtype, crop) {
      var tableval = legend[prodtype];
      if (prodtype == 4) {
        tableval = legend[prodtype][crop];
      }
      if (prodtype == 1) {
        for (let i = 0; i < tableval.length; i++) {
          if(value==0){
            return "未种植";
          }else if (value == i) {
            return tableval[i-1];
          }
        }
      } else {
        for (let i = 0; i < tableval.length; i++) {
          if (prodtype == 5 && value == 0) {
            return "未种植";
          }
          if (value == i + 1) {
            return tableval[i];
          }
        }
      }
    },
    filtersChange(value, prodtype, crop) {
      //产量，面积--温度，降水
      var tableunit;
      if (prodtype == 0 || prodtype == 2) {
        tableunit = "%";
      } else {
        crop == 0 ? (tableunit = "℃") : (tableunit = "mm");
      }

      if (value > 0) {
        return value + tableunit;
      } else if (value == 0) {
        return "持平";
      }else if(value == -999){
        return "未种植";
      } else {
        return -value + tableunit;
      }
    },
    filtertime(value, type,terminal) {
      var timearr = value.split("-");
      if (type == "year") {
        return timearr[0] + "年";
      } else if (type == "mouth") {
        var day = timearr[2].split("T")[0];
        if (timearr[1] == 1 && day == 1) {
          return "";
        } else {
          if(terminal=="phone"){
            return timearr[1] + "月" + day + "日";
            
          }else{
            return timearr[1] + "." + day;
          }
        }
      }
    }
  },
  components: {},
  computed: {
    watchdata() {
      return [
        this.$store.state.prodtype,
        this.$store.state.crop,
        this.$store.state.level
      ];
    },
    watchprov() {
      return this.$store.state.prov;
    },
    watchcropprov() {
      return [
        this.$store.state.crop,
        this.$store.state.prov
      ]
    },
  },
  mounted() {
    this.currentchart = 1;
    this.offsetval = 0;
    this.getInitdata(this.$store.state.prov);
    this.initmap("map");
  },
  watch: {
    watchdata: {
      handler: function(newVal, oldVal) {
        var num = 0;
        for (var i = 0; i < 3; i++) {
          if (newVal[i] != oldVal[i]) {
            num = 1;
          }
        }
        if (num == 1) {
          this.currentchart = 1;
          this.offsetval = 0;
          if(this.popups){
            this.popups.remove();
          }
          this.getInitdata(this.$store.state.prov);
        }
      }
    },
    watchprov: {
      handler: function() {
        this.provgeo = false; //省份geo
        this.countygeo = false; //县geo
      }
    },
    messages:{
      handler(newValue) {
        if(newValue[0]==0){
          this.leftshow=true;
        }else if(newValue[0]==1){
          this.leftshow=false;
        }
        if(newValue[1]==0){
          this.rightshow=true;
        }else if(newValue[1]==1){
          this.rightshow=false;
        }
      }
    }
  },
  methods: {
    closeBottomSheet () {
      this.openbottom = false;
    },
    openBotttomSheet () {
      this.openbottom = true;
    },

    //提示框
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

    //获取页面数据
    getInitdata(provval, direction) {
      //判断prodType，识别加载对应的url
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;
      var option = this.optionarray[prodType];
      var option2 = this.optionarray2[prodType];
      var levelval = this.$store.state.level;
      if (prodType == 4) {
        option = this.optionarray[prodType][crop];
        option2 = this.optionarray2[prodType][crop];
      }
      
      var offsetnum = this.offsetval;
      if(provval!=''&&provval!=440000){
        if(localStorage.getItem("offsetval")){
          offsetnum=localStorage.getItem("offsetval");
        }else{
          offsetnum = this.$store.state.offset
        }
      }
      
      //ajax-params
      var initdata = {
        limit: this.$store.state.limit,
        offset: offsetnum * (this.$store.state.limit-1)
      };

      if (prodType == 3) {
        var deeps = [5, 10, 40];
        initdata.deep = deeps[crop];
      } else if (prodType == 5) {
        initdata.disease = crop;
      } else {
        initdata.crop = crop;
      }

      //获取全国/全省数据
      var initdatas = JSON.parse(JSON.stringify(initdata));
      if(provval!=440000&&provval!=""){
        initdatas.prov=130000;
      }
      
      provval?initdatas.level=1:initdatas.level=0;

      this.$http
        .get(this.ipaddress + option, { params: initdatas })
        .then(function(result) {
          if (result.body.status) {
            this.totaldata = result.body.data;//全国/全省数据
            this.handleleftchart(this.totaldata);//处理leftchart数据
            
            let times=null;
            if(provval==""||provval==440000){
              times =this.totaldata.series[0].date;
            }else{
              //如果为河北及河北市县需固定时间,direction:点击轮播左右页切换情况
              if(direction){
                times =this.totaldata.series[0].date;
              }else if(localStorage.getItem("timedata")){
                times =localStorage.getItem("timedata");
              }else{
                times =this.totaldata.series[0].date;
              }
            }
            this.handletotaldata(times, this.totaldata);//左侧总指标title

              if (provval) {
                if(provval!=130000&&provval!=440000){
                  //河北省市切换市区数据
                  initdata.city = provval;
                }else{
                  //省市
                  initdata.prov = provval;
                }
              }
              //获取地方统计数据
              initdata.level = levelval;
              this.$http
                .get(this.ipaddress + option, { params: initdata })
                .then(function(result) {
                  if (result.body.status) {
                    this.localTongji = result.body.data;//地方统计数据
                    this.unit = this.localTongji.unit;//单位
                    //数据存在
                    if (this.localTongji.series) {
                      //获取时间列表
                      var timeserice = [];
                      for (let i = 0; i < this.localTongji.series.length; i++) {
                        let obj = {};
                        obj.date = this.localTongji.series[i].date;
                        obj.period = this.localTongji.series[i].period;
                        timeserice.push(obj);
                      }

                      //如果为河北及河北市县需固定时间,direction:点击轮播左右页切换情况
                      if(provval==440000||provval==''){
                        this.currentdate = timeserice[0].date;
                      }else{
                          if(direction){
                            this.currentdate = timeserice[0].date;
                            localStorage.setItem("timedata",timeserice[0].date);
                          }else if(localStorage.getItem("timedata")){
                            this.currentdate=localStorage.getItem("timedata");
                          }else{
                            this.currentdate = timeserice[0].date;
                            localStorage.setItem("timedata",timeserice[0].date);
                          }
                      }
                      
                      this.times = timeserice.reverse();//时间列表数据

                      //初始化表格标题
                      this.columns = [];
                      var tabledata = this.table[prodType];
                      if (prodType == 4) {
                        tabledata = this.table[prodType][crop];
                      }
                      for (let i = 0; i < tabledata.length; i++) {
                        let obj = {};
                        obj.title = tabledata[i]; //设置标题内容
                        obj.align = "center"; //设置居中
                        obj.name = i + 1;
                        if (i > 0) {
                          //表格第一列无排序，1、3、5最后一列无排序
                          if (
                            (prodType == 1 || prodType == 3 || prodType == 5) &&
                            i == tabledata.length - 1
                          ) {
                            obj.sortable = false; //设置排序
                          } else {
                            obj.sortable = true; //设置排序
                          }
                        }

                        this.columns.push(obj);
                      }
                      //加载内容
                      this.loadcontent(true);

                      //获取地方分布数据
                      
                      if(provval == 130000||provval == 440000||provval == ""){
                        if (prodType == 1 ||prodType == 3 ||prodType == 4 ||prodType == 5 ||(prodType == 2 && provval == 130000)) {
                          levelval==3?initdata.level = 1:initdata.level = levelval - 1
                          this.$http.get(this.ipaddress + option2, { params: initdata }).then(function(result) {
                              if (result.body.status) {
                                this.localFenbu = result.body.data;

                                //加载内容
                                this.loadcontent();
                              } else {
                                this.showMsg(result.body.msg);
                                if (direction == "left") {
                                  this.offsetval--;
                                } else if (direction == "right") {
                                  this.offsetval++;
                                }
                              }
                          });
                        }
                      }
                    }
                  } else {
                    this.showMsg(result.body.msg);
                  }
              });
          } else {
            this.showMsg(result.body.msg);
            if (direction == "left") {
              this.offsetval--;
            } else if (direction == "right") {
              this.offsetval++;
            }

            if(provval!=''&&provval!=440000){
               this.$store.commit("changeoffset",this.offsetval);
              //this.getInitdata(this.$store.state.prov);
              if(localStorage.getItem("offsetval")){
                localStorage.removeItem("offsetval");
                localStorage.setItem("offsetval",this.offsetval);
              }else{
                localStorage.setItem("offsetval",this.offsetval);
              }
            }
          }
        });

      
    },

    //加载数据
    loadcontent(boolean) {
      var prodType = this.$store.state.prodtype;
      var provval = this.$store.state.prov;
      //debugger;
      for (var i = 0; i < this.localTongji.series.length; i++) {
          if (this.localTongji.series[i].date == this.currentdate) {
            this.list = this.localTongji.series[i].prod;
            if(i!=this.localTongji.series.length-1){
              this.list2=this.localTongji.series[i + 1].prod;
            }else{
              this.list2=[];
            }
          }
      }
      //console.log(this.offsetval);
      //调整轮播宽度
      var timelength =10;
      if(this.times.length<10){
        timelength =this.times.length;
      }
      this.liwidth =(document.documentElement.clientWidth/2-150)/timelength;

      if(provval==""||provval==130000||provval==440000){
        //清除地图图片层
          if (this.layerGeo != null) {
            this.layerGeo.remove()
          }
        if (prodType == 0 || prodType == 2) {
          //加载信息总览
          this.checkMain();
          this.setLegendval(this.list); //设置动态图例值
          this.reloadmap();
          this.handlechart(this.list);
          this.mychart(this.piedata, "pie", false); //加载图表
        }
        if (!boolean && prodType != 0 && prodType != 2) {
          var growthdata;
          for (let i = 0; i < this.localFenbu.series.length; i++) {
            if (this.localFenbu.series[i].date == this.currentdate) {
              growthdata = this.localFenbu.series[i].prod;
            }
          }
          //加载信息总览
          this.checkMain();
          this.reloadmap();
          this.handlechart(growthdata.areas);
          this.mychart(this.piedata, "pie", false); //加载图表

          if (prodType == 1 ||prodType == 3 ||prodType == 5) {
            //获取图片url及位置
            var imageUrl = growthdata.img;
            var imageBounds = [
              //获取图片url及位置
              [this.localFenbu.extent.top, this.localFenbu.extent.left],
              [this.localFenbu.extent.bottom, this.localFenbu.extent.right]
            ];

            if (this.layerGeo == null) {
              //（长势，土壤，病虫害加载图片图层）
              this.layerGeo = L.imageOverlay(
                this.ipaddress + imageUrl,
                imageBounds,
                { opacity: 1 }
              );
              this.layerGeo.addTo(this.maps);
            } else {
              this.layerGeo._bounds._northEast.lat = this.localFenbu.extent.top;
              this.layerGeo._bounds._northEast.lng = this.localFenbu.extent.right;
              this.layerGeo._bounds._southWest.lat = this.localFenbu.extent.bottom;
              this.layerGeo._bounds._southWest.lng = this.localFenbu.extent.left;
              this.layerGeo._image.src = this.ipaddress + imageUrl;
              this.layerGeo.addTo(this.maps);
              this.maps.fitBounds(this.markers.getBounds());
            }
          }
        }
      }else{
        //河北内部
        //清除地图图片层
          if (this.layerGeo != null) {
            this.layerGeo.remove()
          }
        //河北省县级数据加载
        if (prodType == 0 || prodType == 2){
          this.setLegendval(this.list); //设置动态图例值
        }
        //加载信息总览
        this.checkMain();
        this.reloadmap();
        this.handlechart(this.list);
        this.mychart(this.piedata, "pie", false); //加载图表
        //this.mycitychart(this.piedata, "pie", false); //加载图表
        
      }
    },

    //重载地图
    reloadmap(boolean) {
      if (this.polygonjson != null) {
          this.markers.clearLayers();
      }
      //获取地图数据
      var datageo;
      if(this.$store.state.level == 1){
          datageo = this.nationgeo
      }else if(this.$store.state.level == 2){
          datageo = this.provgeo
      }else if(this.$store.state.level == 3&&(this.$store.state.prov==130000||this.$store.state.prov==440000)){
          datageo = this.countygeo
      }else if(this.countryboolean){
        datageo = this.countygeo2
      }

      if (datageo) {
        if (boolean) {
          //放大到地块级别
          var growthdata;
          for (var i = 0; i < this.localFenbu.series.length; i++) {
            if (this.localFenbu.series[i].date == this.currentdate) {
              growthdata = this.localFenbu.series[i].prod;
            }
          }

          this.addProvLayers(datageo, true);
          this.layerTms = L.tileLayer(growthdata.tms, {
            tms: true,
            zIndex: 999
          });
          this.layerTms.addTo(this.maps);
        } else {
          if (this.polygonjson != null) {
            this.markers.clearLayers();
          }
          this.addProvLayers(datageo);
        }
      } else {
        var url = this.ipaddress + "maps?level=" + this.$store.state.level;
        if (this.$store.state.prov != "") {
          if(this.$store.state.prov!=130000&&this.$store.state.prov!=440000){
            url =
            this.ipaddress +
            "maps?level=" +
            this.$store.state.level +
            "&city=" +
            this.$store.state.prov;
          }else{
            url =
            this.ipaddress +
            "maps?level=" +
            this.$store.state.level +
            "&prov=" +
            this.$store.state.prov;
          }
        }
        this.$http.get(url).then(function(result) {
          if (result.body.status) {
            if(this.$store.state.level == 1){
                this.nationgeo = result.body.data
            }else if(this.$store.state.level == 2){
                this.provgeo = result.body.data
            }else if(this.$store.state.level == 3&&(this.$store.state.prov==130000||this.$store.state.prov==440000)){
                this.countygeo = result.body.data
            }else{
              this.countygeo2 = result.body.data
            }
            if (this.polygonjson != null) {
              this.markers.clearLayers();
            }
            this.addProvLayers(result.body.data);
          }
        });
      }
    },

    //加载地图颜色
    addProvLayers(states, boolean) {
      var that = this;
      var provval = this.$store.state.prov;
      var prodType = this.$store.state.prodtype;
      var values = this.list;
      this.polygonjson = L.geoJSON(states, {
        style: function(feature) {
          if(provval==""||provval==130000||provval==440000){
            if (boolean) {
              return {
                fillColor: "transparent",
                weight: 0,
                opacity: 0,
                color: "transparent",
                fillOpacity: 0
              };
            } else if (
              prodType == 3 ||
              prodType == 1 ||
              prodType == 5
            ) {
              return {
                fillColor: "transparent",
                weight: 2,
                opacity: 1,
                color: "#1d8bea",
                fillOpacity: 0.9,
                dashArray: "3"
              };
              } else {
                let value;
                for (let i = 0; i < values.length; i++) {
                  if (values[i].code == feature.properties.code) {
                    if (prodType == 4) {
                      value = values[i].grade;
                    } else{
                      
                      if(provval!=""&&provval!=440000){
                        if(prodType==0){
                          value = values[i].total_change;
                        }else{
                          value = values[i].change;
                        }
                      }else{
                        value = values[i].value;
                      }
                    }
                  }
                }

                return {
                  fillColor: that.getColor(value),
                  weight: 2,
                  opacity: 1,
                  dashArray: "3",
                  color: "#1d8bea",
                  fillOpacity: 0.9
                };
            }
          }else{
              let value;
                for (let i = 0; i < values.length; i++) {
                  if (values[i].code == feature.properties.code) {
                    if (prodType == 4||prodType == 3) {
                      value = values[i].grade;
                    }else if(prodType == 0){
                      value = values[i].total_change;
                    } else if(prodType == 2){
                      value = values[i].change;
                    } else {
                      value = values[i].grade;
                    }
                  }
                }

                return {
                  fillColor: that.getColor(value),
                  weight: 2,
                  opacity: 1,
                  dashArray: "3",
                  color: "#1d8bea",
                  fillOpacity: 0.9
                };
          }
        },
        onEachFeature: function(feature, layer) {
          layer.on({
            mouseover: that.highlightFeature,
            mouseout: function(e) {
              that.polygonjson.resetStyle(e.target);
              that.selects = [];
              that.showtip = false;
            },
            dblclick: that.zoomToFeature,
            click: that.showtrendchart
          });
        }
      });
      this.markers = L.markerClusterGroup();
      this.markers.addLayer(this.polygonjson);
      this.markers.addTo(this.maps);
      if(!boolean && !(prodType == 1&&provval==130000)&& !(prodType == 2&&provval==130000)) {
        this.maps.fitBounds(this.markers.getBounds());
      }
    },

    //板块添加颜色
    getColor(attrvalue) {
      var legendval;
      var provval = this.$store.state.prov;
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;
      var colortable = this.mycolortable[prodType];
      if (prodType == 4) {
        legendval = this.legend[prodType][crop];
        colortable = this.mycolortable[prodType][crop];
      } else if (provval!= "" &&provval!= 440000&&(prodType == 0||prodType == 2)) {
        legendval = this.legendshebei;
        colortable = this.mycolortable.h;
      } else {
        legendval = this.legend[prodType];
      }

      if (attrvalue == undefined || attrvalue == null ) {
        attrvalue = 0;
      }

      if (prodType == 4||(prodType == 3&&provval!=""&&provval!=130000&&provval!=440000)) {
        for (let i = 0; i < legendval.length; i++) {
          if (i + 1 == attrvalue) {
            return colortable[i];
          }
        }
      } else if (prodType == 1 && this.$store.state.client == "hebei") {
        for (let i = 0; i < legendval.length; i++) {
          if(attrvalue==0){
            return "#fff";
          }else if (i == attrvalue) {
            return colortable[i-1];
          }
        }
      }else if( (prodType == 0 || prodType == 2)&&provval!=""&&provval!=440000 ){
        for (let i = 0; i < legendval.length; i++) {
          //legendshebei:[0, -10, -5, 0, 5,10,10],
          if(attrvalue == -999){
            return colortable[0];
          }else if(attrvalue < legendval[1]){
            return colortable[1];
          } else if (attrvalue > legendval[5]) {
            return colortable[6];
          }else if (i>0&&attrvalue > legendval[i] &&attrvalue <= legendval[i + 1]) {
            return colortable[i + 1];
          }
        }
      } else {
        for (let i = 0; i < legendval.length; i++) {
          if (i == 0 && attrvalue == legendval[i]) {
            return colortable[i];
          } else if (attrvalue > legendval[legendval.length - 1]) {
            return colortable[colortable.length - 1];
          } else if (
            attrvalue > legendval[i] &&
            attrvalue <= legendval[i + 1]
          ) {
            return colortable[i + 1];
          }
        }
      }
    },

    //双击切换省市
    zoomToFeature(e) {
      clearTimeout(this.clicktimer);
      var currentprov = e.target.feature.properties.code;
      //全国状态才可切换到省市
      if(this.$store.state.prov==130000||this.$store.state.level==1){
        if (localStorage.getItem("checkdata")) {
            //已登录
            if(this.$store.state.level==1){
              localStorage.setItem("provstorage", currentprov);
              this.$emit("listenToVer", "quanguo");
            }else{
              //debugger;
              localStorage.setItem("provstorage", currentprov);
              this.$emit("listenToVer", "hebei");
            }
            this.countygeo2=false;
            
          } else {
            this.showMsg("登录后才可访问地方农情，请您登录！");
            this.$router.push({
              path: "/login",
              name: "login",
              params: { prov: currentprov }
            });
          }
      }
    },

    //地图鼠标经过
    highlightFeature(e) {
      if(this.$store.state.terminal=="web"){
        var layer = e.target; //触发事件的对象
        layer.setStyle({
          weight: 5,
          color: "#fff",
          dashArray: "",
          fillOpacity: 0.8
        });
        layer.bringToFront();
        this.showtip = true;
        this.showval = layer.feature.properties.name;

        //设定选中tr
        for (var i = 0; i < this.list.length; i++) {
          if (layer.feature.properties.name == this.list[i].name) {
            this.selects = [i];
          }
        }
      }
    },

    //获取tips位置坐标
    mousemove(e) {
      this.positionval = [e.clientX + 30, e.clientY - 94];
    },

    //点击板块加载折线图
    showtrendchart(e) {
      clearTimeout(this.clicktimer);
      var that = this;
      this.clicktimer = setTimeout(function() {
        //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
        that.addtrendchart(e);
      }, 1000);
    },
    addtrendchart(e) {
      var xdata = [];
      var ydata = [];
      var data = this.localTongji.series;
      for (var i = 0; i < data.length; i++) {
        var times = data[i].date.split("T")[0];
        var timesnew = times.split("-");
        var timeFinal;
        if (timesnew[1] == "01" && timesnew[2] == "01") {
          timeFinal = timesnew[0] + "年";
        } else {
          timeFinal = times;
        }

        xdata.unshift(timeFinal);
        var that = this;
        for (var j = 0; j < data[i].prod.length; j++) {
          if (data[i].prod[j].code == e.sourceTarget.feature.properties.code) {
             if(this.$store.state.prov !=""&&this.$store.state.prov !=440000){
              if (that.$store.state.prodtype == 4||that.$store.state.prodtype == 2) {
                ydata.unshift(data[i].prod[j].change);
              }else if(that.$store.state.prodtype == 0){
                ydata.unshift(data[i].prod[j].total_change);
              }else {
                ydata.unshift(data[i].prod[j].value);
              }
            }else{
              if (that.$store.state.prodtype == 4) {
                ydata.unshift(data[i].prod[j].change);
              }else {
                ydata.unshift(data[i].prod[j].value);
              }
            }
            
          }
        }
      }
      
      var text;
      var charttitle=["单产变化趋势（千克/亩）","长势变化趋势","面积变化趋势（万公顷）","土壤湿度变化趋势",["日均温度距平变化趋势（℃）", "累积降水距平变化趋势（mm）"],"发生面积（万公顷）"];
      if(this.$store.state.prov !=""&&this.$store.state.prov !=440000){
        charttitle[0]="总产变化率（%）";
        charttitle[2]="面积变化率（%）";
      }
      var chartval = charttitle[this.$store.state.prodtype];
      if (this.$store.state.prodtype == 4) {
          chartval = charttitle[this.$store.state.prodtype][this.$store.state.crop];
          text =e.sourceTarget.feature.properties.name + chartval;
      }else{
          text =e.sourceTarget.feature.properties.name +this.$store.state.cropval +chartval;
      }
      if(this.$store.state.terminal=="phone"){
          if(ydata.length!=0){
            //禁止滚动条
            document.getElementsByTagName("body")[0].style.overflow="hidden"
            this.openchart = true;
            this.myleftchart("marker", [xdata, ydata], text);
          }
          
      }else{
        var markecontent = document.getElementById("marker");
        if (markecontent != null) {
          //如果之前创建过popup，则删除创建的popup的div，否则，echarts会在之前的div中渲染数据，而新建的div不会有数据
          markecontent.parentNode.removeChild(markecontent);
        }
        var content =
        '<div style="width: 300px; height: 200px;background:transparent;" id="marker">123</div>';
        this.popups=L.popup().setLatLng(e.latlng).setContent(content).openOn(this.maps);
        this.myleftchart("marker", [xdata, ydata], text);
      }
    },
    hiddenchart(){
      this.openchart=!this.openchart;
      //恢复滚动条
      document.getElementsByTagName("body")[0].style.overflow="auto"
    },

    //处理chart数据
    handlechart(chartdata) {
      var provval = this.$store.state.prov;
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;
      // 处理数据-柱状图数据
      var xarray = [];
      var yarray = [];

      //饼状图数据
      var xydata = [];
      if (prodType == 0 || prodType == 2||!(provval==""||provval==130000||provval==440000)) {
        
        var datas=chartdata.sort(this.resortby("value")).reverse();
        if(prodType == 0){
          datas = chartdata.sort(this.resortby("total")).reverse();
        }
       
        var data1;
        var qita;
        if(this.$store.state.prov==""){
          data1=datas.slice(0,10);
          qita = datas.slice(10,datas.length);
        }else if((this.$store.state.prov==130000||this.$store.state.prov==440000)&&this.$store.state.level==3){
          if(datas.length>20){
            data1=datas.slice(0,20);
            qita = datas.slice(20,datas.length);
          }else{
            data1=datas;
            qita=[];
          }
        }else{
           
           if(prodType == 0 || prodType == 2){
              data1=datas;
           }else{
             data1=datas.reverse();
           }
           qita=[];
        }

        for (var i = 0; i < data1.length; i++) {
          var obj = {};
          obj.name = data1[i].name;
          if(prodType==0){
            obj.value = data1[i].total;
          }else{
            obj.value = data1[i].value;
          }
          if(prodType==0||prodType==2){
            xydata.push(obj);
          }else{
            xydata.unshift(obj);
          }
          
        }
        if(qita.length>0){
          var qitaarr =[];
          for(var j = 0;j<qita.length;j++){
            if(prodType==0){
              qitaarr.push(qita[j].total);
            }else{
              qitaarr.push(qita[j].value);
            }
          }
          //求和
          var qitaobj ={name:"其他",value:this.sumval(qitaarr)};
          xydata.push(qitaobj);
        }

      } else {
        var num = -1;
        for (var key in chartdata) {
          //饼图
          let obj = {};
          num++;
          if (!(prodType == 5 && chartdata[key] == 0)) {
            obj.value = chartdata[key];
            if (prodType == 4) {
              obj.name = this.pie[prodType][crop][num];
            } else {
              obj.name = this.pie[prodType][num];
            }
            xydata.push(obj);
            xydata.sort(this.resortby("value")).reverse();
          }
        }
      }
       for (let i = 0; i < xydata.length; i++) {
          yarray.push(xydata[i].value);
          xarray.push(xydata[i].name);
        }
      this.bardata = [xarray, yarray];
      this.piedata = [xarray, xydata];
      
    },
    //排序
    resortby(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },

    //获取主产区
    checkMain(n){
      var provval = this.$store.state.prov;
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;
      var code = this.$store.state.prov+"";
      
      if(code==""||code==undefined){
        code="000000";
      }else if(code.slice(0,2)=="13"){
        code="130000";
      }

      if((provval!=''&&provval!=440000&&(prodType == 2||prodType == 0))||prodType == 1||prodType == 5){
        var offsetnum = this.$store.state.offset;
        if(localStorage.getItem("offsetval")){
          offsetnum=localStorage.getItem("offsetval");
        }else{
          offsetnum = this.$store.state.offset
        }
        //ajax-params
        var parms = {
          limit: this.$store.state.limit,
          offset: offsetnum * (this.$store.state.limit-1),
          code:code,
        };
        if(n!=null||n!=undefined){
          parms.offset= n * (this.$store.state.limit-1);
        }
        if(prodType==5){
          parms.disease=crop
        }else{
          parms.crop=crop
        }

        this.$http.get(this.$store.state.ipaddress+this.optionarray3[prodType],{params:parms}).then(function(result){
          if(result.body.status){
            this.miandata = result.body.data;
            this.inforOve();
          }else{
            this.showMsg(result.body.msg);
          }
        })
      }else if(prodType == 3||prodType == 4){
        this.inforOve(this.list,this.list2);
      }else{
        var parm ={crop:crop,code:code,level:this.$store.state.level};
        this.$http.get(this.$store.state.ipaddress+"dics/main_areas",{params:parm}).then(function(result){
            if(result.body.status){
              this.mainPublic=result.body.data;
              this.inforOve(this.list,this.list2);
            }else{
              this.showMsg(result.body.msg);
            }
          })
      }
    },
    //信息总览
    inforOve(data1, data2) {
      //data1:当前时间
      var prodType = this.$store.state.prodtype;
      var provval= this.$store.state.prov;
      var crop = this.$store.state.crop;
      var titleall={
        0:["主产区总产","非主产区总产","主产区总产变化率","非主产区总产变化率"],
        1:["主产区长势指数","非主产区长势指数","主产区长势等级","非主产区长势等级"],
        2:["主产区面积","非主产区面积","主产区面积变化率","非主产区面积变化率"],
        3:["土壤湿度最高","土壤湿度变化率最高","土壤湿度最低","土壤湿度变化率最低"],
        4:[["最高温度累积","最高日均温度距平","最低温度累积","最低日均温度距平"],["最高降水累积","最高降水距平","最低降水累积","最低降水距平"]],
        5:["主产区病虫害面积","非主产区病虫害面积","主产区病虫害等级","非主产区病虫害等级"]
      }
      var infortitle=titleall[prodType]; //标题
      this.infor = [];
      var information;
          var infornum1;
          var infornum2;
          var infornum3;
          var infornum4;
          var inforunit1;
          
      if((provval!=''&&provval!=440000&&(prodType == 2||prodType == 0))||prodType == 1||prodType == 5){
            for (var i = 0; i < this.miandata.series.length; i++) {
              var time=null;
              if(provval!=''&&provval!=440000){
                time=localStorage.getItem("timedata")
              }else{
                time=this.currentdate
              }
              if (this.miandata.series[i].date == time) {
                information=this.miandata.series[i].prod
              }
            }
            
            if(prodType==1){
              inforunit1="无";
              infornum1=information.main_value;
              infornum2=information.other_value;
              infornum3=this.legend[prodType][information.main_grade-1];
              infornum4=this.legend[prodType][information.other_grade-1];
            }else if(prodType==5){
              inforunit1="万公顷";
              infornum1=information.main_area;
              infornum2=information.other_area;
              infornum3=this.legend[prodType][information.main_grade-1];
              infornum4=this.legend[prodType][information.other_grade-1];
            }else if(prodType==0){
              inforunit1="万吨";
              infornum1=information.main_total;
              infornum2=information.other_total;
              infornum3=information.main_total_rate+"%";
              infornum4=information.other_total_rate+"%";
            }else if(prodType==2){
              inforunit1=this.unit;
              infornum1=information.main_area;
              infornum2=information.other_area;
              infornum3=information.main_rate+"%";
              infornum4=information.other_rate+"%";
            }
            this.infor=[
            {title:infortitle[0],num:infornum1,name:"",unit:inforunit1},
            {title:infortitle[1],num:infornum2,name:"",unit:inforunit1},
            {title:infortitle[2],num:infornum3,name:"",unit:"无"},
            {title:infortitle[3],num:infornum4,name:"",unit:"无"},]
      }else if (prodType == 3||prodType == 4) {
        //var infornum1,infornum2,infornum3,infornum4,inforunit1,inforunit2;
        infornum1=this.filterTB(data1, "max", "value");
        infornum2=this.filterTB(data1, "min", "value");
        if(prodType==3){
          infornum3=this.filterCH(data1,data2, "max", "value");
          infornum4=this.filterCH(data1,data2, "min", "value");
          this.infor=[
              {title:infortitle[0],num:infornum1.num,name:infornum1.name,unit:this.unit},
              {title:infortitle[2],num:infornum2.num,name:infornum2.name,unit:this.unit},
              {title:infortitle[1],num:infornum3.num+"%",name:infornum3.name,unit:this.unit},
              {title:infortitle[3],num:infornum4.num+"%",name:infornum4.name,unit:this.unit},]
        }else{
          if(crop==0){
            infortitle = titleall[prodType][0];
          }else{
            infortitle = titleall[prodType][1];
          }
          infornum3=this.filterTB(data1, "max", "change");
          infornum4=this.filterTB(data1, "min", "change");
          this.infor=[
              {title:infortitle[0],num:infornum1.num,name:infornum1.name,unit:this.unit},
              {title:infortitle[2],num:infornum2.num,name:infornum2.name,unit:this.unit},
              {title:infortitle[1],num:infornum3.num,name:infornum3.name,unit:this.unit},
              {title:infortitle[3],num:infornum4.num,name:infornum4.name,unit:this.unit},]
        }
        
      }else if((provval==''||provval==440000)&&(prodType == 2||prodType == 0)){
        var data;
        var thisunit = this.unit;
        if(prodType==0){
          data=this.filterMain(data1, data2,"max", "total");
          thisunit="万吨"
        }else{
          data = this.filterMain(data1, data2,"max", "value");
        }
        this.infor=[
          {title:infortitle[0],num:data[0],name:"",unit:thisunit},
          {title:infortitle[1],num:data[1],name:"",unit:thisunit},
          {title:infortitle[2],num:data[2]+"%",name:"",unit:""},
          {title:infortitle[3],num:data[3]+"%",name:"",unit:""},] 
      }
      
    },
    //筛选最高/最低
    filterTB(data, grade, value) {
      var num = data[0][value];
      var name=data[0].name;
      for (var i = 0; i < data.length; i++) {
        if (grade == "max") {
          if (Number(data[i][value]) > Number(num)) {
            num = data[i][value];
            name=data[i].name;
          }
        } else if (grade == "min") {
          if (Number(data[i][value]) < Number(num)) {
            num = data[i][value];
            name=data[i].name;
          }
        }
      }
      return {num:num,name:name};
    },
    //土壤湿度变化率最高/最低（环比）
    filterCH(data1,data2,grade,value){
      if(data2.length!=0){
        var changes=[];
        for(var i = 0;i<data1.length;i++){
          var num1 = data1[i][value];
          var num2;
          for(var j=0;j<data2.length;j++){
              if(data1[i].code==data2[j].code){
                num2=data2[j][value];
                var obj ={};
                obj.name=data2[j].name;
                obj.change=(((num1-num2)/num2)*100).toFixed(2);
                changes.push(obj);
              }
          }
        }
        //console.log(changes);
        return this.filterTB(changes,grade,"change");
      }else{
        return {num:0,name:''};
      }
    },
    //主产筛选
    filterMain(data1,data2,grade,value){
      var mainarr=[];//主产区值
      var mainarr2=[];//主产区2值
      var nonmainarr = [];//非主产区值
      var nonmainarr2 = [];//非主产区2值
      for(var i = 0;i<data1.length;i++){
        var flag=false;
        for(var j= 0;j<this.mainPublic.length;j++){
            if(data1[i].code==this.mainPublic[j]){
              flag=true;
            }
        }
        if(flag){
          mainarr.push(data1[i][value]); 
        }else{
          nonmainarr.push(data1[i][value]);
        }
        
      }
      
      //求和
      var sum = this.sumval(mainarr);//主产区和
      var nonsum = this.sumval(nonmainarr);//非主产区和
      var mianchange=0;
      var nonmainchange=0;
      if(data2.length!=0){
        for(var m = 0;m<data2.length;m++){
          var flags=false;
          for(var n= 0;n<this.mainPublic.length;n++){
            if(data2[m].code==this.mainPublic[n]){
              flags=true;
            }
          }
          if(flags){
             mainarr2.push(data2[m][value]);  
          }else{
            nonmainarr2.push(data2[m][value]); 
          }
        }

        var sum2 = this.sumval(mainarr2);//主产区2和
        var nonsum2 = this.sumval(nonmainarr2);//非主产区2和
        mianchange=(((sum-sum2)/sum2)*100).toFixed(2);
        nonmainchange=(((nonsum-nonsum2)/nonsum2)*100).toFixed(2);
        if(mianchange==0.00){mianchange=0}
        if(nonmainchange==0.00){nonmainchange=0}
      }
      //console.log([sum,nonsum,sum2,nonsum2]);

      //主产区总产，非主产区总产，总产区变化率，非总产区变化率
      return [sum,nonsum,mianchange,nonmainchange];
    },

    //求和
    sumval(val){
      var sum=0;
      for(var n = 0;n<val.length;n++){
        sum+=val[n];
      }
      return sum.toFixed(2);
    },

    //左侧总指标title
    handletotaldata(time, dataall) {
      var pername = [
        ["总产", "总产变化率"],
        ["长势指数", "长势等级"],
        ["面积", "面积变化率"],
        ["土壤湿度指数", "土壤湿度等级"],
        [["时段温度累积", "日均温度距平"], ["时段降水累积", "时段降水距平"]],
        ["面积", "等级"]
      ];
      var leftname = ["产量统计","长势情况","面积统计","土壤湿度情况","气象状况","病虫害信息"];
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;
      var data;

      for (var i = 0; i < dataall.series.length; i++) {
        if (dataall.series[i].date == time) {
          data = dataall.series[i].prod[0];
        }
      }

      var val1 = "";
      var val2 = "";
      var var1unit = "";
      var var2unit = "";
      if (data) {
        if (prodType == 0 || prodType == 2 || prodType == 4) {
          var munit="%"
          if (prodType == 0) {
            val1 = data.total;
            var1unit = "万吨";
            val2 = data.total_change;
          } else {
            val1 = data.value;
            val2 = data.change;
            if (prodType == 4 && crop == 0) {
              var1unit = "℃";
              munit="℃";
            } else if (prodType == 4 && crop == 1) {
              var1unit = "mm";
              munit="mm";
            } else {
              var1unit = "万公顷";
            }
          }
          if (val2 > 0) {
            val2=val2+munit;
            var2unit = "上涨";
          } else if (val2 < 0) {
            val2 = -val2+munit;
            var2unit = "下降";
          } else {
            val2 = "持平";
            var2unit = "";
          }
        } else if (prodType == 1 || prodType == 5 || prodType == 3) {
          val1 = data.value;
          if(data.grade==0){
              val2 = "未种植";
            }else{
              val2 = this.legend[prodType][data.grade-1];
            }
          if (prodType == 1) {
            var1unit = "";
          } else {
            var2unit = "";
            if (prodType == 5) {
              var1unit = "万公顷";
            }
          }
        }
      }
      var nametitle= "全省"
      if(this.$store.state.prov==""){
        nametitle= "全国"
      }

      this.lefttotal = [
        pername[prodType][0],
        val1,
        var1unit,
        pername[prodType][1],
        val2,
        var2unit,
        nametitle+leftname[prodType]
      ];
      if (prodType == 4) {
        this.lefttotal = [
          pername[prodType][crop][0],
          val1,
          var1unit,
          pername[prodType][crop][1],
          val2,
          var2unit,
          nametitle+leftname[prodType]
        ];
      }
    },

    //chartdata:图表数据，charttype：图表类型，boolean：是否需要zoom
    mychart(chartdata, charttype) {
      var provval=this.$store.state.prov;
      var prodType=this.$store.state.prodtype;
      var crop=this.$store.state.crop;
      this.$echarts.init(document.getElementById("rightchart")).dispose();
      let mycharts = this.$echarts.init(
        document.getElementById("rightchart"),
        "dark"
      );
      var option;
      var unithtml = "";
      var pietitle = "";
      if(provval==""||provval==130000||provval==440000){
        pietitle = "面积";
        unithtml = "万公顷";
        if (prodType == 0) {
          pietitle = "产量";
          unithtml = "万吨";
        }
      }else{
        if (prodType == 0) {
          pietitle = "产量";
          unithtml = "万吨";
        }else if(prodType == 1||prodType == 3){
          pietitle = "指数";
        }else if(prodType == 2){
          pietitle = "面积";
          unithtml = "万公顷";
        }else{
          pietitle = "累积";
          if(crop==0){
            unithtml = "℃";
          }else{
            unithtml = "mm";
          }
        }
      }
      var fontnum,normalsize,legendnum,leftnum,rightnum,topnum,bottomnum;
      if(this.$store.state.terminal=="phone"){
        var num=document.body.offsetWidth / 750 * 100
        fontnum=0.6*num+"";
        normalsize=0.28*num+"";
        legendnum=0.2*num;
        leftnum=1.4*num+"";
        rightnum=1.2*num+"";
        topnum=0.7*num+"";
        bottomnum=2*num+"";
      }else{
        fontnum="30";
        normalsize="12";
        legendnum=10;
        leftnum="70";
        rightnum="60";
        topnum="35";
        bottomnum="100"
      }

      if (charttype == "pie") {
        option = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            formatter: "占比: {d}%<br/>" + pietitle + ": {c}" + unithtml,
            textStyle:{
              fontSize:normalsize
            }
          },
          legend: {
            type: "scroll",
            orient: "vertical",
            x: "left",
            data: chartdata[0],
            itemGap: legendnum, //图例每项之间的间隔
            itemWidth: legendnum, //图例标记的图形宽度
            itemHeight: legendnum, //图例标记的图形高度
            left: legendnum,
            select: false,
            pageIconColor:"#fff",
            pageIconInactiveColor:"#666",
            pageIconSize:normalsize+"",
            pageTextStyle:{
                fontSize:normalsize,
                color: "#fff"
            },
            textStyle:{
              fontSize:normalsize
            }
          },

          series: [
            {
              name: "总产量所占比例",
              type: "pie",
              radius: ["40%", "60%"],
              center: ["60%", "50%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: fontnum,
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: chartdata[1]
            }
          ],
          color: [
            "#EC183B",
            "#00AAAC",
            "#FCD404",
            "#A72391",
            "#27AF4C",
            "#FDB815",
            "#5B2D90",
            "#A3CE3B",
            "#F7931E",
            "#0371BC",
            "#E0B802",
            "#F37022",
            "#C70E2E",
            "#015D9E",
            "#D09A09",
            "#871075",
            "#028D8F",
            "#D09A09",
            "#4B2079",
            "#1E9541",
            "#C95C15",
            "#004991",
            "#8AAD30",
            "#C95D15",
            "#9F011F",
            "#AF8305",
            "#6E005C",
            "#A06308",
            "#3D0763",
            "#A2480A",
            "#BF9E01"
          ]
          //color:["#FCD404", "#FDB815", "#F7931E", "#F37022", "#EC183B", "#A72391", "#5B2D90", "#0371BC", "#00AAAC", "#27AF4C", "#A3CE3B", "#E0B802", "#D09A09", "#D09A09", "#C95C15", "#C95D15", "#C70E2E", "#871075", "#4B2079", "#004991", "#015D9E", "#028D8F", "#1E9541", "#8AAD30", "#BF9E01", "#AF8305", "#A06308", "#A2480A", "#9F011F", "#6E005C", "#3D0763"]
          //color:["#2E7E32", "#43C6FE", "#FEFE01", "#FC3D7F", "#1AFEFF", "#1BFFFF", "#FFD749", "#DE42FE", "#69FFDC", "#FFAE44", "#7E47FF", "#6DEEB5", "#FE6F3B", "#566BFD", "#AAFC56", "#4B87FF", "#EDFF48", "#CDFF92", "#76FF06", "#C6FF01", "#205A22", "#00695D", "#22FAF9", "#FF3700", "#FF8200", "#FF8200", "#3B80FF", "#FFDF00"," #71FFCF", "#1D89E9", "#fff"]
        };
      } else {
        var datazoom={show : false};
          if((provval==130000&&this.$store.state.level==3)||(provval!=""&&provval!=130000&&provval!=440000)){
            datazoom={
              type: 'slider',//图表下方的伸缩条
              show : true,  //是否显示
              backgroundColor:"#02476e",
              
              fillerColor:"#37a2da",
              borderColor:"#202020", 
              handleSize: 0,
              height: 30,//组件高度
              start : 0,  //伸缩条开始位置（1-100），可以随时更改
              end : 30,  //伸缩条结束位置（1-100），可以随时更改
              bottom: 30,//右边的距离
            };
          }
          

        option = {
          backgroundColor: "transparent",
          title: {
            subtext: "单位：" + unithtml,
            padding: [0, 0, 0, 15],
            subtextStyle: {
              fontSize: normalsize,
              fontWeight: "normal",
              lineHeight: 30
            }
          },
          tooltip: {
            axisPointer: {
              type: "shadow"
            },
            trigger: "axis",
            textStyle:{
              fontSize:normalsize
            }
          },
          grid: {
            left: leftnum, // 与容器左侧的距离
            right: rightnum, // 与容器右侧的距离
            top: topnum, // 与容器顶部的距离
            bottom: bottomnum // 与容器底部的距离
          },
          xAxis: {
            data: chartdata[0],
            axisLabel: {
              interval: 0,
              rotate: 45,
              textStyle: {
                color: "#999",
                fontSize:normalsize,
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          dataZoom: [datazoom],
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#999",
                fontSize:normalsize,
              }
            }
          },
          series: [
            {
              type: "bar",
              itemStyle: {
                normal: { color: "#37a2da" }
              },
              data: chartdata[1]
            }
          ]
        };
      }
      mycharts.setOption(option, true);
      window.onresize = this.$echarts.resize;
    },

    //处理leftchart数据
    handleleftchart(chartdata) {
      var xdata = [];
      var ydata = [];
      var data = chartdata.series;
      var prodType = this.$store.state.prodtype;
      var crop = this.$store.state.crop;

      for (var i = 0; i < data.length; i++) {
        var times = data[i].date.split("T")[0];
        var timesnew = times.split("-");
        var timeFinal;
        if (timesnew[1] == "01" && timesnew[2] == "01") {
          timeFinal = timesnew[0] + "年";
        } else {
          timeFinal = times;
        }

        xdata.unshift(timeFinal);
        if (data[i].prod.length != 0) {
          if (prodType == 4) {
            ydata.unshift(data[i].prod[0].change);
          } else if (prodType == 0) {
            ydata.unshift(data[i].prod[0].total);
          } else if (
            prodType == 1 ||
            prodType == 2 ||
            prodType == 3 ||
            prodType == 5
          ) {
            ydata.unshift(data[i].prod[0].value);
          }
        }
      }
      this.leftchartdata = [xdata, ydata];

      var textarr = ["总产变化趋势（万吨）","长势变化趋势","面积变化趋势（万公顷）", "土壤湿度变化趋势", ["温度日均距平变化趋势", "降水距平变化趋势"],"面积变化趋势"];
      var text = textarr[prodType];
      if (prodType == 4) {
        text = textarr[prodType][crop];
      } else if (prodType == 0 || prodType == 2) {
        text = "全国" + this.$store.state.cropval + textarr[prodType];
        if (this.$store.state.prov != "") {
          text = "全省" + this.$store.state.cropval + textarr[prodType];
        }
      } else if (prodType == 5) {
        text = this.$store.state.cropval + textarr[prodType];
      }
      //加载左侧chart
      this.myleftchart("staticschart", this.leftchartdata, text, "80");
    },

    //left
    myleftchart(id, chartdata, text, left) {
      var myChart = this.$echarts.init(document.getElementById(id));
      var leftval = "60";
      if (left) {
        leftval = left;
      }
     
      var normalsize,topnum,rightnum,bottomnum;
      if(this.$store.state.terminal=="phone"){
        var num=document.body.offsetWidth / 750 * 100;
        normalsize=0.28*num+"";
        topnum=num+"";
        rightnum=0.4*num+"";
        leftval=(parseInt(leftval)/50*num)+"";
        bottomnum=1.8*num+"";
      }else{
        normalsize="14"
        topnum="50";
        rightnum="20";
        bottomnum="70"
      }

      // 指定图表的配置项和数据
      myChart.setOption({
        title: {
          text: text,
          x: "center",
          textStyle: {
            fontSize: normalsize,
            fontWeight: "normal",
            color: "#fff",
            lineHeight: 30
          }
        },
        tooltip: {
          trigger: "axis",
          textStyle:{
              fontSize:normalsize
            }
        },
        xAxis: [
          {
            type: "category",
            data: chartdata[0],
            boundaryGap: false,
            axisLabel: {
              rotate: 45,
              interval: 0,
              textStyle: {
                color: "#fff",
                fontSize:normalsize
              }
            },
            axisLine: {
              lineStyle: {
                color: "#999"
              }
            }
          }
        ],
        grid: {
          left: leftval, // 与容器左侧的距离
          right: rightnum, // 与容器右侧的距离
          top: topnum, // 与容器顶部的距离
          bottom: bottomnum, // 与容器底部的距离
        },
        yAxis: [
          {
            // name: geoPropertyData.unit,
            type: "value",
            // min:Math.floor(Math.min.apply(null, chartdata[1])),
            // max: Math.ceil(Math.max.apply(null, chartdata[1])),
            min:Math.min.apply(null, chartdata[1]),
            max: Math.max.apply(null, chartdata[1]),
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff",
                fontSize:normalsize
              }
            },
            axisLine: {
              lineStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            data: chartdata[1],
            itemStyle: {
              normal: {
                color: "#03a5ff"
              }
            },
            lineStyle: {
              normal: {
                color: "#03a5ff"
              }
            },
            areaStyle: {
              normal: {
                color: "#03a5ff" //改变区域颜色
              }
            }
          }
        ]
      });
    },

    //切换图表类型
    changechart(num) {
      var boolean = true;
      var prodType = this.$store.state.prodtype;
      if (prodType != 0 && prodType != 2) {
        boolean = false;
      }
      if (num == 2) {
        this.currentchart = 1;
        this.mychart(this.piedata, "pie", false);
      } else {
        this.currentchart = 2;
        this.mychart(this.bardata, "bar", boolean);
      }
    },

    //轮播切换
    changeli(changedate,boolean) {
      //console.log(this.offsetval)
      if(this.$store.state.terminal=="phone"&&!boolean){
          this.openbottom=!this.openbottom;
      }
      this.currentdate = changedate;
      if(this.$store.state.prov!=''&&this.$store.state.prov!=440000){
        if(localStorage.getItem("timedata")){
          localStorage.removeItem("timedata");
          localStorage.setItem("timedata",changedate);
        }else{
          localStorage.setItem("timedata",changedate);
        }
      }
      
      this.loadcontent();
      this.reloadmap();
      this.handletotaldata(changedate, this.totaldata);
    },
    changenext(direction) {
      if (direction == "left"||direction == "right") {
        if(this.$store.state.prov!=''&&this.$store.state.prov!=440000){
          this.offsetval = localStorage.getItem("offsetval")
        }
        if(direction == "right"){
          this.offsetval--;
        }else{
          this.offsetval++;
        }
        if(this.$store.state.prov!=''&&this.$store.state.prov!=440000){
          if(localStorage.getItem("offsetval")){
            localStorage.removeItem("offsetval");
            localStorage.setItem("offsetval",this.offsetval);
          }else{
            localStorage.setItem("offsetval",this.offsetval);
          }
        }
        this.getInitdata(this.$store.state.prov, direction);
      } else if (direction == "stop"){
        this.played=!this.played;
        if (this.timer) clearInterval(this.timer);
      }  else {
        this.played=!this.played;
        if(this.$store.state.terminal=="phone"){
          this.openbottom=!this.openbottom;
        }
        
        if (this.timer) clearInterval(this.timer);
        var timeslength = this.times.length;
        var num = 0;
        if(timeslength==this.$store.state.limit){
          num=1
        }
        this.timer = setInterval(() => {
          if (num < timeslength) {
            this.changeli(this.times[num].date,true);
          } else {
            clearInterval(this.timer);
            this.showMsg("播放完成");
            this.played=!this.played;
          }
          num++;
        }, 1000);
      }
    },

    //表格排序
    handleSortChange({ name, order }) {
      //desc:降序-asc:升序
      var namesarr;
      var prodType = this.$store.state.prodtype;
      if (prodType == 0) {
        namesarr = ["", "value", "total", "total_change"];
      } else if (prodType == 4 || prodType == 2) {
        namesarr = ["", "value", "change"];
      } else {
        namesarr = ["", "value"];
      }
      var names = namesarr[name - 1];
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[names] - b[names] : b[names] - a[names]
      );
    },

    //设置legend值
    setLegendval(val) {
      var provval = this.$store.state.prov;
      var params = "";
      var prodType = this.$store.state.prodtype;
      if(provval==""||provval==440000){
        val=val.sort(this.resortby("value"));
        params = "value";
        
        var num=0;
        for(var i = 0;i<val.length;i++){
          if(val[i][params]==0){
            num++;
          }
        }
        var nlength=Math.round((val.length-num)/4);
        this.legend[prodType] = [
            0,
            val[nlength+num-1][params],
            val[2*nlength+num-1][params],
            val[3*nlength+num-1][params],
            val[3*nlength+num-1][params]
          ];
      }else{
        this.legend[prodType] = this.legendshebei;
      }
      
    },

    //四舍五入
    mathround(num) {
      if (isNaN(num)) {
        return;
      }
      var val = Math.round(num * 10) / 10;
      return val;
    },

    //初始化地图
    initmap(id) {
      this.$nextTick(()=>{
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
          detectRetina:true
        });
        this.maps.zoomControl.setPosition("topright");
        this.basemapval = L.tileLayer(
          "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
        );
        this.basemapval.addTo(this.maps);
        this.maps.on("zoomend", this.resetLayer);
      })
    },

    //底图
    showbasemap() {
      this.baseboolean = !this.baseboolean;
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

    //切换市县级别
    changelevel() {
      if(this.$store.state.prov==''){
        if (this.$store.state.level == 2) {
          this.$store.commit("changelevel", 1);
          localStorage.setItem("leveldata", 1);
        } else{
          this.$store.commit("changelevel", 2);
          localStorage.setItem("leveldata", 2);
        }
      }else{
        if (this.$store.state.level == 2) {
          this.$store.commit("changelevel", 3);
          localStorage.setItem("leveldata", 3);
        } else if (this.$store.state.level == 3) {
          this.$store.commit("changelevel", 2);
          localStorage.setItem("leveldata", 2);
        }
      }
    },
    //放大显示地块及河北县级缩小展示市级
    resetLayer() {
      var changezoom = 13;
      var zoomval = this.maps._zoom;
      //console.log(zoomval);
      var prodType = this.$store.state.prodtype;
      if (zoomval >= changezoom &&(prodType == 1 || prodType == 2) &&this.$store.state.prov == 130000 &&this.zoomed == false) {
        //清除地图图片层
          if (prodType == 1) {
            this.layerGeo.remove()
          }
        this.reloadmap(true);
        this.zoomed = true;
        
        if(prodType==2){
          this.zoomlegend=true;
        }
      } else if (zoomval < changezoom &&(prodType == 1 || prodType == 2) &&this.$store.state.prov == 130000 &&this.zoomed == true) {
        if (this.layerTms) {
          this.layerTms.remove();
        }
        this.reloadmap();
        this.zoomed = false;
        if(prodType==1){
          var growthdata;
          for (var i = 0; i < this.localFenbu.series.length; i++) {
            if (this.localFenbu.series[i].date == this.currentdate) {
              growthdata = this.localFenbu.series[i].prod;
            }
          }
          //获取图片url及位置
          var imageUrl = growthdata.img;
          var imageBounds = [
            //获取图片url及位置
            [this.localFenbu.extent.top, this.localFenbu.extent.left],
            [this.localFenbu.extent.bottom, this.localFenbu.extent.right]
          ];

          //（长势，土壤，病虫害加载图片图层）
            this.layerGeo = L.imageOverlay(
              this.ipaddress + imageUrl,
              imageBounds,
              { opacity: 1 }
            );
            this.layerGeo.addTo(this.maps);
        }
        if(prodType==2){
          this.zoomlegend=false;
        }
      }

      if(zoomval <= 6&&this.$store.state.prov != 130000&&this.$store.state.prov != 440000&&this.$store.state.prov != ""){
        if (this.layerGeo != null) {
            this.layerGeo.remove()
          }
        //河北县级缩放到市级，展示河北市级数据
        this.$store.commit("changeprovclient", [130000, "hebei"]);
        this.$store.commit("changelevel", 2);
        localStorage.setItem("leveldata", 2);
      }
    }
  }
};
</script>
<style>
@import "../../node_modules/leaflet/dist/leaflet.css";
</style>