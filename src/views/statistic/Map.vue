<template>
  <div class="s-container s-map-container-relative">
    <div ref="map" class="map-box" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import mapJson from '@/assets/json/china.json';
import { setfontSize } from '@/utils/fontSize';
import { http_request } from "@/api";
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      chart: null,
      heatmapData: []
    };
  },
  mounted() {
    const timer = setInterval(() => {
      if (this.$refs.map.offsetHeight > 0) {
        clearInterval(timer);
        this.initChart();
      }
    }, 300);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 获取热力图数据
    getData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "thermodynamicDiagramAlarm"
      };
      http_request(obj).then((res) => {
        if (res.data && res.data.length > 0) {
          this.heatmapData = res.data.map(el => {
            const arr = [];
            arr.push(el.lng, el.lat, el.number);
            return arr;
          });
          this.$nextTick(() => {
            this.setOption();
          });
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.map, null, {
        renderer: 'svg'
      });
      echarts.registerMap('china', mapJson);
      this.setOption();
      this.setFontOption();
      this.getData();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      const _this = this;
      this.chart.setOption({
        geo: [{
          map: 'china',
          zoom: 1.05,
          z: 9,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0.65)',
              areaColor: 'rgba(114, 35, 98, 0.65)'
            },
            emphasis: {
              areaColor: 'rgba(114, 35, 98, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },
        // 开始叠加
        {
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48.3%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },{
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48.6%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },{
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48.9%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },{
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '49.2%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },{
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '49.5%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        },{
          map: 'china',
          zoom: 1.05,
          z: 8,
          aspectScale: 0.8,
          layoutCenter: ['48%', '49.8%'],
          layoutSize: '81%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0)',
              areaColor: 'rgba(132, 45, 120, 1)',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 6,
              shadowOffsetY: 6
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ]
        }],
        series: [{
          name: 'scatter',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: _this.heatmapData,
          // symbolSize: function (val) {
          //   return val[2] / 200;
          // },
          itemStyle: {
            color: function (val) {
              const { data } = val;
              if (data[2] <= 100) {
                return 'rgba(255, 0, 138, 0.4)'
              }
              if (data[2] > 100 && data[2] <= 500) {
                return 'rgba(255, 0, 138, 0.6)'
              }
              if (data[2] > 500 && data[2] <= 1000) {
                return 'rgba(255, 0, 138, 0.8)'
              }
              if (data[2] > 1000) {
                return 'rgba(255, 0, 138, 1)'
              }
            }
          },
          encode: {
            value: 2
          },
          z: 10
        },
        // {
        //   name: 'effectScatter',
        //   type: 'effectScatter',
        //   coordinateSystem: 'geo',
        //   // data: _this.heatmapData
        //   //   .sort(function (a, b) {
        //   //     return b[2] - a[2];
        //   //   })
        //   //   .slice(0, 6),
        //   data: _this.heatmapData
        //     .filter(el => {
        //       return el[2] > 5000;
        //     }),
        //   encode: {
        //     value: 2
        //   },
        //   showEffectOn: 'render',
        //   rippleEffect: {
        //     brushType: 'stroke'
        //   },
        //   itemStyle: {
        //     color: '#ffc001',
        //     shadowColor: 'rgba(130, 7, 109, 0.5)'
        //   },
        //   emphasis: {
        //     scale: true
        //   },
        //   zlevel: 1
        // }
        ]
      });
    },
    setFontOption() {
      this.chart.setOption({
        geo: [{
          itemStyle: {
            normal: {
              borderWidth: setfontSize(1)
            }
          }
        }],
        series: [{
          symbolSize: function (val) {
            return setfontSize(6);
          }
        },{
          symbolSize: function (val) {
            return setfontSize(15) + val[2]/1000;
          },
          itemStyle: {
            shadowBlur: setfontSize(10)
          }
        }]
      });
    },
    // 处理实时数据
    setData(data) {
      this.createTooltip(data.alarmLevel, data.lng, data.lat);
    },
    createTooltip(type, lng, lat) {
      if (!lng || !lat) return;
      // 经纬度转换成屏幕xy坐标
      const pixel = this.chart.convertToPixel('geo', [lng, lat]); // return Array
      if (!pixel || !pixel.length || pixel.length < 2) return;
      // createDom-box
      const wrap = document.createElement('div');
      wrap.setAttribute('class', 's-echart-map-warning-tooltip-wrap');
      document.getElementsByClassName('s-map-container-relative')[0].appendChild(wrap);
      // createDom-circle
      const circle = document.createElement('div');
      wrap.appendChild(circle);
      // 动画-圆点闪烁1s
      circle.setAttribute('class', 's-echart-map-warning-tooltip-circle alarm' + type);
      // createDom-line
      const line = document.createElement('div');
      wrap.appendChild(line);
      // 动画-线条出现1s
      line.setAttribute('class', 's-echart-map-warning-tooltip-line alarm' + type);
      // 设置光束位置
      wrap.style.left = pixel[0] + 'px';
      wrap.style.top = pixel[1] + 'px';
      // 动画-线出现
      setTimeout(() => {
        line.style.height = '4.4rem';
        line.style.opacity = 0.9;
      }, 1 * 1000);
      // 移除dom
      setTimeout(() => {
        wrap.classList.add('hide');
      }, 1.8 * 1000);
      // 移除dom
      setTimeout(() => {
        wrap.remove();
      }, 2.4 * 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  width: 100%;
  height: calc(100% - 16.8% - 5.2rem);
  position: relative;
  >.map-box{
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.1); // 辅助线
  }
}
</style>

<style lang="scss">
.s-echart-map-warning-tooltip-wrap{
  position: absolute;
  opacity: 1;
  &.hide{
    opacity: 0;
    transition: opacity 0.6s;
  }
  .s-echart-map-warning-tooltip-circle{
    position: absolute;
    top: -0.9rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    animation: s-echart-map-warning-tooltip-circle-flashing 1s;
    animation-iteration-count: 1;
    width: 2rem;
    height: 1.8rem;
    z-index: 2;
    &.alarm1{
      background: url('~@/assets/images/statistic/gs_c_1.png') no-repeat;
      background-size: 100% 100%;
    }
    &.alarm2{
      background: url('~@/assets/images/statistic/gs_c_2.png') no-repeat;
      background-size: 100% 100%;
    }
    &.alarm3{
      background: url('~@/assets/images/statistic/gs_c_3.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  @keyframes s-echart-map-warning-tooltip-circle-flashing {
    0% { opacity: 0.2; }
    30% { opacity: 1; }
    63% { opacity: 0.2; }
    100% { opacity: 1; }
  }
  .s-echart-map-warning-tooltip-line{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0.2rem;
    height: 0;
    opacity: 0;
    transition: all 0.8s;
    z-index: 1;
    &.alarm1{
      background: url('~@/assets/images/statistic/gs_l_1.png') no-repeat;
    }
    &.alarm2{
      background: url('~@/assets/images/statistic/gs_l_2.png') no-repeat;
    }
    &.alarm3{
      transform: translateX(-20%);
      background: url('~@/assets/images/statistic/gs_l_3.png') no-repeat;
    }
  }
}
</style>