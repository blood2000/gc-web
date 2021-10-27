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

    },
    initChart() {
      this.chart = echarts.init(this.$refs.pie, 'macarons');
      this.setOption();
      this.setFontOption();
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
  height: 100%;
  padding-top: 1rem;
  &__chart{
    height: 100%;
  }
}
</style>