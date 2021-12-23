<template>
  <div class="transport">
    <div class="transport-bar">
      <div class="transport-title">运输统计（单）</div>
      <el-button type="text">查看更多</el-button>
    </div>
    <div ref="chart" class="chart-wrapper"></div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import * as echarts from 'echarts'

export default {
  props: {
    transChart: {
      type: Array,
      default: []
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons', {
        width: 900,
        height: 300
      })
    },
    setChart() {
      this.option = {
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['#ebebeb'],
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['已回车', '已出车', '已接单']
        },
        series: [
          {
            data: [
              {
                value: this.transChart[0].unloadCount,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#EF8C8C'
                      },
                      {
                        offset: 1,
                        color: '#EF6969'
                      }
                    ]
                  }
                }
              },
              {
                value: this.transChart[0].loadCount,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#75DB56'
                      },
                      {
                        offset: 1,
                        color: '#43B91E'
                      }
                    ]
                  }
                }
              },
              {
                value: this.transChart[0].receiveCount,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#6290ED'
                      },
                      {
                        offset: 1,
                        color: '#2069FA'
                      }
                    ]
                  }
                }
              }
            ],
            type: 'bar',
            showBackground: true,
            barWidth: 24,
            backgroundStyle: {
              color: '#F7F7F7'
            },
            label: {
              show: true,
              position: 'right'
            }
          }
        ]
      }

      this.chart.setOption(this.option)
    }
  },
  watch: {
    transChart() {
      console.log('???', this.transChart)
      this.setChart()
    }
  }
}
</script>

<style lang="scss" scoped>
.transport {
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
    width: 900px;
    height: 250px;
  }
}
</style>
