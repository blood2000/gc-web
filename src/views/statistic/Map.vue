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
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },

        visualMap: {
          type: "piecewise",
          min: 0,
          max: 100,
          calculable: true,
          realtime: false,
          splitNumber: 10,
          inRange: {
            color: ["#005a88", "#04a4f6", "#00943e", "#fdf40f", "#cf2d14"],
            opacity: [0.4, 0.4] // 透明度
          },
          right: "0",
          bottom: "0",
          textStyle: {
            color: "#fff"
          },
          show: false // 不显示图例
        },
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
          }
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
          }
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
          }
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
          }
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
          }
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
              areaColor: 'rgba(132, 45, 120, 1)'
            },
            emphasis: {
              areaColor: 'rgba(132, 45, 120, 1)' // 鼠标移入高亮显颜色
            }
          }
        }],
        series: [
        // {
        //   name: "heatmap",
        //   type: "heatmap",
        //   data: _this.heatmapData,
        //   coordinateSystem: "geo",
        //   progressive: 1000,
        //   animation: false,
        //   z: 10
        // }
        ]
      });
    },
    setFontOption() {
      this.chart.setOption({
        geo: {
          itemStyle: {
            normal: {
              borderWidth: setfontSize(1)
            }
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  width: 100%;
  height: calc(100% - 16.8% - 5.2rem);
  >.map-box{
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.1); // 辅助线
  }
}
</style>