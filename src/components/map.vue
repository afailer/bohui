<template>
    <div style="width: 100%; height: 100%;">
        <mu-chip
                class="demo-chip"
                color="primary"
                :style="{left:positionval[0]+'px',top:positionval[1]+'px'}"
                v-show="showTip"
        >{{showVal}}</mu-chip>
        <map-button
                :allCoverage=this.allCoverage
                :startCoverd=this.startCoverd
                :show-base=this.showBase
                :show-cover=this.showCover
                @changeBase = changeBase
                @changeCover = changeCover
        ></map-button>
        <div :id="mapId" style="width: 100%; height: 100%" ref="map"></div>
    </div>
</template>

<script>
import L from "../../node_modules/leaflet/dist/leaflet";
import tempData from './tempData'
import MapButton from './mapBtn'
import { getColor } from "../utils/colorUtil";
import markerClusterGroup from "leaflet.markercluster";
export default {
    name: 'map',
    props:["mapPropId","showCover","showBase"],
    data(){
      return {
          mapId:'map',
          map: '',
          showVal:'',
          showTip: false,
          positionval:[],
          basemapval:'',
          layerMap: {
              set: function (key, obj){
                  this.keys.add(String(key))
                  this.objs.push({
                      key: String(key),
                      val: obj
                  })
              },
              get: function (key) {
                if(this.keys.has(key)){
                    const vals = [];
                    this.objs.forEach(o => {
                        if(o.key === String(key)){
                            vals.push(o.val)
                        }
                    });
                    return vals
                }else{
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
          layerGroup: '',
          allCoverage:[{name:'所有',value: 'all'},{name:'卫星',value: 'satellite'},{name:'禁止开发区红线',value: 'jinzhi'},{name:'科学开发区红线', value: 'kexue'}],
          startCoverd:['all','satellite','jinzhi','kexue']
          // allCoverage: [],
          // startCoverd:[]
      }
    },
    components:{ MapButton },
    created(){
      if(this.mapPropId){
          this.mapId = this.mapPropId
      }
    },
    mounted(){
        this.initMap(this.mapId)
        this.resetSize();
    },
    methods:{
        resetSize(){},
        initMap(id){
            this.$nextTick(()=>{
                this.map = L.map(id, {
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
                this.$bus.$emit("mapLoad", this.map);
                this.map.zoomControl.setPosition("topright");
                this.basemapval = L.tileLayer(
                    "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
                    { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
                );
                this.basemapval.addTo(this.map);
                this.layerGroup = new L.layerGroup();
                this.layerGroup.addTo(this.map);
                this.loadAllMapInfoByAreaCode();
            })
        },
        getBorderColor(){
            return window.resetColor ? '#fff' : '#1d8bea';
        },
        getWeight(){
            return window.resetColor? 6:2;
        },
        getFillColor(data, fillColor){
            if(data.color){
                return  window.resetColor ? '#fff' : data.color;
            }
            data.color = fillColor ? fillColor : 'transparent';
            return data.color
        },
        loadAllMapInfoByAreaCode(){

        },
        loadGeoData(layerName, geoServer){
            const server = this.$store.state.geoIP + geoServer;
            const geoLayer = L.tileLayer(server,{
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                tms:true
            });
            this.layerMap.set(layerName, geoLayer);
            const markers = L.markerClusterGroup();
            markers.addLayer(geoLayer);
            markers.addTo(this.map)
        },
        loadTargetPlace(layerName ,geoData, fillColor, shouldFitBounds){
            console.log(geoData)
            const polygonjson = L.geoJSON(geoData, {
                style: (data) => {
                    return {
                        fillColor: this.getFillColor(data, fillColor),
                        weight: this.getWeight(),
                        opacity: 0.3,
                        dashArray: "3",
                        color: this.getBorderColor(),
                        fillOpacity: 0.3
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
                    });
                }
            }).bindPopup(function (layer) {
                return layer.feature.properties.XZJGZQYMC;
            });
            if(shouldFitBounds){
                const markers = L.markerClusterGroup();
                markers.addLayer(polygonjson);
                markers.addTo(this.map)
                this.map.fitBounds(markers.getBounds());
                markers.removeFrom(this.map)
                this.layerMap.set(layerName, polygonjson);
                this.layerGroup.addLayer(polygonjson)
            }else{
                this.layerMap.set(layerName, polygonjson);
                this.layerGroup.addLayer(polygonjson)
            }
        },

        onmouseover(e, polygonJson){
            window.resetColor = true;
            e.target.bringToFront();
            polygonJson.resetStyle(e.target);
            this.showTip = true;
            this.showVal = e.target.feature.properties.XZJGZQYMC;
        },
        onmouseout(e, polygonJson){
            this.showTip =false;
            window.resetColor = false;
            polygonJson.resetStyle(e.target)
        },
        onmousemove(e, polygonJson){
            this.showVal = e.target.feature.properties.XZJGZQYMC;
            this.positionval = [e.originalEvent.clientX + 30, e.originalEvent.clientY - 94];
        },
        changeBase(name){
            const ditu = L.layerGroup([
                L.tileLayer(
                    "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
                    { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
                )
            ]);
            const rsimage = L.layerGroup([
                L.tileLayer(
                    "https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
                    { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
                )
            ]);
            const dems = L.layerGroup([
                L.tileLayer(
                    "https://mt1.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
                    { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
                )
            ]);

            this.basemapval.remove();
            if (name === "ditu") {
                this.basemapval = ditu;
            } else if (name === "rsimage") {
                this.basemapval = rsimage;
            } else if (name === "dems") {
                this.basemapval = dems;
            }
            this.basemapval.addTo(this.map);
            this.layerMap.getForFunc('satellite',(layer) => {
                layer.bringToFront()
            })
        },
        changeCover(covers){
            this.allCoverage.forEach(cover=> {
                const c = cover.value;
                this.layerMap.getForFunc(c, (layer) =>{
                    if(covers.indexOf(c) === -1) { //新集合中不存在，说明已去除，不显示
                        c === 'satellite' ? layer.bringToBack():this.layerGroup.removeLayer(layer);
                    }else{
                        c === 'satellite' ? layer.bringToFront() : this.layerGroup.addLayer(layer)
                    }
                });
            });
        },
        onDbClick(e, polygonjson){
        },
        onClick(e, polygonjson){
        }
    }
}
</script>

<style lang="less">
.content{
    .leaflet-popup{
        display: none !important;
    }
}
</style>