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
        this.heatmapData = res.data || [];
        this.setOption();
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
        geo: {
          map: 'china',
          zoom: 1.05,
          z: 2,
          aspectScale: 0.8,
          // layoutCenter: ['49%', '48%'],
          // layoutSize: '90%',
          top: '14%',
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
        series: [{
          type: 'map',
          z: 0,
          map: 'china',
          zoom: 1.05,
          aspectScale: 0.8,
          // layoutCenter: ['49%', '48.1%'],
          // layoutSize: '90%',
          top: '14%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(172, 90, 155, 0.65)',
              shadowColor: 'rgba(172, 90, 155, 0.65)',
              areaColor: 'rgba(114, 35, 98, 0)'
            }
          }
        },{
          name: 'AQI',
          type: 'heatmap', //热力图属性
          coordinateSystem: 'geo',
          pointSize:'20', // 每个点的大小，在地理坐标系(coordinateSystem: 'geo')上有效。
          blurSize:'20', // 每个点模糊的大小，在地理坐标系(coordinateSystem: 'geo')上有效。
          minOpacity:'1', // 最小的透明度，在地理坐标系(coordinateSystem: 'geo')上有效。
          maxOpacity:'1', // 最大的透明度，在地理坐标系(coordinateSystem: 'geo')上有效。
          data: _this.heatmapData
        }]
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
        },
        series: [{
          itemStyle: {
            normal: {
              borderWidth: setfontSize(1),
              shadowBlur: setfontSize(30)
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
  width: 100%;
  height: calc(100% - 16.8% - 5.2rem);
  >.map-box{
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.1); // 辅助线
  }
}
</style>