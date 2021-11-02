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
      // 总数572
      this.dataList = [{
        value: 162,
        name: "行车记录仪T1普货版",
        percentage: "28.3%"
      }, {
        value: 203,
        name: "超好运小黑盒A2固线款",
        percentage: "35.5%"
      }, {
        value: 207,
        name: "超好运小黑盒A1便携款",
        percentage: "36.2%"
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
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
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
              show: true
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
                      color: 'rgba(40, 178, 148, 1)'
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
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(40, 178, 148, 1)'
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
          },
          labelLine: {
            maxSurfaceAngle: setfontSize(80),
            length: setfontSize(20),
            length2: 0
          }
        }]
      });
    },
    /** 
     * 线性渐变起止方向的计算方法
     * @param {*} startArc 开始角度
     * @param {*} endArc 结束角度
     * @returns 四个坐标 x,y,x2,y2 
     */
    getCoordinates(startArc, endArc) {
      const posi = [Math.sin(startArc),-Math.cos(startArc),Math.sin(endArc),-Math.cos(endArc)];
      const dx = posi[2] - posi[0];
      const dy = posi[3] - posi[1];
      return this.getLocation(dx, dy);
    },
    getLocation(dx, dy) {
      const tanV = dx / dy;
      const directSign = Math.abs(tanV) < 1;
      const t = directSign ? tanV : 1 / tanV;
      const sign1 = t > 0 ? 1 : -1;
      const sign2 = dx > 0 ? 1 : -1;
      const sign = directSign ? sign1 * sign2 : sign2;
      const group1 = [ 0.5 - sign * t / 2, 0.5 + sign * t / 2];
      const group2 = sign > 0 ? [0, 1] : [1, 0];
      const group = [...group1, ...group2];
      const keys = directSign ? ['x', 'x2', 'y', 'y2'] : ['y', 'y2', 'x', 'x2' ];
      let res = {};
      keys.forEach((k, idx) => {
        res[k] = group[idx];
      })
      return res;
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