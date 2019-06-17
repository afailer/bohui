<script>
    import Map from "../../../components/map"
    import tempData from "../../../components/tempData"
    //import yuzhong from "../../../components/tempData/yuzhong"
    export default {
        name: 'activeMap',
        extends: Map,
        data(){
            return {
                allCoverage:[{name:'所有',value: 'all'},{name:'卫星',value: 'satellite'},{name:'禁止开发区红线',value: 'jinzhi'},{name:'科学开发区红线', value: 'kexue'}],
                startCoverd:['all','satellite','jinzhi','kexue']
            }
        },
        methods:{
            loadAllMapInfoByAreaCode(){
                const currentArea = this.$store.state.areaCode;
                const { areaDatas } = tempData;
                const targetDatas = areaDatas.get(currentArea);
                const { allData, jinzhi, kexue, otherRed, geoServer } = targetDatas;
                // 禁止（绿色），科学（红色）
                this.loadTargetPlace('all',allData, 'transparent', true);
                this.loadTargetPlace('jinzhi',jinzhi, '#00ff00');
                this.loadTargetPlace('kexue',kexue, '#ff0000');
                this.loadGeoData('satellite',geoServer)
            },
            onDbClick(e, polygonjson){
                const geoJson = {
                    "type": "FeatureCollection",
                    "name": "jinzhikaifa",
                    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
                    "features": []
                };
                const jsonStr = JSON.stringify(geoJson);
                const geoObj = JSON.parse(jsonStr)
                geoObj.features.push(e.target.feature)
                this.$bus.$emit("putGeoToChildrenMap", geoObj)
            },
            onClick(e, polygonjson){

            }
        }
    }
</script>