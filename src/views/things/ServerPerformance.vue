<template>
  <div class="s-container">
    <LineChart class="s-container__chart" ref="cpuRef" type="cpu" :time-data="timeData" :value-data="cpuData" />
    <LineChart class="s-container__chart" ref="ranRef" type="ran" :time-data="timeData" :value-data="ranData" />
    <LineChart class="s-container__chart" ref="netRef" type="net" :time-data="timeData" :value-data="netData" />
    <LineChart class="s-container__chart" ref="hardRef" type="hard" :time-data="timeData" :value-data="hardData" />
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
  }
}
</style>