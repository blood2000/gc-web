<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
  <div class="benefit">
    <!-- 效益分析 -->
    <div class="benefit-left">
      <div class="benefit-date">
        <div class="benefit-date__tips">
          <i class="arrow el-icon-arrow-left" @click="skip('preMon')"></i>
          <div class="date">{{ currentTM }}</div>
          <i class="arrow el-icon-arrow-right" @click="skip('nextMon')"></i>
        </div>
        <el-calendar ref="monChild" v-model="value" :first-day-of-week="7">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div @click="onSelectDay(data)" :class="onBuildClass(data)">
              <div>
                {{ parseTime(data.day, "{d}") }}
              </div>
            </div>
          </template>
        </el-calendar>
        <div class="benefit-date__interval">
          <span>{{ startDateText }}</span>
          <span v-show="endDateText">-{{ endDateText }}</span>
        </div>
        <div class="benefit-date__btn">
          <el-button @click="onSearch" type="primary" size="small">
            搜 索
          </el-button>
          <el-button @click="onReset" class="ml16" size="small" plain>
            重 置
          </el-button>
        </div>
      </div>
      <div class="benefit-info">
        <div class="benefit-info__box">
          <img src="@/assets/images/icon/icon-screen.png" alt="" />
          <p class="num">{{ statistic.appointCarOrderCount }}</p>
          <p class="label">总调度量</p>
        </div>
        <div class="benefit-info__box">
          <img src="@/assets/images/icon/icon-money.png" alt="" />
          <p class="num">{{ statistic.revenue }}</p>
          <p class="label">已收款</p>
        </div>
        <div class="benefit-info__box">
          <img src="@/assets/images/icon/icon-user.png" alt="" />
          <p class="num">{{ statistic.driverCount }}</p>
          <p class="label">任务司机</p>
        </div>
        <div class="benefit-info__box">
          <img src="@/assets/images/icon/icon-lock.png" alt="" />
          <p class="num">{{ statistic.vehicleCount }}</p>
          <p class="label">任务车辆</p>
        </div>
      </div>
    </div>
    <div class="benefit-right">
      <div class="wrapper">
        <div class="left" id="chartContainer">
          <Transport
            v-if="!isMany"
            :transChart="statistic.transChart"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
          <TransportMany
            v-if="isMany"
            :transChart="statistic.transChart"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
          <Freight
            v-if="!isMany"
            :freightChart="statistic.freightChart"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
          <FreightMany
            v-if="isMany"
            :freightChart="statistic.freightChart"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
        </div>
        <div class="right">
          <Vehicle
            :vehicleBenefitInfo="statistic.vehicleBenefitInfo || {}"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
          <Driver
            :driverBenefitInfo="statistic.driverBenefitInfo || {}"
            :startDate="startDate"
            :endDate="endDate || startDate"
          />
        </div>
      </div>
    </div>
  </div>
    </div>
      </div>
</template>

<script>
import { mapGetters } from "vuex";
import { http_request } from "@/api";
import { compareBeginEndTime } from "@/utils/index";
import Transport from "./components/transport.vue";
import TransportMany from "./components/transportMany.vue";
import Freight from "./components/freight.vue";
import FreightMany from "./components/freightMany.vue";
import Vehicle from "./components/vehicle.vue";
import Driver from "./components/driver.vue";

