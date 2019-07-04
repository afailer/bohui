<template>
  <div class="rightContent">
    <div class="active-right-tab">
      <span
        v-for="activeData in leftDatas"
        :key="activeData.id"
        @click="renderChart(activeData.id)"
        :class="activeData.id === currentId ? 'active' : ''"
      >
        {{activeData.name}}
      </span>
    </div>
    <div style="height: 36%; padding-top: 20px" id="humanActivePieChart"></div>
    <div style="flex: 1;padding-bottom: 20px" id="huamanActive1"></div>
  </div>
</template>

<script>
import { getHumanActiveData } from '../utils/bohuiApi'
import { ColorMap } from '../utils/colorUtil';

export default {
  name: 'activeRight',
  mounted () {
    this.loadInitData();
  },
  data () {
    return {
      leftDatas: [],
      rightDatas: [],
      barChartOptions: new Map(),
      pieChartoptions: new Map(),
      tabIds: [1, 2, 3],
      currentId: 1
    }
  },
  methods: {
    loadInitData () {
      console.log(this.$store.state.leftDataTime + '----initChart------' + this.$store.state.rightDataTime);
      if (this.$store.state.leftDataTime !== '' && this.$store.rightDataTime !== '') {
        this.barChartOptions.clear();
        this.pieChartoptions.clear();
        console.log('----initChart------')
        Promise.all([
          getHumanActiveData(this.$store.state.areaCode, this.$store.state.leftDataTime, 1),
          getHumanActiveData(this.$store.state.areaCode, this.$store.state.rightDataTime, 1)
        ]).then(res => {
          this.leftDatas = res[0].data.data;
          this.rightDatas = res[1].data.data;
          for (let l = 0; l < this.leftDatas.length; l++) {
            this.processBarChartData(this.leftDatas[l], this.rightDatas[l])
            this.processPieChartData(this.leftDatas[l], this.rightDatas[l])
          }
          this.renderChart(1)
        })
      }
    },
    getDataByLeftTime () {
      getHumanActiveData(this.$store.state.areaCode, this.$store.state.leftDataTime, 1).then(res => {
        this.leftDatas = res.data.data;
      })
    },
    getDataByRightTime () {
      getHumanActiveData(this.$store.state.areaCode, this.$store.state.rightDataTime, 1).then(res => {
        this.rightDatas = res.data.data
      })
    },
    processBarChartData (actionDataLeft, actionDataRight) {
      const legendData = [];
      const xName = [];
      const seriesVal = [];
      const seriesDataLeft = [];
      const seriesDataRight = [];
      const leftTime = this.$store.state.leftDataTime
      const rightTime = this.$store.state.rightDataTime
      actionDataLeft.indices.forEach(indice => {
        xName.push(indice.name);
        legendData.push(indice.name);
        let data = 0;
        indice.speckles.forEach(actionData => {
          data += actionData.number
        });
        seriesDataLeft.push(data)
      });
      actionDataRight.indices.forEach(indice => {
        let data = 0;
        indice.speckles.forEach(actionData => {
          data += actionData.number
        });
        seriesDataRight.push(data)
      });
      seriesVal.push({
        name: leftTime + actionDataLeft.name,
        type: 'bar',
        data: seriesDataLeft,
        itemStyle: {
          normal: {
            color: function (data) {
              const colorVal = ColorMap.get(data.name);
              return colorVal === undefined ? '#ffffff' : colorVal;
            }
          }
        }
      });
      seriesVal.push({
        name: rightTime + actionDataLeft.name,
        type: 'bar',
        data: seriesDataRight,
        itemStyle: {
          normal: {
            color: function (data) {
              const colorVal = ColorMap.get(data.name);
              return colorVal === undefined ? '#ffffff' : colorVal;
            },
            opacity: 0.5
          }
        }
      });
      const barChartOption = {
        title: {
          text: actionDataLeft.name,
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
          left: '3%',
          top: '35px',
          bottom: '1%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: xName,
          left: '0.2%',
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0,0.01],
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
      this.barChartOptions.set(actionDataLeft.id, barChartOption)
    },
    renderChart (id) {
      this.currentId = id;
      console.log('----renderChart------')
      this.$nextTick(() => {
        console.log(this.barChartOptions)
        const myChart = this.$echarts.init(document.getElementById('huamanActive1'));
        myChart.setOption(this.barChartOptions.get(id));
        const humanActivePieChart = this.$echarts.init(document.getElementById('humanActivePieChart'));
        humanActivePieChart.setOption(this.pieChartoptions.get(id))
      })
    },
    processPieChartData (leftActionData, rightActionData) {
      const legendData = [];
      const leftItemDataList = [];
      const rightItemDataList = [];
      leftActionData.indices.forEach(item => {
        legendData.push(item.name);
        let val = 0;
        item.speckles.forEach(a => {
          val += a.number
        });
        leftItemDataList.push({
          name: item.name,
          value: val === 0 ? 100 : val
        })
      });
      rightActionData.indices.forEach(item => {
        let val = 0;
        item.speckles.forEach(a => {
          val += a.number
        });
        rightItemDataList.push({
          name: item.name,
          value: val === 0 ? 100 : val
        })
      });
      const option = {
        title: {
          text: leftActionData.name,
          x: 'center',
          textStyle: {
            fontSize: '14px',
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
        series: [{
          type: 'pie',
          radius: ['10%', '30%'],
          center: ['55%', '40%'],
          data: leftItemDataList,
          itemStyle: {
            normal: {
              color: function (data) {
                const colorVal = ColorMap.get(data.data.name);
                return colorVal === undefined ? '#ffffff' : colorVal;
              }
            }
          }
        },
        {
          type: 'pie',
          radius: ['40%', '55%'],
          center: ['55%', '40%'],
          data: rightItemDataList,
          itemStyle: {
            normal: {
              color: function (data) {
                const colorVal = ColorMap.get(data.data.name);
                return colorVal === undefined ? '#ffffff' : colorVal;
              },
              opacity: 0.5
            }
          }
        }]
      };
      this.pieChartoptions.set(leftActionData.id, option)
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
      this.loadInitData();
    },
    rightTime: function () {
      this.loadInitData();
    }
  }
}
</script>

<style lang="scss">
.active-right-tab{
  height: 50px;
  line-height: 50px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  > span{
    display: inline-block;
    width: 33%;
    text-align: center;
    background-color: #0d4664;
    color: #ffffff;
    cursor: pointer;
    &:hover{
      background-color: #d05b2f;
    }
  }
  .active{
    background-color: #d05b2f;
  }
}
</style>
