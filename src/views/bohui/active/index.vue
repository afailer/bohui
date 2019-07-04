<template>
  <div class="map-container">
    <div style="width: 73%;height: 100%;position: relative">
      <active-map :mapId="mapId"></active-map>
      <diff-map></diff-map>
    </div>
    <active-right></active-right>
  </div>
</template>

<script>
import ActiveMap from './activeMap'
import ActiveRight from './activeRight'
import DiffMap from './diffTimeMap'
import L from 'leaflet';
export default {
  name: 'humanActive',
  data () {
    return {
      mapId: 'activeMapId',
      leftDatas: {},
      rightDatas: {},
      rect: '',
      maps: [],
      displayRect: false,
      mapCount: 0
    }
  },
  components: { ActiveMap, ActiveRight, DiffMap },
  created () {
    this.$bus.$on('mapLoad', (map) => {
      if (this.mapCount > 0) {
        this.maps.push(map)
      } else {
        this.centerMap = map
      }
      this.mapCount++;
      console.log(this.mapCount)
      if (this.mapCount === 3) {
        this.startListen()
      }
    });
    this.$bus.$on('displayRect', (flag) => {
      this.displayRect = flag;
    })
  },
  watch: {
    displayRect: function () {
      this.changRectDisplay()
    }
  },
  methods: {
    startListen () {
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
    mapLink (target) {
      this.drawBox(target);
      this.maps.map(function (t) {
        t.setView(target.getCenter(), target.getZoom())
      })
    },
    drawBox (target) {
      const bounds = target.getBounds();
      const northEast = bounds._northEast;
      const southWest = bounds._southWest;
      this.rectBounds = [[southWest.lat, southWest.lng], [northEast.lat, northEast.lng]];
      if (this.rect === '') {
        if (target.getZoom() >= this.centerMap.getZoom()) {
          this.rect = L.rectangle(this.rectBounds, { color: '#ff0000', weight: 2 });
        }
      } else {
        if (this.rect && this.rect !== '') {
          this.rect.setBounds(this.rectBounds);
        }
      }
    },
    changRectDisplay () {
      if (this.rect && this.rect !== '') {
        if (this.displayRect) {
          this.rect.addTo(this.centerMap);
        } else {
          this.rect.removeFrom(this.centerMap);
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "../common.scss";
</style>
