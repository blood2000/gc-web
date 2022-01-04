<template>
  <!-- 地图告警列表 -->
  <div class="map-warning-table" :class="{ isClose: isClose }">
    <ul class="map-warning-table__tab ly-flex-pack-start ly-flex-align-end">
      <li
        v-for="item in tabList"
        :key="item.code"
        :class="{ active: activeTab === item.code }"
        @click="handleTab(item.code)"
      >
        {{ item.tabName }}
      </li>
    </ul>

    <div class="map-warning-table__content ly-flex-pack-justify">
      <ul
        v-show="!isClose"
        class="warning-list map-scroll-panel ly-flex-pack-start"
      >
        <!-- 实时报警 -->
        <template v-if="activeTab === 'real'">
          <template v-if="dataList.length > 0">
            <li
              class="warning-list-li"
              v-for="(item, index) in dataList"
              :key="index"
              @click="handleRealWarnCard(item, index, 0)"
            >
              <div class="warning-card" :style="getWarnAm(index)">
                <!-- <img  v-if="index === activeRealWarnCard" style="width:100%;height:100%" :src="loading_chuan(index)"  alt=""> -->
                <!-- :class="{ active: index === activeRealWarnCard }" -->
                <h5 class="g-single-row">{{ item.licenseNumber }}</h5>
                <p class="label mb10 g-single-row">
                  {{ item.nickName ? item.nickName : "暂无"
                  }}<span style="margin: 0 10px">|</span
                  >{{ item.teamName ? item.teamName : "暂无" }}
                </p>
                <div
                  class="center-box ly-flex-pack-justify ly-flex-align-end mb5"
                >
                  <div
                    v-if="item.alarmTypeName"
                    class="ly-flex-v ly-flex-align-center"
                  >
                    <img :src="item.icon" />
                    <p class="g-single-row text">{{ item.alarmTypeName }}</p>
                  </div>
                  <div
                    v-if="item.alarmLevel"
                    class="ly-flex-v ly-flex-align-center"
                  >
                    <img
                      :src="
                        require('@/assets/images/device/warn_label_' +
                          item.alarmLevel +
                          '.png')
                      "
                    />
                    <p class="g-single-row text">{{ item.alarmLevel }}级告警</p>
                  </div>
                  <div
                    v-if="item.alarmValue"
                    class="ly-flex-v ly-flex-align-center"
                  >
                    <p class="g-single-row">
                      <strong>{{ item.alarmValue }}</strong> km/h
                    </p>
                    <p class="g-single-row text">报警时速</p>
                  </div>
                </div>
                <p class="label g-single-row">报警位置</p>
                <p class="address g-single-row">
                  {{ item.alarmAddress ? item.alarmAddress : "暂无" }}
                </p>
              </div>
            </li>
          </template>
          <template v-else>
            <li
              class="warning-list-none ly-flex-pack-center ly-flex-align-center"
            >
              <p>暂无数据</p>
            </li>
          </template>
        </template>
        <!-- vehicle 车辆，device 设备，driver 人员 -->
        <template v-else>
          <template v-if="otherDataList.length > 0">
            <li
              class="warning-list-adas"
              v-for="(item, index) in otherDataList"
              :key="index"
              @click="handleDetail(item)"
            >
              <div class="warning-card" :class="{ active: index === 0 }">
                <div
                  class="center-box ly-flex-pack-justify ly-flex-align-end mb5"
                >
                  <div
                    v-if="item.alarmTypeName"
                    class="ly-flex-v ly-flex-align-center"
                  >
                     <img :src="item.icon" />
                    <p class="g-single-row text">{{ item.alarmTypeName }}</p>
                  </div>
                  <div
                    v-if="item.alarmLevel"
                    class="ly-flex-v ly-flex-align-center"
                  >
                    <img
                      :src="
                        require('@/assets/images/device/warn_label_' +
                          item.alarmLevel +
                          '.png')
                      "
                    />
                    <p class="g-single-row text">{{ item.alarmLevel }}级告警</p>
                  </div>
                  <div v-if="item.number || item.number == 0" class="ly-flex-v">
                    <p class="g-single-row count">{{ item.number }}</p>
                    <p class="g-single-row text">告警次数</p>
                  </div>
                  <div class="ly-flex-v">
                    <p class="g-single-row count">{{ item.licenseNumber }}</p>
                    <p class="g-single-row text">车牌号</p>
                  </div>
                </div>
                <div class="time-box ly-flex-pack-justify">
                  <div>
                    <p class="label g-single-row">首次告警时间</p>
                    <p class="time g-single-row">
                      {{ item.minAlarmTime ? item.minAlarmTime : "暂无" }}
                    </p>
                  </div>
                  <div>
                    <p class="label g-single-row">末次告警时间</p>
                    <p class="time g-single-row">
                      {{ item.maxAlarmTime ? item.maxAlarmTime : "暂无" }}
                    </p>
                  </div>
                </div>
                <p class="label g-single-row">报警位置</p>
                <p class="address g-single-row">
                  {{ item.alarmAddress ? item.alarmAddress : "暂无" }}
                </p>
              </div>
            </li>
          </template>
          <template v-else>
            <li
              class="warning-list-none ly-flex-pack-center ly-flex-align-center"
            >
              <p>暂无数据</p>
            </li>
          </template>
        </template>
      </ul>
      <div
        class="more-button ly-flex-v ly-flex-pack-center ly-flex-align-center"
        @click="handleMore"
      >
        <img src="@/assets/images/device/icon_more.png" />
        查看更多
      </div>
    </div>

    <!-- 收起按钮 -->
    <img
      class="map-warning-table__pull"
      :src="
        require(`@/assets/images/device/icon_pull${
          isClose ? '_rotate' : ''
        }.png`)
      "
      @click="handlePull"
    />

    <!-- 轨迹详情 -->
    <WarnDetail
      :open.sync="detailOpen"
      :alarmObject="activeTab"
      :vehicleParams="queryParams"
      ref="WarnDetailRef"
      class="warn-detail-panel"
    />
  </div>
