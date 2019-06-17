<template>
    <div style="width: 100%; height: 100%;background-color: yellow" class="content">
        <div>
            <bohui-map></bohui-map>
<!--            <date-picker></date-picker>-->
            <active-box :direction="left"></active-box>
            <active-box :direction="right"></active-box>
            <diff-time></diff-time>
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import BohuiMap from './map'
import ActiveBox from './activeBox'
import DiffTime from './diffTimeMap'
import DatePicker from './datePicker'
import L from "../../../node_modules/leaflet/dist/leaflet";
export default {
    name: 'humanActiveBox',
    data(){
        return{
            left: 'left',
            right: 'right',
            maps: [],
            mapCount: 0,
            centerMap:'',
            rect: '',
            rectBounds:'',
            lastLatLng: ''
        }
    },
    created(){
      this.$bus.$on("mapLoad", (map) => {
          if(this.mapCount > 0){
              this.maps.push(map)
          }else{
              this.centerMap = map
          }

          this.mapCount++;
          if(this.mapCount === 3){
              this.startListen()
          }
      })
    },
    mounted(){
        if (this.$store.state.terminal == "web") {
            window.fullHeight = document.documentElement.clientHeight;
            $(".content,.contentbox,#map").height(window.fullHeight - 105 + "px");
            $(".mytable").height(window.fullHeight - 150 + "px");
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
                    $(".mytable").height(window.fullHeight - 150 + "px");
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
    methods:{
        startListen(){
            //const target = this.centerMap;
            //this.maps[0].setView(target.getCenter(),target.getZoom());
            //this.maps[1].setView(target.getCenter(),target.getZoom());
            this.maps.map((t) => {
                t.on({
                    drag: () => {
                        this.mapLink(t)
                    },
                    zoom: () => {
                        this.mapLink(t)
                    }
                })
            })
        },
        mapLink(target){
            this.drawBox(target)
            this.maps.map(function (t) {
                t.setView(target.getCenter(),target.getZoom())
            })
        },
        drawBox(target){
            const bounds = target.getBounds();
            const northEast = bounds._northEast;
            const southWest = bounds._southWest;
            this.rectBounds = [[southWest.lat, southWest.lng], [northEast.lat, northEast.lng]];
            if(this.rect === ''){
                if(target.getZoom() >= this.centerMap.getZoom()){
                    this.rect = L.rectangle(this.rectBounds, {color: "#ff0000", weight: 2});
                    this.rect.addTo(this.centerMap);
                }
            }else{
                this.rect.setBounds(this.rectBounds);
            }
        }
    },
    components: {BohuiMap, ActiveBox, DiffTime}
}
</script>

<style lang="less">

</style>