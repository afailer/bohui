<template>
  <Table
    border
    stripe
    :columns="tableTitles"
    :data="tableData"
    :align="'center'"
    @on-row-click="handleRowClick"
    className = 'tableClass'
  ></Table>
</template>

<script>
import { getRedlineData } from '../utils/bohuiApi';

export default {
  name: '',
  data () {
    return {
      tableTitles: [
        { title: '  ', key: 'lineName', align: 'center' },
        { title: '红线面积', key: 'area', align: 'center' },
        { title: '占全县国土比例', key: 'rate', align: 'center' }
      ],
      tableData: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      getRedlineData(this.$store.state.areaCode, this.$store.state.dataTime).then(res => {
        this.$bus.$emit('resetPieData', res.data.data);
        res.data.data.forEach(d => {
          if (d.type === 1 || d.type === 3) {
            const item = {
              lineName: d.name,
              id: d.id
            };
            d.redlineDataList.forEach(rd => {
              if (rd.type === 2 || d.type === 3) {
                item.area = rd.area + rd.areaUnit;
                item.rate = rd.rate + '%'
                item.align = 'center'
              }
            });
            this.tableData.push(item)
          }
        });
      })
    },
    handleRowClick (e) {
      this.$bus.$emit('resetPieChart', e.id)
      this.$bus.$emit('resetBarChart', e.id)
    }
  }
}
</script>

<style lang="scss">
.ivu-table-cell{
  text-align: center !important;
}
  .tableClass{
    background-color: red;
  }
</style>