export default {
  components: {
    Transport,
    TransportMany,
    Freight,
    FreightMany,
    Vehicle,
    Driver,
  },
  data() {
    return {
      value: new Date(),
      startDate: this.parseTime(new Date(), "{y}-{m}") + "-01",
      endDate: this.parseTime(new Date(), "{y}-{m}-{d}"),
      isMany: false,
      chartWidth: 900,
      statistic: {
        appointCarOrderCount: "", // 总调度量
        revenue: "", // 已收款
        driverCount: "", // 任务司机
        vehicleCount: "", // 任务车辆
        transChart: [], // 运输图表
        freightChart: [], // 运费图表
        vehicleBenefitInfo: {
          // 车辆效益
          revenueCount: 0, // 已收款派车单
          revenue: 0, // 已收款
          vehicleBenefitRanking: [], // 车辆排行
        },
        driverBenefitInfo: {
          driverCount: 0, // 任务司机
          revenue: 0, // 已收款
          driverBenefitRanking: [], // 司机排行
        },
      },
    };
  },
  

  computed: {
    ...mapGetters(["sidebar"]),
    currentTM() {
      return this.parseTime(this.value, "{y}年{m}月");
    },
    startDateText() {
      return this.startDate
        ? this.parseTime(this.startDate, "{y}年{m}月{d}日")
        : "";
    },
    endDateText() {
      return this.endDate
        ? this.parseTime(this.endDate, "{y}年{m}月{d}日")
        : "";
    },
    // isCollapse() {
     
    //   console.log(!this.sidebar.opened);
    //   if (!this.sidebar.opened) {
    //     this.chartWidth = 946;
    //   } else {
    //     this.chartWidth = 786;
    //   }
    //   console.log("this.chartwidth", this.chartWidth);
    //   return !this.sidebar.opened;
    // },

  },

  created() {
    this.onSearch();
  },
  // mounted() {
  //   this.$nextTick(() => {});
  //   this.chartWidth = document.getElementById("left").offsetWidth - 60;
  //   console.log("this.chartWidth", this.chartWidth);
  // },

  methods: {
    // 点击搜索
    onSearch() {
      if (!this.startDate) {
        this.$message.error("请选择需要查询的开始日期");
        return;
      }
      if (!this.endDate) {
        this.endDate = this.startDate;
      }
      const params = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "wholeStatistics",
        data: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
      };
      http_request(params).then((res) => {
        this.isMany = !(
          this.startDate &&
          this.endDate &&
          this.startDate === this.endDate
        );
        this.statistic = res.data;
      });
    },
    // 周切换
    skip(val) {
      if (val === "preMon") {
        this.value = new Date(this.value.setMonth(this.value.getMonth() - 1));
      } else if (val === "nextMon") {
        this.value = new Date(this.value.setMonth(this.value.getMonth() + 1));
      } else if (val === "today") {
        this.value = new Date();
      } else if (val === "preYear") {
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() - 1)
        );
      } else if (val === "nextYear") {
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() + 1)
        );
      }
    },
    // 点击了天数
    onSelectDay(data) {
      if (!this.startDate) {
        this.startDate = data.day;
      } else if (!this.endDate) {
        if (compareBeginEndTime(this.startDate, data.day)) {
          this.endDate = data.day;
        } else {
          this.endDate = this.startDate;
          this.startDate = data.day;
        }
      } else {
        this.startDate = data.day;
        this.endDate = "";
      }
    },
    // 生成class
    onBuildClass(data) {
      if (data.day === this.startDate || data.day === this.endDate) {
        return "is-selected";
      }
      if (this.startDate && this.endDate) {
        if (
          compareBeginEndTime(this.startDate, data.day) &&
          compareBeginEndTime(data.day, this.endDate)
        ) {
          return "is-interval";
        }
      }
      return "";
    },
    onReset() {
      this.startDate = this.parseTime(new Date(), "{y}-{m}") + "-01";
      this.endDate = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.onSearch();
    },
  },
};
</script>

<style lang="scss" scoped>
.benefit {
  padding: 20px;
  display: flex;
  background: #fff;
  overflow: auto;
  height: 100%;
  &-left {
    width: 300px;
  }
  &-date {
    width: 100%;
    height: 420px;
    background: #fff;
    padding: 25px 16px 0 16px;
    &__tips {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .date {
        font-size: 18px;
        font-weight: bold;
        color: #3d4050;
      }
      i {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border: 1px solid #dedede;
        border-radius: 3px;
        color: #7e7f81;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
      }
    }
    &__interval {
      height: 25px;
      font-size: 16px;
      font-weight: bold;
      color: #3d4050;
      margin: 20px auto;
    }
    &__btn {
      display: flex;
      justify-content: center;
      .ml16 {
        margin-left: 16px;
      }
    }
  }
  &-info {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &__box {
      width: 144px;
      height: 172px;
      background: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 12px;
      padding: 16px 12px;
      img {
        width: 32px;
        height: 32px;
      }
      .num {
        font-size: 26px;
        font-family: Bahnschrift;
        font-weight: bold;
        color: #3d4050;
        margin-top: 45px;
      }
    }
  }
  &-right {
    // flex: 1 1 auto;
    flex: 1;
    width: 0;
    // overflow: auto;
    .wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .left {
      // width: 1024px;
      margin: 0 16px;
      flex: 1;
    }
    .right {
      width: 460px;
    }
  }
}

::v-deep .el-calendar__header {
  display: none;
  font-size: 12px;
  padding: 10px 0px;
  .el-button--mini {
    padding: 2px 5px;
    border-radius: 3px;
  }
}
::v-deep .el-calendar__body {
  padding: 0;
  .el-calendar-table thead th {
    padding: 0;
  }
}

::v-deep .el-calendar-table .el-calendar-day {
  height: 18px;
  padding: 0px;
  margin: 5px;
}
::v-deep .el-calendar-table tr td {
  border: 0px;
  text-align: center;
  position: relative;
}
::v-deep .el-calendar-table td .is-selected {
  width: 25px;
  height: 25px;
  background: #4682fa;
  background: linear-gradient(180deg, #68b1fc 0%, #007dff 100%);
  box-shadow: 0px 3px 6px rgba(70, 130, 250, 0.23);
  border-radius: 50%;
  font-weight: bold;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-calendar-table td .is-interval {
  width: 100%;
  height: 100%;
  background: rgba(70, 130, 250, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .date-container .el-progress-bar__outer {
  background: #43b91e;
}
</style>
