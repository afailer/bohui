<script>
import CommonMap from '../components/map'
import { getGeoDataByAreaCode, getJinZhiGeoDataByAreaCode,
  getGeoImgUrlByAreaCode, getKeXuePGGeoDataByAreaCode,
  getHumanActiveDataByAreaCode } from '../utils/bohuiApi';

export default {
  name: 'activeMap',
  extends: CommonMap,
  data () {
    return {
      allTuceng: [
        { name: '所有', value: 'all' },
        { name: '卫星', value: 'satellite' },
        { name: '禁止开发区红线', value: 'jinzhi' },
        { name: '科学开发区红线', value: 'kexue' },
        { name: '人类活动', value: 'active' },
        { name: '范围对应', value: 'redbox' }
      ],
      initSelectTuceng: ['卫星', '禁止开发区红线', '所有', '科学开发区红线', '人类活动']
    }
  },
  methods: {
    afterInitMap () {
      const areaCode = this.$store.state.areaCode;
      getGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('all', res.data, 'transparent', true)
      });
      getJinZhiGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('jinzhi', res.data, '#00ff00')
      });
      getKeXuePGGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('kexue', res.data, '#ff0000')
      });
      getGeoImgUrlByAreaCode(areaCode).then(res => {
        this.loadGeoImage(res)
      });
      getHumanActiveDataByAreaCode(areaCode, '2019').then(res => {
        this.addGeoJson('active', res.data)
      })
    },
    onDbClick (e, polygonJson) {
      // 双击
      const geoJson = {
        "type": "FeatureCollection",
        "name": "jinzhikaifa",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": []
      };
      const jsonStr = JSON.stringify(geoJson);
      const geoObj = JSON.parse(jsonStr)
      geoObj.features.push(e.target.feature)
      this.$bus.$emit('putGeoToChildrenMap', geoObj)
    }
  }
}
</script>

<style lang="scss">

</style>
