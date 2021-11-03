<template>
  <!-- 订单统计 -->
  <div class="s-container-chart" />
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  props: {
    timeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    valueData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 判断类型
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      // 构造数据
      let lineColor = '';
      let lineColorCenter = '';
      let lineColorEnd = '';
      let max;
      let unit;
      if (this.type === 'cpu') {
        lineColor = 'rgba(255, 74, 74, 0.9)';
        lineColorCenter = 'rgba(255, 74, 74, 0.7)';
        lineColorEnd = 'rgba(255, 74, 74, 0.03)';
        max = 40;
        unit = 'U';
      } else if (this.type === 'ran') {
        lineColor = 'rgba(124, 65, 235, 0.9)';
        lineColorCenter = 'rgba(124, 65, 235, 0.7)';
        lineColorEnd = 'rgba(124, 65, 235, 0.03)';
        max = 160;
        unit = 'G';
      } else if (this.type === 'net') {
        lineColor = 'rgba(40, 178, 148, 0.9)';
        lineColorCenter = 'rgba(40, 178, 148, 0.7)';
        lineColorEnd = 'rgba(40, 178, 148, 0.03)';
        max = 100;
        unit = 'M';
      } else if (this.type === 'hard') {
        lineColor = 'rgba(71, 142, 241, 0.9)';
        lineColorCenter = 'rgba(71, 142, 241, 0.7)';
        lineColorEnd = 'rgba(71, 142, 241, 0.03)';
        max = 1500;
        unit = 'G';
      }
      this.chart.setOption({
        legend: {
          show: false
        },
        grid: {
          left: '0%',
          right: '2%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisTick: {
            show: false // 隐藏x坐标轴刻度
          },
          data: this.timeData
        },
        yAxis: {
          type: 'value',
          minInterval: 1, // 只显示整数
          max: max,
          axisLine: {
            show: false
          },
          // y轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          // 网格样式
          splitLine: {
            show: false
          },
          axisTick: {
            show: false // 隐藏y坐标轴刻度
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#fff'
            }
          },
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff'
          },
          formatter: '{b}时：{c}' + unit
        },
        series: [{
          data: this.valueData,
          type: 'line',
          symbolSize: 0,
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: lineColor
              }
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: lineColor
                }, {
                  offset: 0.5, color: lineColorCenter
                }, {
                  offset: 0.9, color: lineColorEnd
                }, {
                  offset: 1, color: 'rgba(0, 0, 0, 0)'
                }]
              ),
            }
          }
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        tooltip: {
          padding: setfontSize(10),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(8)
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(8)
            }
          }
        },
        series: [{
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0
              }
            }
          }
        }]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container-chart{
  height: 100%;
}
</style>
