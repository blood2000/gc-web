<template>
  <div class="s-container s-map-container-relative">
    <div ref="map" class="map-box" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {

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

    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      
    },
    setFontOption() {

    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  width: 50%;
  height: 50%;
  >.map-box{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4); // 辅助线
  }
}
</style>