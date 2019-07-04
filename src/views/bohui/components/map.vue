<template>
  <div style="width: 100%; height: 100%; position: relative">
    <div ref="tip" class="hovertips" v-show="showTip">{{showVal}}</div>
    <map-ctrl
      :showCtrl="showCtrl"
      :all-tuceng="allTuceng"
      :initSelectTuceng="initSelectTuceng"
      @changebase="changeBase"
      @changeCover="changeCover">
    </map-ctrl>
    <div :id="mapId" style="width: 100%; height: 100%" ref="map"></div>
  </div>
</template>

<script>
import $ from 'jquery';
import L from 'leaflet';
import MapCtrl from './mapCtrl';
import { HumanActiveMapping, getFillColorByData } from '../utils/colorUtil';

export default {
  name: '',
  props: ['mapId'],
  data () {
    return {
      map: '',
      layerGroup: '',
      showCtrl: true,
      allTuceng: [
        { name: '所有', value: 'all' },
        { name: '卫星', value: 'satellite' },
        { name: '禁止开发区红线', value: 'jinzhi' },
        { name: '科学开发区红线', value: 'kexue' }
      ],
      initSelectTuceng: ['卫星', '禁止开发区红线', '所有', '科学开发区红线'],
      layerMap: {
        set: function (key, obj) {
          this.keys.add(String(key))
          this.objs.push({
            key: String(key),
            val: obj
          })
        },
        get: function (key) {
          if (this.keys.has(key)) {
            const vals = [];
            this.objs.forEach(o => {
              if (o.key === String(key)) {
                vals.push(o.val)
              }
            });
            return vals
          } else {
            return [];
          }
        },
        getForFunc: function(key, fun){
          this.get(key).forEach(o => {
            fun(o);
          })
        },
        keys: new Set(),
        objs: []
      },
      showTip: false,
      showVal: '',
      positionval: '',
      // allCoverage: [], // [{name:'所有',value: 'all'},{name:'卫星',value: 'satellite'},{name:'禁止开发区红线',value: 'jinzhi'},{name:'科学开发区红线', value: 'kexue'}],
      startCoverd:['all','satellite','jinzhi','kexue']
    }
  },
  mounted () {
    this.initMap(this.mapId)
  },
  methods: {
    initMap (mapId) {
      this.layerGroup = L.layerGroup();
      this.map = L.map(mapId, {
        center: [31.69, 104.32], // 地图的初始地理中心
        zoom: 4,
        minZoom: 1, // 地图的最小缩放级别
        // maxZoom: 13, // 地图的最大缩放级别
        doubleClickZoom: false,
        attributionControl: false,
        zoomControl: false,
        crs: L.CRS.EPSG3857, // 要使用的坐标参考系统
        animate: true,
        detectRetina: true,
        scrollWheelZoom: true
      });
      this.basemapval = L.tileLayer(
        'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
      );
      this.basemapval.addTo(this.map);
      this.layerGroup.addTo(this.map);
      this.$bus.$emit('mapLoad', this.map);
      this.afterInitMap();
    },
    afterInitMap () {
      // this.loadGeoImage('/geoserver/gwc/service/tms/1.0.0/ecology%3Ayuzhong_pct@EPSG%3A900913@png/{z}/{x}/{y}.png')
    },
    loadGeoImage (address) {
      const geoLayer = L.tileLayer(address, {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        tms: true
      });
      geoLayer.addTo(this.map)
      this.layerMap.set('satellite', geoLayer)
    },
    getWeight () {
      return window.resetColor ? 6 : 2;
    },
    getBorderColor () {
      return window.resetColor ? '#fff' : '#1d8bea';
    },
    addGeoJson (layerName, geoData, fillColor, shouldFitBounds) {
      const polygonjson = L.geoJSON(geoData, {
        style: (data) => {
          return {
            fillColor: getFillColorByData(data, fillColor),
            weight: this.getWeight(),
            opacity: 0.3,
            dashArray: '3',
            color: this.getBorderColor(),
            fillOpacity: 0.9
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              this.onmouseover(e, polygonjson);
            },
            mouseout: (e) => {
              this.onmouseout(e, polygonjson)
            },
            mousemove: (e) => {
              this.onmousemove(e, polygonjson)
            },
            dblclick: (e) => {
              this.onDbClick(e, polygonjson)
            },
            click: (e) => {
              this.onClick(e, polygonjson)
            }
          })
        }
      }).bindPopup(function (layer) {
        return layer.feature.properties.XZJGZQYMC;
      });
      this.layerMap.set(layerName, polygonjson);
      this.layerGroup.addLayer(polygonjson);
      if (shouldFitBounds) {
        this.map.fitBounds(polygonjson.getBounds())
      }
    },
    changeBase (name) {
      const ditu = L.layerGroup([
        L.tileLayer(
          'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
          { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
        )
      ]);
      const rsimage = L.layerGroup([
        L.tileLayer(
          'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
          { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
        )
      ]);
      const dems = L.layerGroup([
        L.tileLayer(
          'https://mt1.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
          { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
        )
      ]);
      this.basemapval.remove();
      if (name === 'ditu') {
        this.basemapval = ditu;
      } else if (name === 'rsimage') {
        this.basemapval = rsimage;
      } else if (name === 'dems') {
        this.basemapval = dems;
      }
      this.basemapval.addTo(this.map);
    },
    onmouseover (e, polygonJson) {
      window.resetColor = true;
      e.target.bringToFront();
      polygonJson.resetStyle(e.target);
      this.showTip = true;
      this.showVal = e.target.feature.properties.XZJGZQYMC;
    },
    onmouseout (e, polygonJson) {
      this.showTip = false;
      window.resetColor = false;
      polygonJson.resetStyle(e.target)
    },
    onmousemove (e, polygonJson) {
      const val = e.target.feature.properties.XZJGZQYMC
      // this.showVal = e.target.feature.properties.XZJGZQYMC;
      this.showVal = val !== undefined ? val : HumanActiveMapping.get(e.target.feature.properties.humanActive);
      this.$refs.tip.style.left = e.originalEvent.clientX + 30 + 'px';
      this.$refs.tip.style.top = e.originalEvent.clientY - 94 + 'px';
    },
    deleteLayer (name) {
      this.layerMap.getForFunc(name, (layer) => {
        console.log('--name-----')
        console.log(layer)
        name === 'satellite' ? layer.bringToBack() : this.layerGroup.removeLayer(layer);
      })
    },
    onDbClick (e, polygonJson) {
      // 双击
    },
    onClick () {},
    changeCover (covers) {
      console.log(covers)
      this.allTuceng.forEach(cover => {
        const c = cover.value;
        console.log(c)
        if (c === 'redbox') {
          this.$bus.$emit('displayRect', covers.indexOf(c) !== -1)
        }
        this.layerMap.getForFunc(c, (layer) => {
          if (layer !== undefined) {
            if (covers.indexOf(c) === -1) { // 新集合中不存在，说明已去除，不显示
              c === 'satellite' ? layer.bringToBack() : this.layerGroup.removeLayer(layer);
            } else {
              c === 'satellite' ? layer.bringToFront() : this.layerGroup.addLayer(layer)
            }
          }
        });
      });
    },
  },
  components: { MapCtrl }
}
</script>

<style lang="scss">
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
