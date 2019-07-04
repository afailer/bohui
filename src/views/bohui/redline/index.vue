<template>
  <div class="map-container">
    <div style="width: 73%;height: 100%">
      <red-line-map :mapId="'redlineMap'"></red-line-map>
    </div>
    <div class="rightContent">
      <div>
        <div class="top-title" >
          <img src="/static/img/icon1.cf1dbd2b.png">
          <div class="top-title-left">
            <p style="font-weight: 800;font-size: 26px;color: #ffffff;">340.3222</p>
            <p class="top-title-content">榆中县红线总面积</p>
            <p class="top-title-content">(平方公里)</p>
          </div>
          <img src="/static/img/icon1.cf1dbd2b.png">
          <div>
            <p style="font-weight: 800;font-size: 26px;color: #ffffff;">10.33%</p>
            <p class="top-title-content">榆中县红线总占比</p>
          </div>
        </div>
        <table-data></table-data>
      </div>
      <div class="bottom-part">
        <p class="chart-title">榆中县生态对比饼状图</p>
        <pie-chart></pie-chart>
        <p class="chart-title">榆中县人类活动柱状图</p>
        <bar-chart></bar-chart>
      </div>
    </div>
  </div>
</template>

<script>
import RedLineMap from './redlineMap'
import TableData from './tableData'
import PieChart from './pieChart'
import BarChart from './barChart'
export default {
  name: 'redline',
  components: { RedLineMap, TableData, PieChart, BarChart },
  mounted () {
  }
}
</script>
<style lang="scss">
  @import "../common.scss";
</style>
