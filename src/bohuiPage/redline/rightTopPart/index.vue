<template>
    <div class="mytable commondiv spritesbox bohui-tongji">
        <span class="sprites-lt"></span>
        <span class="sprites-rt"></span>
        <span class="sprites-lb"></span>
        <span class="sprites-rb"></span>
        <div class="title">{{currentArea}}人类活动</div>
        <div id="humanPieChart" style="width: 100%;height: 25%;z-index: 9999999;margin-top: 10px"></div>
        <div v-for="id in chartIds"
             :id="id+'active'"
             :key="id"
             style="width: 90%;margin: 0 auto; height: 24%;z-index: 9999999"
             @click=handleBarClick(id)
        >
        </div>
    </div>
</template>

<script>
    import { getColor } from "../../../utils/colorUtil";
    export default {
        name: 'humanActive',
        mounted() {
            this.loadData()
        },
        data(){
            return{
                chartIds:[],
                activeDatas: [],
                options: new Map(),
                barChartOptions: new Map(),
                currentArea: this.$store.state.areaName
            }
        },
        methods: {
            loadData(){
                const url = this.$store.state.bohuiAddress + '/humanAction/speckle?areaCode=620121&dataTime=2019-01-05&type=1';
                this.$http.get(url).then(res => {
                    this.activeDatas = res.data.data;
                    this.activeDatas.forEach(rd =>{
                        this.chartIds.push(rd.id);
                        this.processData(rd);
                        this.processBarChartData(rd)
                    });
                    this.resetChartData(this.activeDatas[2].id);
                    this.initBarChart();
                })
            },
            processData(rd){
                const legendData = [];
                const itemDataList = [];
                rd.indices.forEach(item => {
                    legendData.push(item.name);
                    let val = 0;
                    item.actions.forEach(a => {
                        val += a.number
                    });
                    itemDataList.push({
                        name: item.name,
                        value: val === 0 ? 100 : val
                    })
                });
                const option = {
                    title: {
                        text: rd.name,
                        x:'center',
                        textStyle: {
                            fontSize: '14px',
                            fontWeight: "normal",
                            color: "#fff",
                            lineHeight: 30
                        },
                        pageTextStyle:{
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
                        textStyle:{
                            color: "#fff",
                            fontSize:12
                        }
                    },
                    series: {
                        type: 'pie',
                        radius: '45%',
                        center: ['55%','40%'],
                        data: itemDataList,
                        itemStyle: {
                            normal:{
                                color: function () {
                                    return getColor();
                                }
                            }
                        }
                    }
                };
                this.options.set(rd.id, option)
            },
            resetChartData(id){
                const myChart = this.$echarts.init(document.getElementById('humanPieChart'));
                myChart.setOption(this.options.get(id))
            },
            processBarChartData(ad){
                const legendData = [];
                const xName = [];
                const seriesVal = [];
                const seriesData = [];
                ad.indices.forEach(indice => {
                    xName.push(indice.name);
                    legendData.push(indice.name);
                    let data = 0;
                    indice.actions.forEach(actionData => {
                        data += actionData.number
                    });
                    data = data !== 0 ? data : 100;
                    seriesData.push(data)
                });
                seriesVal.push({
                    name: ad.name,
                    type: 'bar',
                    data: seriesData,
                    itemStyle:{
                        normal:{
                            color: function () {
                                return getColor()
                            }
                        }
                    }
                });
                const barChartOption = {
                    title: {
                        text: ad.name,
                        x:'center',
                        textStyle: {
                            fontSize: '12px',
                            color: "#fff",
                            lineHeight: 30
                        },
                        pageTextStyle:{
                            color: '#fff'
                        }
                    },
                    tooltip:{
                        trigger:'axis'
                    },
                    legend:{
                        data:legendData,
                        orient:"horizontal",
                        textStyle: {
                            fontSize: '14px',
                            color: "#fff"
                        }
                    },
                    grid:{
                        left: '2%',
                        top:'35px',
                        bottom: '1%',
                        containLabel: true
                    },
                    yAxis:[{
                        type: 'category',
                        data: xName,
                        left:'0.2%',
                        axisLabel: {
                            show: true,
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
                    series:seriesVal
                };
                this.barChartOptions.set(ad.id, barChartOption)
            },
            handleBarClick(id){
                this.resetChartData(id)
            },
            initBarChart(){
                this.$nextTick(() => {
                    this.chartIds.forEach(id => {
                        const myChart = this.$echarts.init(document.getElementById(id+'active'));
                        myChart.setOption(this.barChartOptions.get(id))
                    });
                });
            }
        }
    }
</script>

<style>

</style>