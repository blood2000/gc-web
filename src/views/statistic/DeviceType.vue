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
      const _this = this;
      const pieData = [{
        value: 40, 
        name: '超好运小黑盒A1便携款',
        percentage: 20
      },{
        value: 40, 
        name: '超好运小黑盒A2固线款',
        percentage: 20
      },{
        value: 120, 
        name: '行车记录仪T1基础款',
        percentage: 60
      }];
      this.chart.setOption({
        legend: {
          show: true,
          orient: 'vertical',
          itemStyle: {
            color: '#FCF8FF'
          }
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
            return `${obj.data.name}：${obj.data.percentage}%`;
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['48%', '70%'],
            center: ['50%', '48%'],
            right: '30%',
            data: pieData,
            // 标示线
            label: {
              show: true,
              color: '#CDEDFF',
              alignTo: 'edge',
              formatter: function(obj) {
                console.log(obj.data)
                // '{name|{b}}\n{time|数量：{c}}  {percentage| 占比：{c}}'
                return `${obj.data.name}\n数量：${obj.data.value}  占比：${obj.data.percentage}%`;
              },
              rich: {
                time: {
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
                      color: 'rgba(218, 35, 73, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(171, 58, 182, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(242, 58, 161, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(55, 58, 216, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(55, 58, 216, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(86, 58, 207, 1)'
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
        legend: {
          itemWidth: setfontSize(8),
          itemHeight: setfontSize(2),
          itemGap: setfontSize(16),
          right: setfontSize(10),
          textStyle: {
            fontSize: setfontSize(10)
          }
        },
        tooltip: {
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        series: [{
          label: {
            fontSize: setfontSize(11),
            minMargin: setfontSize(5),
            edgeDistance: setfontSize(10),
            lineHeight: setfontSize(26),
            rich: {
              time: {
                fontSize: setfontSize(11),
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
  padding-top: 1rem;
  &__chart{
    height: 100%;
  }
}
</style>