<template>
  <div id="redLinePieChart" style="width: 100%;height: 35%;"></div>
</template>

<script>
import { getColor } from '../utils/colorUtil';

export default {
  name: 'barChart',
  created () {
    this.$bus.$on('resetPieData', (data) => {
      data.forEach(d => {
        this.processChartData(d)
      });
      console.log(this.optionsMap)
      this.resetChart(data[0].id)
    });
    this.$bus.$on('resetPieChart', (id) => {
      this.resetChart(id)
    })
  },
  data () {
    return {
      optionsMap: new Map()
    }
  },
  methods: {
    processChartData (item) {
      const legendData = [];
      const itemDataList = [];
      item.redlineDataList.forEach(rd => {
        if (rd.type === 1) {
          legendData.push(rd.name)
          itemDataList.push({
            value: rd.area,
            name: rd.name
          })
        }
      });
      const normalsize = '16px';
      const Option = {
        title: {
          text: item.name,
          x: 'center',
          textStyle: {
            fontSize: normalsize,
            fontWeight: 'normal',
            color: '#fff',
            lineHeight: 30
          },
          pageTextStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          top: '6%',
          data: legendData,
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        series: {
          type: 'pie',
          radius: '75%',
          center: ['50%','55%'],
          data: itemDataList,
          itemStyle: {
            normal: {
              color: function (params) {
                // 自定义颜色
                const colorList = [
                  '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463', '#00FFFF'
                ];
                if (params.dataIndex < colorList.length) {
                  return getColor() // colorList[params.dataIndex]
                } else {
                  return getColor()
                }
              }
            }
          }
        }
      };
      this.optionsMap.set(item.id, Option)
    },
    resetChart (name) {
      const myChart = this.$echarts.init(document.getElementById('redLinePieChart'));
      myChart.setOption(this.optionsMap.get(name))
    }
  }
}
</script>
