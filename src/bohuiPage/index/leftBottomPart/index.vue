<template>
    <div class="myoverview commondiv spritesbox bohui-tongji">
        <span class="sprites-lt"></span>
        <span class="sprites-rt"></span>
        <span class="sprites-lb"></span>
        <span class="sprites-rb"></span>
        <div class="title">红线详情</div>
        <div v-for="id in redLinesIds"  :id="id" :key="id" style="width: 100%;min-height:40%;z-index: 9999999;"></div>
    </div>
</template>

<script>
export default {
    name: '',
    data(){
        return {
            redDatas:'',
            redLinesIds: [],
            redLinesOption:new Map()
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
                            barWidth: 10,
                            itemStyle : { normal: {label : {show: true, position: 'insideTop',textStyle:{color:'#fff'}}}}
                        })
                    }
                });
                const option = {
                    title:{
                        text: '红线总计'
                    },
                    tooltip:{
                        trigger:'axis'
                    },
                    legend:{
                        data:legendData
                    },
                    xAxis:[{
                        type: 'value',
                        boundaryGap: [0,0.01]
                    }],
                    yAxis: [
                        {
                            type: 'category',
                            data: [rd.name]
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