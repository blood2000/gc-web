<template>
  <div class="s-container">
    <div ref="chart" class="s-container__chart" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';
import { http_request } from "@/api";
export default {
  props: {

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
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons');
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      const labelData = ['重型半挂牵引车','重型半挂牵引车','重型半挂牵引车','重型半挂牵引车','重型半挂牵引车'];
      const valueData = [30, 50, 100, 50, 100];
      this.chart.setOption({
        legend: {
          show: false
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '2%',
          top: '30%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#FFE6F4',
              fontFamily: 'PingFang SC'
            }
            // rotate: '30' // 字体倾斜角度
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#633C8A'
            }
          },
          data: labelData
        },
        yAxis: {
          name: '数量(辆)',
          nameTextStyle: {
            color: '#FFE6F4',
            paddingLeft: '2%',
            fontFamily: 'PingFang SC'
          },
          type: 'value',
          minInterval: 1, // 只显示整数
          axisLine: {
            show: true,
            lineStyle: {
              color: '#633C8A'
            }
          },
          // y轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#FFE6F4',
              fontFamily: 'PingFang SC'
            }
          },
          // 网格样式
          splitLine: {
            show: false
          },
          axisTick: {
            show: false// 隐藏y坐标轴刻度
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang SC'
          },
          formatter: `{b0}：{c0}`
        },
        series: [{
          type: 'bar',
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(55, 58, 216, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(173, 69, 255, 0.8)'
              }, {
                offset: 0.8,
                color: 'rgba(173, 69, 255, 0.6)'
              }, {
                offset: 1,
                color: 'rgba(173, 69, 255, 0)'
              }])
            }
          },
          data: valueData
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        tooltip: {
          padding: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(11)
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            fontSize: setfontSize(11)
          },
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(11)
            }
          }
        },
        series: [{
          barWidth: setfontSize(6)
        }, {
          barWidth: setfontSize(6)
        }]
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  &__chart{
    height: 100%;
  }
}
</style>