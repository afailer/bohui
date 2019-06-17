<template>
    <div ref="diffMapContainer" class="diff-map-container">
        <div style="height:100%;width: 49%;float: left;margin-left:0.6%;background: #ffffff;z-index: 99999999999">
            <diff-map
                    ref="leftMap"
                    :mapPropId="leftMapId"
                    :show-base=this.showBase
                    :show-cover=this.showCover
            ></diff-map>
        </div>
        <div style="height:100%;width: 49%;float: left;margin-left:0.5%;background: #ffffff;z-index:99999999999">
            <diff-map
                    ref="rightMap"
                    :mapPropId="rightMapId"
                    :show-base=this.showBase
                    :show-cover=this.showCover
                    style="margin-left: 5px"></diff-map>
        </div>
        <date-picker></date-picker>
    </div>
</template>

<script>
import DiffMap from './diffMap'
import DatePicker from "../datePicker/index";
export default {
    name: '',
    components:{DatePicker, DiffMap},
    mounted() {
        const width = window.innerWidth - 730 +'px';
        this.$refs.diffMapContainer.style.width = width;
        this.$refs.diffMapContainer.style.paddingTop = '5px'
    },
    data(){
        return{
            showBase:false,
            showCover:false,
            leftMapId: 'leftMap',
            rightMapId: 'rightMap'
        }
    },
    created(){
      this.$bus.$on("putGeoToChildrenMap",(geoData) => {
          this.putGeoToChildrenMap(geoData)
      })
    },
    methods:{
        putGeoToChildrenMap(data){
            this.$refs.leftMap.layerMap.getForFunc("child", (layer) =>{
                this.$refs.leftMap.layerGroup.removeLayer(layer);
            });
            this.$refs.leftMap.loadTargetPlace("child" ,data, "#ff0000", true);

            this.$refs.rightMap.layerMap.getForFunc("child", (layer) =>{
                this.$refs.rightMap.layerGroup.removeLayer(layer);
            });
            this.$refs.rightMap.loadTargetPlace("child" ,data, "#ff0000", true);
        }
    }
}
</script>

<style lang="less">
    .diff-map-container{
        height: 500px;
        position: fixed;
        bottom: 24px;
        background: #ffffff;
        left: 365px;
        z-index: 999999;
    }
</style>