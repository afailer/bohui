<template>
  <div ref="diffMapContainer" class="diff-map-container" :class="showDiff ? '' : 'notShowDiff'">
    <div class="resize-bar" @click="resize"></div>
    <div v-show="showDiff" style="height:98%;width: 49%;float: left;margin-top:1%;margin-left:0.8%;background: transparent;z-index: 99999999999">
      <diff-map
        ref="leftMap"
        :mapId="leftMapId"
      ></diff-map>
    </div>
    <div v-show="showDiff" style="height:98%;width: 49%;float: left;margin-top:1%;background: #ffffff;z-index: 99999999999">
      <diff-map
        ref="rightMap"
        :mapId="rightMapId"
        style="margin-left: 5px"></diff-map>
    </div>
    <date-picker v-show="showDiff"></date-picker>
  </div>
</template>

<script>
import DiffMap from './diffMap'
import DatePicker from '../datePicker/index';
export default {
  name: '',
  components: { DatePicker, DiffMap },
  mounted () {
    document.onmousemove = (e) => {
      if (this.startResize) {
        const height = window.fullHeight - e.clientY - 12 ;
        if (height < window.fullHeight * 0.4) {
          this.$refs.diffMapContainer.style.height = height + 'px'
        }
      }
    };
    document.onmouseup = (e) => {
      this.startResize = false;
      this.$bus.$emit('mouseup', e);
    };
  },
  data () {
    return {
      showCtrl: false,
      leftMapId: 'leftMap',
      rightMapId: 'rightMap',
      startResize: false,
      showDiff: true
    }
  },
  created () {
    this.$bus.$on('putGeoToChildrenMap', (geoData) => {
      this.putGeoToChildrenMap(geoData)
    })
  },
  methods: {
    putGeoToChildrenMap (data) {
      this.$refs.leftMap.deleteLayer('child');
      this.$refs.leftMap.addGeoJson('child', data, '#ff0000', true);

      this.$refs.rightMap.deleteLayer('child');
      this.$refs.rightMap.addGeoJson('child', data, '#ff0000', true);
    },
    resize () {
      this.showDiff = !this.showDiff
    }
  }
}
</script>

<style lang="scss">
.diff-map-container{
    height: 40%;
    position: absolute;
    bottom: 24px;
    background: #ffffff;
    left: 1%;
    width: 98%;
    z-index: 999999;
    .resize-bar{
       position: absolute;
        top: 0;
        height: 16px;
        width: 100%;
        cursor: pointer;
    }
}
.notShowDiff{
  height: 12px!important;
}
</style>
