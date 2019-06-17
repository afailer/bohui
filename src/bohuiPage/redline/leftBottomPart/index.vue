<template>
    <div class="myoverview commondiv spritesbox bohui-tongji">
        <span class="sprites-lt"></span>
        <span class="sprites-rt"></span>
        <span class="sprites-lb"></span>
        <span class="sprites-rb"></span>
        <div class="title">{{currentArea}}红线详情</div>
        <div v-for="id in redLinesIds"  :id="id" :key="id" style="width: 100%;min-height:32%;z-index: 9999999; box-sizing: border-box; padding: 0 10px; margin: 0 auto;"></div>
    </div>
</template>

<script>
import { getColor } from "../../../utils/colorUtil";
export default {
    name: '',
    data(){
        return {
            redDatas:'',
            redLinesIds: [],
            redLinesOption:new Map(),
            currentArea: this.$store.state.areaName
        }
    },
    created() {
        this.$bus.$on("redData", (redData) => {
            this.redDatas = redData;
            this.redDatas.forEach(rd => {
                this.processOption(rd)
            });
            this.initChart()
        })
    },
    methods:{
        processOption(rd) {
            if(rd.type === 1){
                const legendData = [];
                const seriesVal = [];
                rd.redlineDataList.forEach(rdItem => {
                    if(rdItem.type === 1){
                        legendData.push(rdItem.name);
                        seriesVal.push({
                            name:rdItem.name,
                            type: 'bar',
                            data: [rdItem.area],
                            itemStyle:{
                                normal:{
                                    color: getColor()
                                }
                            }
                        })
                    }
                });
                const option = {
                    tooltip:{
                        trigger:'axis'
                    },
                    legend:{
                        data:legendData,
                        top:'13%',
                        textStyle: {
                            fontSize: '14px',
                            color: "#fff"
                        }
                    },
                    grid:{
                        left: '2%',
                        top:'55px',
                        bottom: '1%',
                        containLabel: true
                    },
                    xAxis:[{
                        type: 'category',
                        data: [rd.name],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }],
                    yAxis: [
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
                    series:seriesVal
                };
                this.redLinesIds.push(rd.id);
                this.redLinesOption.set(rd.id,option)
            }

        },
        initChart(){
            this.$nextTick(() =>{
                this.redLinesIds.forEach(rdId => {
                    const myChart = this.$echarts.init(document.getElementById(String(rdId)));
                    myChart.setOption(this.redLinesOption.get(rdId))
                })
            });

        }
    }
}
</script>

<style lang="less">

</style>