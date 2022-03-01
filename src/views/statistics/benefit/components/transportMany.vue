<template>
  <div class="transport" id="chart1">
    <div class="transport-bar">
      <div class="transport-title">运输统计（单）</div>
      <TransportMore :startDate="startDate" :endDate="endDate" />
    </div>
    <div ref="chart" class="chart-wrapper" :style="{width: chartWidth + 'px'}"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { http_request } from "@/api";
import * as echarts from "echarts";
import TransportMore from "./transportMore.vue";

export default {
  props: {
    transChart: {
      type: Array,
      default: [],
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    // chartWidth: {
    //   type: Number,
    //   default: 780,
    // },
  },

  components: {
    TransportMore,
  },
  computed: {
    ...mapGetters(["sidebar"]),
    chartWidth() {
      if (!this.sidebar.opened) {
        return 946;
      } else {
        return 786;
      }
    },
  },

  data() {
    return {
      chart: null,
      // chartWidth: 600,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      if (this.transChart && this.transChart.length > 0) {
        this.setChart();
      }
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    },
    setChart() {
      let loadCountAll = 0;
      let receiveCountAll = 0;
      let unloadCountAll = 0;
      let dateList = this.transChart.map((item) => {
        return item.date;
      });
      let loadCountList = this.transChart.map((item) => {
        loadCountAll = loadCountAll + item.loadCount;
        return item.loadCount;
      });
      let receiveCountList = this.transChart.map((item) => {
        receiveCountAll = receiveCountAll + item.receiveCount;
        return item.receiveCount;
      });
      let unloadCountList = this.transChart.map((item) => {
        unloadCountAll = unloadCountAll + item.unloadCount;
        return item.unloadCount;
      });
      this.option = {
        grid: {
          top: 90,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 20,
          left: 70,
          data: ["已接单", "已出车", "已回车"],
          formatter: (name) => {
            if (name === "已接单") {
              return `${name}${receiveCountAll}单`;
            } else if (name === "已出车") {
              return `${name}${loadCountAll}单`;
            } else if (name === "已回车") {
              return `${name}${unloadCountAll}单`;
            }
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dateList,
        },
        yAxis: {
          type: "value",
          name: "单/天",
          nameTextStyle: {
            color: "#3D4050",
            fontWeight: "bold",
            align: "right",
          },
        },
        series: [
          {
            name: "已接单",
            type: "line",
            smooth: true,
            data: receiveCountList,
            lineStyle: {
              color: "#4682FA",
            },
            itemStyle: {
              color: "#4682FA",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(70, 130, 250, 0.1)",
                },
                {
                  offset: 1,
                  color: "rgba(70, 130, 250, 0)",
                },
              ]),
            },
          },
          {
            name: "已出车",
            type: "line",
            smooth: true,
            data: loadCountList,
            lineStyle: {
              color: "#43B91E",
            },
            itemStyle: {
              color: "#43B91E",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(67, 185, 30, 0.08)",
                },
                {
                  offset: 1,
                  color: "rgba(67, 185, 30, 0)",
                },
              ]),
            },
          },
          {
            name: "已回车",
            type: "line",
            smooth: true,
            data: unloadCountList,
            lineStyle: {
              color: "#EF6969",
            },
            itemStyle: {
              color: "#EF6969",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(239, 105, 105, 0.1)",
                },
                {
                  offset: 1,
                  color: "rgba(239, 105, 105, 0)",
                },
              ]),
            },
          },
        ],
      };

      // this.chart.clear();
      this.chart.setOption(this.option);
    },
  },
  watch: {
    transChart() {
      if (this.transChart && this.transChart.length > 0) {
        this.setChart();
      }
    },
    chartWidth(val) {
      console.log("kjkj", val);

      setTimeout(() => {
        this.chart.resize({
          width: val,
          height: 400,
        });
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.transport {
  width: 100%;
  height: 465px;
  background: #fff;
  padding: 25px 20px;
  border: 1px solid #f9f9f9;
  border-radius: 6px;
  &-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-title {
    font-size: 20px;
    font-weight: bold;
    color: #3d4050;
  }
  .chart-wrapper {
    width: 100%;
    height: 400px;
  }
}
</style>
