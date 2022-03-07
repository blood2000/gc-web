<template>
  <div class="list">
    <div class="list-left">
      <div class="list-left__bar">
        <div class="list-left__title">磅单趋势图</div>
        <el-button-group>
          <el-button
            @click="onClickDay(0)"
            :type="dayRadio === 0 ? '' : 'info'"
            plain
            size="small"
          >
            今日
          </el-button>
          <el-button
            @click="onClickDay(1)"
            :type="dayRadio === 1 ? '' : 'info'"
            plain
            size="small"
          >
            7天
          </el-button>
        </el-button-group>
      </div>
      <div class="list-left__main">
        <div ref="chart" class="chart-wrapper"></div>
      </div>
    </div>
    <div class="list-right">
      <div class="list-right__bar">
        <div class="list-right__title">磅单信息</div>
        <el-button type="text" @click="onClickMore">更多信息</el-button>
      </div>
      <NoneData v-if="list.length <= 0" />
      <div class="list-right__box" v-for="(item, index) in list" :key="index">
        <div class="waybill-place">
          <div class="place g-single-row">{{ item.startRoute }}</div>
          <img src="@/assets/images/index/arrow-right.png" alt="" />
          <div class="place g-single-row">{{ item.endRoute }}</div>
        </div>
        <div class="waybill-company">{{ item.companyName }}</div>
        <div class="waybill-bar">
          <div class="waybill-tips">
            <img src="@/assets/images/index/goods-icon.png" alt="" />
            <p class="g-single-row">{{ item.goodsName }}阿斯顿阿斯顿爱上的</p>
          </div>
          <span>{{ item.freightTotal }}元</span>
        </div>
        <div class="waybill-date">{{ item.createTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from "@/api";
import * as echarts from "echarts";
import { getDisDayTime } from "@/utils/ddc";
import NoneData from "../NoneData";
import { mapGetters } from "vuex";

export default {
  name: "ListTrend",
  components: {
    NoneData,
  },
  data() {
    return {
      dayRadio: 0,
      chart: null,
      list: [],
    };
  },
  created() {
    this.queryPagingWeighbridgeTrend();
    this.queryListWeighbridgeTrend();
  },
  computed: {
    ...mapGetters(["sidebarRouters"]),
  },
  methods: {
    // 获取磅单信息
    queryPagingWeighbridgeTrend() {
      const objDispatch = {
        moduleName: "http_home",
        method: "post",
        url_alias: "pagingWeighbridgeTrend",
        data: {
          pageNum: 1,
          pageSize: 3,
        },
      };
      http_request(objDispatch).then((res) => {
        const data = res.data ? res.data.rows || [] : [];
        this.list = data;
      });
    },
    // 获取磅单趋势图
    queryListWeighbridgeTrend() {
      const objDispatch = {
        moduleName: "http_home",
        method: "get",
        url_alias: "listWeighbridgeTrend",
        data: {
          startDate: getDisDayTime(new Date(), 6),
          endDate: this.parseTime(new Date(), "{y}-{m}-{d}"),
        },
      };
      http_request(objDispatch).then((res) => {
        const data = res.data;
        if (data) {
          this.initChart(data);
        }
      });
    },
    // 初始化echarts
    initChart(data) {
      this.dateList = data.map((item) => {
        return item.dateStr.substring(5).replace("-", "/");
      });
      this.tripList = data.map((item) => {
        return item.tripTotal;
      });
      this.freightList = data.map((item) => {
        return item.freightTotal;
      });
      this.chart = echarts.init(this.$refs.chart, "macarons", {
        height: 360,
      });
      this.option = {
        grid: {
          top: "15%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        legend: {
          left: 0,
          itemHeight: 8,
          data: ["磅单数", "结算运费"],
        },
        xAxis: {
          type: "category",
          data: this.dateList,
        },
        yAxis: [
          {
            type: "value",
            name: "磅单数",
            splitLine: {
              lineStyle: {
                color: ["#ebebeb"],
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            name: "结算运费",
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "磅单数",
            data: this.tripList,
            type: "bar",
            showBackground: true,
            barWidth: 16,
            yAxisIndex: 0,
            backgroundStyle: {
              color: "#F7F7F7",
            },
          },
          {
            name: "结算运费",
            data: this.freightList,
            type: "line",
            smooth: true,
            yAxisIndex: 1,
          },
        ],
      };
      this.changeBarColor();
    },
    // 点击日子
    onClickDay(which) {
      if (this.dayRadio !== which) {
        this.dayRadio = which;
        this.changeBarColor();
      }
    },
    // 改变条的颜色
    changeBarColor() {
      let length = this.option.series[0].data.length;
      let seriesData = [];
      for (let i = 0; i < length; i++) {
        if (i >= length - 1) {
          seriesData.push({
            value: this.tripList[i],
            itemStyle: {
              color: "#4682FA",
            },
            emphasis: {
              itemStyle: {
                color: "#5c90f7",
              },
            },
          });
        } else {
          seriesData.push({
            value: this.tripList[i],
            itemStyle: {
              color: this.dayRadio === 0 ? "#EBEBEB" : "#4682FA",
            },
            emphasis: {
              itemStyle: {
                color: "#5c90f7",
              },
            },
          });
        }
      }
      this.option.series[0].data = seriesData;
      this.onDrawChart();
    },
    onDrawChart() {
      if (this.chart) {
        this.chart.setOption(this.option);
      }
    },
    getSecendMenu(type) {
      const result = [];
      this.sidebarRouters.forEach((item) => {
        if (item.path.includes(type)) {
          // 有效二级菜单
          if (!item.hidden) {
            if (item.children && item.children.length > 1) {
              item.children.forEach((element) => {
                console.log("element", element);
                if (!element.hidden) {
                   element.path = `/${type}/${element.path}`
                  result.push(element);
                }
              });
            }
          }
        }
      });
      return result;
    },
    onClickMore() {
      this.$router.push({ path: "/app/weight" });
      this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
      const result = this.getSecendMenu("app");
      console.log("result", result);
      this.$store.commit("SET_SIDE_SECOND_ROUTERS", result);
      this.$store.commit("app/SET_RECORDMODULENAME", "app");
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  width: 744px;
  height: 408px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  .list-left {
    width: 440px;
    padding-right: 32px;
    &__bar {
      display: flex;
      justify-content: space-between;
    }
    &__title {
      font-size: 20px;
      font-weight: bold;
      color: #3d4050;
    }
    &__main {
      width: 100%;
      height: 280px;
      margin-top: 15px;
      .chart-wrapper {
        width: 100%;
        height: 100%;
      }
    }
  }
  .list-right {
    width: 304px;
    height: 376px;
    position: relative;
    background: #f7f7f7;
    border-radius: 4px;
    padding: 12px;
    &__bar {
      width: 100%;
      height: 35px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    &__title {
      font-size: 16px;
      font-weight: bold;
      color: #3d4050;
    }
    &__box {
      width: 280px;
      height: 98px;
      background: #fff;
      border-radius: 4px;
      border-left: 4px solid #4682fa;
      margin-bottom: 12px;
      padding: 7px;
      .waybill-place {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        color: #3d4050;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .place {
          flex: 1 1 50%;
        }
        img {
          width: 20px;
          height: 10px;
          margin: 0 15px;
        }
      }
      .waybill-company {
        font-size: 12px;
        color: #bebebe;
      }
      .waybill-bar {
        width: 100%;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(224, 229, 237, 0.38);
        border-radius: 2px;
        padding: 0 8px;
        margin: 4px 0;
        span {
          font-size: 14px;
          font-weight: bold;
          color: #3d4050;
        }
      }
      .waybill-tips {
        line-height: 18px;
        display: flex;
        align-items: center;
        p {
          width: 140px;
          font-size: 12px;
          font-weight: bold;
          color: #4682fa;
        }
        img {
          width: 14px;
          height: 14px;
          margin-right: 3px;
        }
      }
      .waybill-date {
        font-size: 12px;
        color: #bebebe;
      }
    }
  }
}
</style>
