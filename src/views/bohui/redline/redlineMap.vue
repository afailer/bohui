<script>
import BaseMap from '../components/map'
import { getGeoDataByAreaCode, getKeXuePGGeoDataByAreaCode, getJinZhiGeoDataByAreaCode, getGeoImgUrlByAreaCode } from '../utils/bohuiApi';
export default {
  name: 'redlineMap',
  extends: BaseMap,
  methods: {
    afterInitMap () {
      const areaCode = this.$store.state.areaCode;
      getGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('all', res.data, 'transparent', true)
      });
      getJinZhiGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('jinzhi', res.data, '#00ff00')
      })
      getKeXuePGGeoDataByAreaCode(areaCode).then(res => {
        this.addGeoJson('kexue', res.data, '#ff0000')
      })
      getGeoImgUrlByAreaCode(areaCode).then(res => {
        this.loadGeoImage(res)
      })
    }
  }
}
</script>
