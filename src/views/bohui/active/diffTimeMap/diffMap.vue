<script>
import $ from 'jquery';
import BaseMap from '../../components/map'
import { getHumanActiveDataByAreaCode, getGeoImgUrlByAreaCode } from '../../utils/bohuiApi';

export default {
  name: 'diffMap',
  extends: BaseMap,
  data () {
    return {
      mapName: '',
      mapDatas: [],
      showCtrl: false
    }
  },
  beforeMount () {
    const map = $(this.mapId);
    map.css('margin-left', '10px');
    map.css('float', 'left');
    map.css('width', '49.5%');
  },
  methods: {
    afterInitMap () {
      if (this.mapId === 'leftMap') {
        this.loadMapInfo('left')
      } else {
        this.loadMapInfo('right')
      }
    },
    loadMapInfo (mapSide) {
      const time = mapSide === 'left' ? this.$store.state.leftDataTime : this.$store.state.rightDataTime
      if (time !== '') {
        const year = time.substring(0, 4);
        this.deleteLayer('lastJson');
        this.deleteLayer('satellite');
        getHumanActiveDataByAreaCode(this.$store.state.areaCode, year).then(res => {
          this.addGeoJson('lastJson', res.data)
        });
        getGeoImgUrlByAreaCode(this.$store.state.areaCode, time).then(res => {
          this.loadGeoImage(res)
        })
      }
    }
  },
  computed: {
    leftTime () {
      return this.$store.state.leftDataTime;
    },
    rightTime () {
      return this.$store.state.rightDataTime;
    }
  },
  watch: {
    leftTime: function () {
      if (this.mapId === 'leftMap') {
        this.loadMapInfo('left');
      }
    },
    rightTime: function () {
      if (this.mapId === 'rightMap') {
        this.loadMapInfo('right');
      }
    }
  }
}
</script>

<style lang="scss">
.diff-map-container{
  width: 49.5%;
  height: 100%;
  float: left;
  background: transparent;
  z-index: 999999999;
}
</style>
