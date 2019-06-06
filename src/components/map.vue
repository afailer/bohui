<template>
    <div style="width: 100%; height: 100%;">
        <div id="map" style="width: 100%; height: 100%"></div>
    </div>
</template>

<script>
import L from "../../node_modules/leaflet/dist/leaflet";
import markerClusterGroup from "leaflet.markercluster";
export default {
    name: 'map',
    data(){
      return {

      }
    },
    mounted(){
        this.initMap("map")
    },
    methods:{
        initMap(id){
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
            })
        }
    }
}
</script>

<style lang="less">

</style>