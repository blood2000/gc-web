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
      chart: null,
      dataList: []
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
      this.dataList = [{
        value: 400,
        name: "告警数据",
        percentage: "20%"
      }, {
        value: 400,
        name: "定位数据",
        percentage: "20%"
      }, {
        value: 400,
        name: "状态数据",
        percentage: "20%"
      }, {
        value: 400,
        name: "指令数据",
        percentage: "20%"
      }, {
        value: 400,
        name: "轨迹数据",
        percentage: "20%"
      }];
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
      const _this = this;
      this.chart.setOption({
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang SC'
          },
          formatter: function(obj) {
            return `${obj.data.name}：${obj.data.percentage}`;
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['35%', '55%'],
            center: ['50%', '50%'],
            data: _this.dataList,
            // 标示线
            label: {
              show: true,
              color: '#F2E9FA',
              alignTo: 'edge',
              formatter: function(obj) {
                return ` ${obj.data.name}\n {percentage|数量：${obj.data.value}  占比：${obj.data.percentage}}`;
              },
              rich: {
                percentage: {
                  color: '#F2E9FA'
                }
              }
            },
            labelLine: {
              show: true,
              maxSurfaceAngle: 80,
              length: 10,
              length2: 0
            },
            labelLayout: function (params) {
              const isLeft = params.labelRect.x < _this.chart.getWidth() / 2;
              const points = params.labelLinePoints;
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points
              };
            },
            itemStyle: {
              normal: {
                // 设置饼图的颜色
                color: function(params) {
                  // 自定义颜色
                  const colorList = [
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(137, 89, 227, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(40, 178, 148, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(40, 178, 148, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(232, 75, 75, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(232, 75, 75, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(203, 142, 46, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(203, 142, 46, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(71, 142, 241, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(71, 142, 241, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(137, 89, 227, 1)'
                    }])
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    },
    setFontOption() {
      this.chart.setOption({
        tooltip: {
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        series: [{
          label: {
            fontSize: setfontSize(11),
            minMargin: setfontSize(5),
            edgeDistance: setfontSize(8),
            lineHeight: setfontSize(20),
            rich: {
              percentage: {
                fontSize: setfontSize(11)
              }
            }
          }
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