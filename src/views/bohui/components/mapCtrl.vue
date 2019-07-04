<template>
  <div class="map-ctrl-container" v-show="showCtrl">
    <div class="ctrl-btn">
      <i class="iconfont icon-ditu ctrl-icon" @click="handleClickCtrl('showBase')"></i>
      <div class="mapselect" v-show="ctrlBtn.showBase">
        <div name="ditu" class="ditu" :class="basemap==='ditu'?'open':''" @click="changebase('ditu')">
          <img src="@/images/maplogo.png" alt>
          <span>地图</span>
        </div>
        <div name="rsimage" class="rsimage" :class="basemap==='rsimage'?'open':''" @click="changebase('rsimage')">
          <img src="@/images/imglogo.png" alt>
          <span>影像</span>
        </div>
        <div name="dems" class="dems" :class="basemap==='dems' ? 'open' : '' " @click="changebase('dems')">
          <img src="@/images/demlogo.png" alt>
          <span>地形</span>
        </div>
      </div>
    </div>
    <div class="ctrl-btn">
      <i class="iconfont icon-tuceng ctrl-icon" @click="handleClickCtrl('showTuceng')"></i>
      <div class="tuceng-select" v-show="ctrlBtn.showTuceng">
        <CheckboxGroup v-model="selectedTuceng" @on-change="onTucengChange">
          <p v-for="t in allTuceng" :key="t.value">
            <Checkbox :label="t.name" :value="t.value">
            </Checkbox>
          </p>
        </CheckboxGroup>
      </div>
    </div>
    <div class="ctrl-btn">
      <i class="iconfont icon-yanjing ctrl-icon" @click="handleClickCtrl('showActiveItem')"></i>
      <div
        class="active-select"
        v-show="ctrlBtn.showActiveItem"
      >
        <CheckboxGroup v-model="selectedActive">
          <p v-for="t in allActive" :key="t.value" :style="{color: t.color}">
            <Checkbox :label="t.name">
            </Checkbox>
          </p>
        </CheckboxGroup>
      </div>
    </div>
  </div>
</template>

<script>
import { activeObjList } from '../utils/colorUtil';

export default {
  name: 'mapCtrl',
  props: ['showCtrl', 'allTuceng', 'initSelectTuceng'],
  data () {
    return {
      basemap: 'ditu',
      ctrlBtn: {
        showBase: false,
        showTuceng: false,
        showActiveItem: false
      },
      selectedTuceng: [],
      allActive: [],
      selectedActive: []
    }
  },
  mounted () {
    this.allActive = activeObjList;
    this.selectedTuceng = this.initSelectTuceng
  },
  methods: {
    changebase (baseMap) {
      this.basemap = baseMap;
      this.ctrlBtn.showBase = false;
      this.$emit('changebase', baseMap)
    },
    handleClickCtrl (ctrlName) {
      this.ctrlBtn[ctrlName] = !this.ctrlBtn[ctrlName];
      Object.keys(this.ctrlBtn).forEach(key => {
        if (key !== ctrlName) {
          this.ctrlBtn[key] = false
        }
      })
    },
    onTucengChange (vals) {
      const values = []
      vals.forEach(v => {
        this.allTuceng.forEach(all => {
          if (all.name === v) {
            values.push(all.value)
          }
        })
      });
      this.$emit('changeCover', values)
    }
  }
}
</script>

<style lang="scss">
@import "//at.alicdn.com/t/font_1261603_6qz3ml78iae.css";
.map-ctrl-container{
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: 401;
  .ctrl-btn{
    background-color: rgba(0, 33, 53, 0.8);
    border: 1px solid #006ca8;
    color: #ffffff;
    cursor: pointer;
    .mapselect {
      position: absolute;
      width: auto;
      right: 33px;
      top: 0;
      display: flex;
      border: 1px solid #fff;
      background: rgba(0, 33, 53, 0.8);
      > div {
        width: 50px;
        height: 50px;
        position: relative;
        margin: 2px;
        overflow: hidden;
        cursor: pointer;
        img {
          height: 50px;
        }
        span {
          display: block;
          width: 50px;
          height: 50px;
          background: rgba(0, 33, 53, 0.2) !important;
          color: #fff;
          text-align: center;
          position: absolute;
          line-height: 50px;
          left: 0;
          top: 0;
        }
      }
      > div.open {
        border: 2px solid #006ca8;
      }
      > div:hover {
        span {
          background: rgba(0, 33, 53, 0.5) !important;
        }
      }
    }
    .tuceng-select {
      padding: 10px;
      position: absolute;
      left: -171px;
      top: 30px;
      background-color: #ffffff;
      color: #006ca8;
      .ivu-checkbox-group-item{
        .ivu-checkbox{
          margin-right: 3px;
        }
        >span{
          font-size: 16px;
        }
      }
    }
    .active-select{
      padding: 10px;
      position: absolute;
      left: -171px;
      top: 66px;
      background-color: #ffffff;
      color: #006ca8;
      .ivu-checkbox-group-item{
        .ivu-checkbox{
          margin-right: 3px;
        }
        >span{
          font-size: 16px;
        }
      }
    }
    &:hover{
      background-color: #ffffff;
      color: rgba(0, 33, 53, 0.8) ;
    }
    .ctrl-icon{
      font-size: 20px;
      padding: 0 5px;
    }
  }
}
</style>