</template>

<script>
import { http_request } from "@/api";
import bus from "../components/bus";
import WarnDetail from "./warnDetail.vue";
import ttt1 from "../../../assets/images/map/test-demo.gif";
export default {
  components: {
    WarnDetail,
  },
  props: {
    vehicleCode: {
      type: String,
      default: null,
    },
    orgOrVehicleInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 定时器
      timer: null,
      // 当前选中tab
      activeTab: "real",
      // 啥颜色 true red  false blue
      isRealWarn: false,
      // tab
      tabList: [
        {
          code: "real",
          tabName: "实时报警",
        },
        {
          code: "vehicle",
          tabName: "行车事件",
        },
        {
          code: "device",
          tabName: "异常事件",
        },
        {
          code: "driver",
          tabName: "司机行为",
        },
        {
          code: "transport",
          tabName: "运输事件",
        },
      ],
      // 实时报警列表
      dataList: [],
      // adas报警列表
      otherDataList: [],
      // 面板是否收起
      isClose: false,
      // 告警详情开关
      detailOpen: false,
      // 公共请求参数
      queryParams: {
        orgCode: undefined,
        vehicleCode: undefined,
      },
      // 当前选中的实时告警卡片
      activeRealWarnCard: 0,
      timerWarn: null,
    };
  },
  watch: {
    vehicleCode: {
      handler(val) {
        console.log("vehicleCode watch0", val);
        if (val) {
          this.getList(0);
        }
      },
    },
  },
  mounted() {
    setTimeout(() => {
      console.log("mounted0");
      this.getList(2);
    });
  },
  computed: {},
  methods: {
    loading_chuan(index) {
      console.log("123", ttt1 + "?+" + new Date().getTime());
      return ttt1 + "?+" + new Date().getTime() + index;
    },
    // 那个动画
    getWarnAm(index) {
      let result = {};
      if (this.isRealWarn) {
        result = {
          background:
            index === this.activeRealWarnCard
              ? `url(${require(`../../../assets/images/map/warn-red.webp`)}?+${new Date().getTime()}${index})`
              : "",
        };
      } else {
        result = {
          background:
            index === this.activeRealWarnCard
              ? `url(${require(`../../../assets/images/map/warn-blue.webp`)}?+${new Date().getTime()}${index})`
              : "",
        };
      }
      console.log("ckc  result ===========", result);
      return result;
    },
    /** 切换tab */
    handleTab(code) {
      console.log("handleTab0");
      if (this.activeTab === code) return;
      this.activeTab = code;
      this.getList(2);
    },
    getList(type) {
      const code = this.activeTab;
      // 构造公共参数
      this.queryParams = {
        orgCode: undefined,
        vehicleCode: undefined,
      };
      if (this.orgOrVehicleInfo) {
        if (this.orgOrVehicleInfo.vehicleFlag) {
          this.queryParams.vehicleCode = this.orgOrVehicleInfo.orgOrVehicleCode;
        } else {
          if (this.orgOrVehicleInfo.icon === "second") {
            // 如果是顶层,告警参数不传orgCode
            this.queryParams.orgCode = null;
          } else {
            this.queryParams.orgCode = this.orgOrVehicleInfo.orgOrVehicleCode;
          }
        }
      }
      // 根据不同tab请求不同接口
      if (code === "real") {
        this.getRealList(type);
      } else {
        this.getOtherList(code);
      }
      // this.refreshTime();
    },
    /** 获取实时告警列表 */
    getRealList(type) {
      console.log("获取实时告警列表");
      const params = {
        start: 1,
        limit: 5,
      };
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getRealWarnList",
        data: Object.assign({}, params, this.queryParams),
      };
      http_request(obj).then((response) => {
        if (response.data && response.data.rows) {
          this.dataList = response.data.rows;
        } else {
          this.dataList = [];
        }
        this.handleRealWarnCard(this.dataList[0], 0, type);
      });
    },
    /** 获取 车辆/设备/人员 告警 */
    getOtherList(alarmObject) {
      const params = {
        start: 1,
        limit: 4,
        alarmObject, // 告警对象(vehicle 车辆，device 设备，driver 人员)
      };
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getOtherWarnList",
        data: Object.assign({}, params, this.queryParams),
      };
      http_request(obj).then((response) => {
        if (response.data && response.data.rows) {
          this.otherDataList = response.data.rows;
        } else {
          this.otherDataList = [];
        }
      });
    },
    // /** 定时刷新 */
    // refreshTime() {
    //   this.clearTimer();
    //   this.timer = setInterval(() => {
    //     this.getList();
    //   }, 30 * 1000);
    // },
    // /** 清除定时器 */
    // clearTimer() {
    //   if (this.timer) {
    //     clearInterval(this.timer);
    //   }
    // },
    /** 展开收起面板 */
    handlePull() {
      this.isClose = !this.isClose;
      this.$store.commit("set_isClose", this.isClose);
    },
    /** 查看告警详情 */
    handleDetail(row) {
      this.detailOpen = true;
      this.$refs.WarnDetailRef.setData(row);
    },
    /** 查看更多 */
    handleMore() {
      this.$router.push("/warning/warning");
    },
    /** 点击实时告警事件 */
    handleRealWarnCard(row, index, type) {
      this.isRealWarn = false;
      if (!row || !row.vehicleCode) return;
      if (type === 2) {
        if (row.vehicleCode == this.$store.getters.warnInfoCode) {
          type = 1;
        } else {
          this.isRealWarn = true;
          this.$store.commit("set_warnInfoCode", row.vehicleCode);
        }
      }
      clearTimeout(this.timerWarn);
      console.log("点击实时告警事件", type);
      this.activeRealWarnCard = type === 1 ? -1 : index;
      this.timerWarn = setTimeout(() => {
        this.activeRealWarnCard = -1;
        clearTimeout(this.timerWarn);
      }, 5 * 1000);
      this.$parent.dealDarwRealWarn(row, type);
    },
  },
};
</script>

