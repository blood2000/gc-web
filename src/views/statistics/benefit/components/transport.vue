<template>
  <div class="transport">
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
    
  },
  components: {
    TransportMore,
  },
  data() {
    return {
      chart: null,
    };
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
      const styleOptions = {
        label: {
          formatter: "{c}单",
          color: "#3D4050",
          fontSize: 20,
          fontWeight: "bold",
        },
        itemStyle: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
        },
      };

      this.option = {
        xAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: ["#ebebeb"],
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "category",
          data: ["已回车", "已出车", "已接单"],
        },
        series: [
          {
            data: [
              {
                value: this.transChart[0].unloadCount,
                label: styleOptions.label,
                itemStyle: {
                  color: {
                    ...styleOptions.itemStyle,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#EF8C8C",
                      },
                      {
                        offset: 1,
                        color: "#EF6969",
                      },
                    ],
                  },
                },
              },
              {
                value: this.transChart[0].loadCount,
                label: styleOptions.label,
                itemStyle: {
                  color: {
                    ...styleOptions.itemStyle,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#75DB56",
                      },
                      {
                        offset: 1,
                        color: "#43B91E",
                      },
                    ],
                  },
                },
              },
              {
                value: this.transChart[0].receiveCount,
                label: styleOptions.label,
                itemStyle: {
                  color: {
                    ...styleOptions.itemStyle,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#6290ED",
                      },
                      {
                        offset: 1,
                        color: "#2069FA",
                      },
                    ],
                  },
                },
              },
            ],
            type: "bar",
            showBackground: true,
            barWidth: 24,
            backgroundStyle: {
              color: "#F7F7F7",
            },
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              borderRadius: [0, 12, 12, 0],
            },
          },
        ],
      };

      this.chart.clear();
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
      // this.chart.resize({
      //   width: 0
      // });
      setTimeout(() => {
        this.chart.resize({
          width: val,
          height: 380,
        });
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.transport {
  // min-width: 826px;
  height: 465px;
  background: #fff;
  padding: 25px 20px;
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
    height: 380px;
  }
}
</style>
