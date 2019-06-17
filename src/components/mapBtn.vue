<template>
    <div>
        <div class="rightbtn">
            <div class="basemapchange" style="top: 100px" v-if="sCover">
                <div class="iconfont icon-tuceng" style="font-size: 20px" @click=changeSelectorState></div>

                <div  v-if="showLayerSelector" class="select-control-group">
                    <mu-flex class="select-control-row" :key="index" v-for="(cover, index) in allCoverage">
                        <mu-checkbox
                                :value="cover.value"
                                v-model="coverd"
                                :label="cover.name"
                                color="#ffffff"
                                @change=handleCoverChange
                        ></mu-checkbox>
                    </mu-flex>
                </div>
            </div>

            <div class="basemapchange" @click="showbasemap" v-if="!!sBase">
                <div class="mapimg">
                    <!-- <img src="../image/map-b.png" alt v-if="this.$store.state.terminal == 'phone'"> -->
                    <!-- <img src="../image/map.png" alt> -->
                    <mu-icon  value="language"></mu-icon>
                </div>
                <div class="mapselect" v-if="baseboolean">
                    <div
                            name="ditu"
                            class="ditu"
                            :class="basemap=='ditu'?'open':''"
                            @click="changebase('ditu')"
                    >
                        <img src="../image/maplogo.png" alt>
                        <span>地图</span>
                    </div>
                    <div
                            name="rsimage"
                            class="rsimage"
                            :class="basemap=='rsimage'?'open':''"
                            @click="changebase('rsimage')"
                    >
                        <img src="../image/imglogo.png" alt>
                        <span>影像</span>
                    </div>
                    <div
                            name="dems"
                            class="dems"
                            :class="basemap=='dems'?'open':''"
                            @click="changebase('dems')"
                    >
                        <img src="../image/demlogo.png" alt>
                        <span>地形</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mapBtn',
    data(){
        return{
            showLayerSelector: false,
            baseboolean: false,
            basemap: 'ditu',
            //coverage: [ {name:'卫星',value: 'satellite'},{name:'禁止开发区红线',value: 'jinzhi'},{name:'科学开发区红线', value: 'kexue'}],
            coverd: ['satellite','jinzhi','kexue'],
            sCover:true,
            sBase: true
        }
    },
    props: ['allCoverage', 'startCoverd' ,'showCover', 'showBase'],
    mounted(){
        this.coverd = this.startCoverd;
        if(this.allCoverage.length === 0){
            this.sCover = false
        }
        if(this.showCover === false){
            this.sCover = false
        }
        if(this.showBase === false){
            this.sBase = false
        }
        document.onclick = (e) =>{
            if(e.target.classList.length > 1 && e.target.classList[1] !== "icon-tuceng"  && e.target.classList[4] !== 'select-control-row'){
                this.showLayerSelector = false
            }
            if(e.target.classList.length > 1 && e.target.classList[0] !== "mu-icon" && e.target.classList[1] !== "material-icons"){
                this.baseboolean = false
            }
        }
    },
    methods:{
        changebase(mapVal){
            this.basemap = mapVal;
            this.$emit("changeBase", this.basemap);
        },
        changeSelectorState(){
            this.showLayerSelector = !this.showLayerSelector
        },
        showbasemap(){
            this.baseboolean = !this.baseboolean
        },
        handleCoverChange(val){
            this.$emit("changeCover", val)
        }
    }
}
</script>

<style lang="less">
    .rightbtn{
        .mu-select-content{
            font-size: 12px;
            color: #ffffff !important;
        };
        .select-control-group{
            width: 200px;
            position: absolute;
            left: -210px;
            background-color: #013857;
            border: 10px;
            top:0px;
        }
    }
    .mu-checkbox-label{
        color: #ffffff !important;
    }
    .mu-option.is-selected .mu-item{
        color: #013e64 !important;
    }
    .mu-option-list{
        z-index: 20141254 !important;
        max-height: 300px !important;
        min-width: 200px !important;
        top: 244px !important;
        left: 1258px !important;
        display: block !important;
    }
</style>