<style lang="scss" scoped>
.map-warning-table {
  $tab-height: 44px;
  transition: height 0.3s;
  &__tab {
    position: absolute;
    left: 0;
    top: calc(-#{$tab-height});
    height: 44px;
    z-index: 0;
    > li {
      padding: 0 30px;
      height: 38px;
      background: #e3e7f0;
      border-radius: 6px 6px 0 0;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 700;
      line-height: 38px;
      color: #8592ad;
      cursor: pointer;
      text-align: center;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
      z-index: 0;
      transition: height 0.4s;
      margin-right: 8px;
      &.active {
        color: #3d4050;
        height: $tab-height;
        font-weight: 700;
        line-height: 44px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 6px -2px 10px rgba(0, 0, 0, 0.1);
      }
    }
  }
  &__content {
    position: relative;
    height: 100%;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    background: rgba(255, 255, 255, 0.72);
    border-radius: 0 8px 8px 8px;
    z-index: 1;
    padding: 20px 12px 6px 12px;
    overflow: hidden;
    > .warning-list {
      width: calc(100% - 84px);
      height: 100%;
      overflow-x: scroll;
      > .warning-list-li {
        width: 20%;
        min-width: 270px;
        height: 100%;
        position: relative;
        padding: 0 10px;
        &:first-child {
          padding-left: 0px;
        }
        &::after {
          content: "";
          right: 0;
          width: 0px;
          height: 170px;
          border: 1px dashed #e0e5ed;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        // 告警卡片样式1
        .warning-card {
          height: 100%;
          border-radius: 6px;
          cursor: pointer;
          padding: 12px 14px;
          overflow: hidden;
          position: relative;
          background-size: 100% 100% !important;
          // &.active {
          //   background: url("../../../assets/images/map/test-demo.gif");

          // }
          // &.active-red {
          //   background: url("../../../assets/images/map/warn-red.webp");
          //   background-size: 100% 100%;
          // }
          // &.no-active {
          //   background: url("../../../assets/images/map/red.webp");
          //   background-size: 100% 100%;
          // }
          > h5 {
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
            position: relative;
            z-index: 1;
          }
          .label {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 26px;
            color: #a6a8ad;
            position: relative;
            z-index: 1;
          }
          .address {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3d4050;
            position: relative;
            z-index: 1;
          }
          .center-box {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
            padding-right: 10px;
            position: relative;
            z-index: 1;
            img {
              width: 30px;
              height: 30px;
            }
            strong {
              font-size: 20px;
            }
            .text {
              font-weight: 700;
            }
          }
        }
      }
      > .warning-list-adas {
        width: 25%;
        min-width: 354px;
        height: 100%;
        position: relative;
        // 告警卡片样式2
        .warning-card {
          height: 100%;
          border-radius: 6px;
          cursor: pointer;
          padding: 6px 15px 12px;
          overflow: hidden;
          .label {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 26px;
            color: #a6a8ad;
          }
          .address {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3d4050;
          }
          .center-box {
            font-size: 12px;
            font-family: PingFang SC;
            line-height: 24px;
            color: #3d4050;
            padding-right: 10px;
            img {
              width: 30px;
              height: 30px;
            }
            strong {
              font-size: 20px;
            }
            .text {
              font-weight: 700;
            }
            .count {
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: bold;
            }
          }
          .time-box {
            height: 68px;
            background: #edf1f3;
            border-radius: 5px;
            padding: 10px 2px 10px 12px;
            margin-bottom: 6px;
            overflow: hidden;
            > div {
              width: 50%;
            }
            .label {
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 24px;
              color: #a6a8ad;
            }
            .time {
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: bold;
              line-height: 24px;
              color: #3d4050;
            }
          }
        }
      }
      > .warning-list-none {
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8592ad;
      }
    }
    > .more-button {
      width: 72px;
      height: 172px;
      margin: 10px 0;
      background: rgba(201, 207, 219, 0.22);
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 24px;
      color: #3d4050;
      > img {
        width: 32px;
        height: 32px;
      }
    }
  }
  &__pull {
    width: 52px;
    height: 20px;
    position: absolute;
    top: -20px;
    left: 50%;
    margin-left: -26px;
    cursor: pointer;
  }
  &.isClose {
    height: 32px !important;
    transition: height 0.3s;
  }
}
</style>
