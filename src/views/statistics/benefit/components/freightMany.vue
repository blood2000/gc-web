<template>
  <div class="freight">
    <div class="freight-bar">
      <div class="freight-title">运费统计（元）</div>
      <FreightMore :startDate="startDate" :endDate="endDate" />
    </div>
    <div ref="chart1" class="chart-wrapper" :style="{width: chartWidth + 'px'}"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { http_request } from '@/api'
import * as echarts from 'echarts'
import FreightMore from './freightMore.vue'

export default {
  props: {
    freightChart: {
      type: Array,
      default: []
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    
  },
  components: {
    FreightMore
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    chartWidth() {
      if (!this.sidebar.opened) {
        return 946;
      } else {
        return 786;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      if (this.transChart && this.transChart.length > 0) {
        this.setChart();
      }
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart1)
    },
    setChart() {
      let notRevenueAll = 0
      let revenueAll = 0
      let dateList = this.freightChart.map((item) => {
        return item.date
      })
      let notRevenueList = this.freightChart.map((item) => {
        notRevenueAll = notRevenueAll + item.notRevenue
        return item.notRevenue
      })
      let revenueList = this.freightChart.map((item) => {
        revenueAll = revenueAll + item.revenue
        return item.revenue
      })
      this.option = {
        grid: {
          top: 90
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 20,
          left: 70,
          data: ['待收款', '已收款'],
          formatter: (name) => {
            if (name === '待收款') {
              return `${name}${notRevenueAll}元`
            } else if (name === '已收款') {
              return `${name}${revenueAll}元`
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateList
        },
        yAxis: {
          type: 'value',
          name: '元/天',
          nameTextStyle: {
            color: '#3D4050',
            fontWeight: 'bold',
            align: 'right'
          }
        },
        series: [
          {
            name: '待收款',
            type: 'line',
            smooth: true,
            data: notRevenueList,
            lineStyle: {
              color: '#4682FA'
            },
            itemStyle: {
              color: '#4682FA'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(70, 130, 250, 0.1)'
                },
                {
                  offset: 1,
                  color: 'rgba(70, 130, 250, 0)'
                }
              ])
            }
          },
          {
            name: '已收款',
            type: 'line',
            smooth: true,
            data: revenueList,
            lineStyle: {
              color: '#43B91E'
            },
            itemStyle: {
              color: '#43B91E'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(67, 185, 30, 0.08)'
                },
                {
                  offset: 1,
                  color: 'rgba(67, 185, 30, 0)'
                }
              ])
            }
          }
        ]
      }

      this.chart.clear()
      this.chart.setOption(this.option)
    }
  },
  watch: {
    freightChart() {
      if (this.freightChart && this.freightChart.length > 0) {
        this.setChart()
      }
    },
    chartWidth(val) {
      setTimeout(() => {
        this.chart.resize({
          width: val,
          height: 380,
        });
      }, 100);
    },
  }
}
</script>

<style lang="scss" scoped>
.freight {
  // min-width: 826px;
  height: 465px;
  background: #fff;
  padding: 25px 20px;
  &-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-title {
    font-size: 20px;
    font-weight: bold;
    color: #3d4050;
  }
  .chart-wrapper {
    width: 100%;
    height: 380px;
  }
}
</style>
