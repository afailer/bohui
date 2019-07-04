<template>
  <div id="redLineBarChart" style="width: 100%;height: 35%; margin-top: 5%"></div>
</template>

<script>
import { getColor } from '../utils/colorUtil';
import { getHumanActiveData } from '../utils/bohuiApi';

export default {
  name: 'redlineBarChart',
  data () {
    return {
      barChartOptions: new Map()
    }
  },
  mounted () {
    this.initData();
  },
  created () {
    this.$bus.$on('resetBarChart', (id) => {
      this.resetBarChart(id)
    })
  },
  methods: {
    initData () {
      // this.$store.state.time
      getHumanActiveData(this.$store.state.areaCode, '2018-01-05', 1).then(res => {
        res.data.data.forEach(d => {
          this.processBarChartData(d)
        });
        console.log('barChartOptions');
        console.log(this.barChartOptions);
        this.resetBarChart(res.data.data[0].id)
      })
    },
    processBarChartData (ad) {
      const legendData = [];
      const xName = [];
      const seriesVal = [];
      const seriesData = [];
      ad.indices.forEach(indice => {
        xName.push(indice.name);
        legendData.push(indice.name);
        let data = 0;
        indice.speckles.forEach(actionData => {
          data += actionData.number
        });
        seriesData.push(data)
      });
      seriesVal.push({
        name: ad.name,
        type: 'bar',
        data: seriesData,
        itemStyle: {
          normal: {
            color: function () {
              return getColor()
            }
          }
        }
      });
      const barChartOption = {
        title: {
          text: ad.name,
          x: 'center',
          textStyle: {
            fontSize: '12px',
            color: '#fff',
            lineHeight: 30
          },
          pageTextStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData,
          orient: 'horizontal',
          textStyle: {
            fontSize: '14px',
            color: '#fff'
          }
        },
        grid: {
          left: '2%',
          top: '35px',
          bottom: '1%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: xName,
          left: '0.2%',
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {

              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: seriesVal
      };
      this.barChartOptions.set(ad.id, barChartOption)
    },
    resetBarChart (id) {
      const myChart = this.$echarts.init(document.getElementById('redLineBarChart'));
      myChart.setOption(this.barChartOptions.get(id))
    }
  }
}
</script>

<style lang="scss">

</style>
