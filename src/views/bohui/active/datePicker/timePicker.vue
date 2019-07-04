<template>
    <div  class="half-time-side">
        <Button type="primary" @click="showTimeSelector" color="primary" style="width: 100%">{{currentTime}}</Button>
        <ul v-show="showTime">
            <li v-for="(time,index) in times" :key="time.id">
                <p class="year" @click=handleYearClick(index,time.show)>{{time.years}}</p>
                <ul v-show="time.show">
                    <li v-for="date in time.list" :key="date.id">
                        <p class="time" @click="handleClickTime(date)">{{date.dataTime}}</p>
                    </li>
                </ul>
            </li>

        </ul>
    </div>
</template>

<script>
export default {
  name: 'timePicker',
  props: ['direction'],
  data () {
    return {
      showTime: false,
      currentTime: '',
      times: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const url = 'http://39.104.185.135:8084/humanAction/times?areaCode=620121&type=1';
      this.$http.get(url).then(res => {
        this.times = res.data.data;
        if (this.direction === 'right') {
          this.handleClickTime(this.times[0].list[this.times[0].list.length -1])
        } else {
          this.handleClickTime(this.times[this.times.length -1].list[0])
        }
      })
    },
    handleYearClick (index, show) {
      this.$set(this.times[index], `show`, !show)
    },
    handleClickTime (date) {
      this.currentTime = date.dataTime;
      this.showTime = false;
      if (this.direction === 'left') {
        this.$store.commit('changeLeftDataTime', this.currentTime)
      } else {
        this.$store.commit('changeRightDataTime', this.currentTime)
      }
    },
    showTimeSelector () {
      this.showTime = !this.showTime
    }
  }
}
</script>

<style lang="scss">
    .half-time-side{
        width: 50%;
        height: 100%;
        float: left;
        position: relative;
        .year{
            background-color: #0068b0;
            text-align: center;
            line-height: 25px;
            color:#ffffff;
            cursor: pointer;
        }
        .time{
            background-color: #59ace2;
            padding-left: 20px;
            text-align: center;
            z-index: 99999999999;
            cursor: pointer;
            &:hover{
                background-color: #0068b0;
            }
        }
    }
</style>
