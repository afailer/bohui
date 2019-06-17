
<script>
    import $ from "jquery";
    import BaseMap from '../../../components/map'
    export default {
        name: 'diffMap',
        extends: BaseMap,
        props: ['mapPropId'],
        mounted(){
            this.$nextTick(() => {
                console.log('--------------');
                console.log(this.map.getBounds())
            });
        },
        data(){
            return{
                mapName: '',
                mapDatas: []
            }
        },
        methods:{
            resetSize(){
                const map = $(this.mapPropId)
                map.css('margin-left','10px')
                map.css('width','49.5%');
                map.css('float','left')
            },
            addImgOnMap(){
                if(this.mapName !== ''){
                    this.layerMap.getForFunc(this.mapName, (layer) => {
                        this.layerGroup.removeLayer(layer)
                    });
                }
                this.mapName = 'mapName';
                this.mapDatas && this.mapDatas.forEach(d => {
                    this.loadGeoData(this.mapName, d.url)
                })

            },
            loadMapImg(mapSide){
                let url = '';
                if(this.mapPropId === 'leftMap' && mapSide === 'left' && this.$store.state.leftDataTime !== ''){
                    url = this.$store.state.bohuiAddress + `/ecologyRs/resources?areaCode=${this.$store.state.areaCode}&menuId=40&dataTime=${this.$store.state.leftDataTime}`

                }else if(this.mapPropId === 'rightMap' && mapSide === 'right' && this.$store.state.rightDataTime){
                    url = this.$store.state.bohuiAddress + `/ecologyRs/resources?areaCode=${this.$store.state.areaCode}&menuId=40&dataTime=${this.$store.state.rightDataTime}`
                }
                if(url !== ''){
                    this.$http.get(url).then(res => {
                        this.mapDatas = res.data.data;
                        this.addImgOnMap();

                    })
                }
            }
        },
        computed: {
            leftTime() {
                return this.$store.state.leftDataTime;
            },
            rightTime() {
                return this.$store.state.rightDataTime;
            }
        },
        watch: {
            leftTime: function(){
                this.loadMapImg('left');
            },
            rightTime:function (){
                this.loadMapImg('right');
            }
        },
    }
</script>

<style lang="less">
    .diff-map-container{
        width: 49.5%;
        height: 100%;
        float: left;
        background: #ffffff;
        z-index: 999999999;
    }
</style>