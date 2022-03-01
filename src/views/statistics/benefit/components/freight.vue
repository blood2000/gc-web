<template>
  <div class="freight">
    <div class="freight-bar">
      <div class="freight-title">运费统计（元）</div>
      <FreightMore :startDate="startDate" :endDate="endDate" />
    </div>
    <div ref="chart1" class="chart-wrapper" :style="{width: chartWidth + 'px'}"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { http_request } from "@/api";
import * as echarts from "echarts";
import FreightMore from "./freightMore.vue";

export default {
  props: {
    freightChart: {
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
    FreightMore,
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
    // this.initChart()
    // if (this.freightChart && this.freightChart.length > 0) {
    //   this.setChart()
    // }
    this.$nextTick(() => {
      this.initChart();
      if (this.transChart && this.transChart.length > 0) {
        this.setChart();
      }
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart1);
    },
    setChart() {
      const styleOptions = {
        label: {
          formatter: "{c}元",
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
        grid: {
          y: 50,
        },
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
          data: ["已收款", "待收款"],
        },
        series: [
          {
            data: [
              {
                value: this.freightChart[0].revenue,
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
                value: this.freightChart[0].notRevenue,
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
    freightChart() {
      if (this.freightChart && this.freightChart.length > 0) {
        this.setChart();
      }
    },
    chartWidth(val) {
      setTimeout(() => {
        this.chart.resize({
          width: val,
          height: 330,
        });
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.freight {
  // min-width: 826px;
  margin-top: 20px;
  height: 453px;
  background: #fff;
  padding: 25px 20px;
  //  box-shadow: 0 0 4px 0 rgba(0,0,0,.2);
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
    height: 330px;
  }
}
</style>
