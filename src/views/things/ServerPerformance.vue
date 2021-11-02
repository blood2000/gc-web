<template>
  <div class="s-container">
    <div class="s-container__chart ly-flex ly-flex-pack-justify">
      <h5 class="cpu ly-flex-v ly-flex-pack-center"><p>CPU</p><p>使用</p><p>情况</p></h5>
      <LineChart class="line-chart" ref="cpuRef" type="cpu" :time-data="timeData" :value-data="cpuData" />
    </div>
    <div class="s-container__chart ly-flex ly-flex-pack-justify">
      <h5 class="ran ly-flex-v ly-flex-pack-center"><p>内存</p><p>使用</p><p>情况</p></h5>
      <LineChart class="line-chart" ref="ranRef" type="ran" :time-data="timeData" :value-data="ranData" />
    </div>
    <div class="s-container__chart ly-flex ly-flex-pack-justify">
      <h5 class="net ly-flex-v ly-flex-pack-center"><p>网络</p><p>使用</p><p>情况</p></h5>
      <LineChart class="line-chart" ref="netRef" type="net" :time-data="timeData" :value-data="netData" />
    </div>
    <div class="s-container__chart ly-flex ly-flex-pack-justify">
      <h5 class="hard ly-flex-v ly-flex-pack-center"><p>硬盘</p><p>使用</p><p>情况</p></h5>
      <LineChart class="line-chart" ref="hardRef" type="hard" :time-data="timeData" :value-data="hardData" />
    </div>
  </div>
</template>

<script>
import LineChart from './components/lineChart.vue';
export default {
  components: {
    LineChart
  },
  props: {

  },
  data() {
    return {
      timeData: [],
      cpuData: [],
      ranData: [],
      netData: [],
      hardData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.timeData = [4, 8, 12, 16, 20, 24, 28, 31];
      this.cpuData = [15, 20, 20, 40, 32, 35, 25, 30];
      this.ranData = [15, 20, 20, 40, 32, 35, 25, 30];
      this.netData = [15, 20, 20, 40, 32, 35, 25, 30];
      this.hardData = [15, 20, 20, 40, 32, 35, 25, 30];
      setTimeout(() => {
        this.$refs.cpuRef.initChart();
        this.$refs.ranRef.initChart();
        this.$refs.netRef.initChart();
        this.$refs.hardRef.initChart();
      }, 0);
    },
    refreshChart() {
      this.$refs.cpuRef.refreshChart();
      this.$refs.ranRef.refreshChart();
      this.$refs.netRef.refreshChart();
      this.$refs.hardRef.refreshChart();
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  padding-bottom: 1rem;
  &__chart{
    height: 25%;
    >h5{
      font-size: 0.7rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 0.9rem;
      &.cpu{
        color: rgba(255, 107, 107, 0.7);
      }
      &.ran{
        color: rgba(149, 96, 247, 0.7);
      }
      &.net{
        color: rgba(40, 178, 148, 0.7);
      }
      &.hard{
        color: rgba(71, 142, 241, 0.7);
      }
    }
    >.line-chart{
      width: calc(100% - 2.3rem);
      height: 100%;
    }
  }
}
</style>