<template>
    <div class="mystatistics commondiv spritesbox bohui-tongji">
        <span class="sprites-lt"></span>
        <span class="sprites-rt"></span>
        <span class="sprites-lb"></span>
        <span class="sprites-rb"></span>
        <div class="title">红线统计</div>
        <mu-paper :z-depth="1" style="background: transparent">
            <mu-data-table @row-click=rowClick  :columns="tableTitles" :data="tableList">
                <template slot-scope="scope">
                    <td>{{scope.row.lineName}}</td>
                    <td>{{scope.row.area}}</td>
                    <td>{{scope.row.rate}}</td>
                </template>
            </mu-data-table>
        </mu-paper>
        <div id="redLineChart" style="width: 100%;height: 500px;z-index: 9999999;margin-top: 10px"></div>
    </div>
</template>

<script>
import { getColor } from "../../../utils/colorUtil";

export default {
    name: 'leftTop',
    data(){
        return{
            totalData: '',
            optionsMap: new Map(),
            tableTitles: [
                {title:"",name:'lineName'},
                {title: '红线面积',name: 'area'},
                {title: '占全县国土比例',name:'rate',width:80}
            ],
            tableList: [],
            currentRowName:''
        }
    },
    mounted() {
        this.initData();
    },
    methods:{
        initData(){
            const url = this.$store.state.bohuiAddress + '/redlineData/data?areaCode=620121&dataTime=2019-01-05';
            this.$http.get(url).then(res => {
                this.totalData = res.body.data;
                this.$bus.$emit("redData", this.totalData);
                res.body.data.forEach(d => {
                    if(d.type === 1){
                        this.processChartData(d);
                    }

                    if(d.type === 1 || d.type === 3){
                        const item = {
                            lineName: d.name
                        };
                        d.redlineDataList.forEach(rd => {
                            if(rd.type === 2 || d.type === 3){
                                item.area = rd.area + rd.areaUnit;
                                item.rate = rd.rate + '%'
                            }
                        });
                        this.tableList.push(item)
                    }
                });
                this.resetChart(this.totalData[0].name)
            })
        },
        currentRow(a,rowName){
            return rowName === this.currentRowName ? 'background-color:#013e64':''
        },
        rowClick(index,row){
            if(this.optionsMap.get(row.lineName)){
                this.resetChart(row.lineName)
            }
        },
        processChartData(item){
            const legendData = [];
            const itemDataList = [];
            item.redlineDataList.forEach(rd =>{
                if(rd.type === 1){
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
                    x:'center',
                    textStyle: {
                        fontSize: normalsize,
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
                        center: ['45%','40%'],
                        data: itemDataList,
                        itemStyle: {

                            normal:{
                                color:function(params) {
                                    //自定义颜色
                                    var colorList = [
                                       '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463', '#00FFFF'
                                    ];
                                    if(params.dataIndex < colorList.length){
                                        return getColor()//colorList[params.dataIndex]
                                    }else{
                                        return getColor();
                                    }

                                }
                            }
                        }
                }
            };
            this.optionsMap.set(item.name, Option)
        },
        resetChart(name){
            this.currentRowName = name
            const myChart = this.$echarts.init(document.getElementById('redLineChart'))
            myChart.setOption(this.optionsMap.get(name))
        }
    }
}
</script>

<style lang="less">
    .high{
        background: #013e64;
    }
</style>