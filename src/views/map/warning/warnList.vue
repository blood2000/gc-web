<template>
  <!-- 地图告警列表 -->
  <div class="map-warning-table" :class="{isClose: isClose}">
    <ul class="map-warning-table__tab ly-flex-pack-start">
      <li v-for="item in tabList" :key="item.code" :class="{active: activeTab === item.code}" @click="handleTab(item.code)">{{ item.tabName }}</li>
    </ul>

    <div class="map-warning-table__content ly-flex-pack-justify">
      <ul v-show="!isClose" class="warning-list map-scroll-panel ly-flex-pack-start">
        <!-- 实时报警 -->
        <template v-if="activeTab === 'real'">
          <template v-if="dataList.length > 0">
            <li class="warning-list-li" v-for="(item, index) in dataList" :key="index" @click="handleRealWarnCard(item, index)">
              <div class="warning-card" :class="{active: index === activeRealWarnCard}">
                <h5 class="g-single-row">{{ item.licenseNumber }}</h5>
                <p class="label mb10 g-single-row">{{ item.nickName ? item.nickName : '暂无' }}<span style="margin: 0 10px">|</span>{{ item.teamName ? item.teamName : '暂无' }}</p>
                <div class="center-box ly-flex-pack-justify ly-flex-align-end mb5">
                  <div v-if="item.alarmTypeName" class="ly-flex-v ly-flex-align-center">
                    <img src="~@/assets/images/device/warn_icon_1.png">
                    <p class="g-single-row text">{{ item.alarmTypeName }}</p>
                  </div>
                  <div v-if="item.alarmLevel" class="ly-flex-v ly-flex-align-center">
                    <img src="~@/assets/images/device/warn_label_1.png">
                    <p class="g-single-row text">{{ item.alarmLevel }}</p>
                  </div>
                  <div v-if="item.alarmValue" class="ly-flex-v ly-flex-align-center">
                    <p class="g-single-row"><strong>{{ item.alarmValue }}</strong> km/h</p>
                    <p class="g-single-row text">报警时速</p>
                  </div>
                </div>
                <p class="label g-single-row">报警位置</p>
                <p class="address g-single-row">{{ item.alarmAddress ? item.alarmAddress : '暂无' }}</p>
              </div>
            </li>
          </template>
          <template v-else>
            <li class="warning-list-none ly-flex-pack-center ly-flex-align-center">
              <p>暂无数据</p>
            </li>
          </template>
        </template>
        <!-- vehicle 车辆，device 设备，person 人员 -->
        <template v-else>
          <template v-if="otherDataList.length > 0">
            <li class="warning-list-adas" v-for="(item, index) in otherDataList" :key="index" @click="handleDetail(item)">
              <div class="warning-card" :class="{active: index === 0}">
                <div class="center-box ly-flex-pack-justify ly-flex-align-end mb5">
                  <div v-if="item.alarmTypeName" class="ly-flex-v ly-flex-align-center">
                    <img src="~@/assets/images/device/warn_icon_1.png">
                    <p class="g-single-row text">{{ item.alarmTypeName }}</p>
                  </div>
                  <div v-if="item.alarmLevel" class="ly-flex-v ly-flex-align-center">
                    <img src="~@/assets/images/device/warn_label_2.png">
                    <p class="g-single-row text">{{ item.alarmLevel }}</p>
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
                    <p class="time g-single-row">{{ item.maxAlarmTime ? item.maxAlarmTime : '暂无' }}</p>
                  </div>
                  <div>
                    <p class="label g-single-row">末次告警时间</p>
                    <p class="time g-single-row">{{ item.minAlarmTime ? item.minAlarmTime : '暂无' }}</p>
                  </div>
                </div>
                <p class="label g-single-row">报警位置</p>
                <p class="address g-single-row">{{ item.alarmAddress ? item.alarmAddress : '暂无' }}</p>
              </div>
            </li>
          </template>
          <template v-else>
            <li class="warning-list-none ly-flex-pack-center ly-flex-align-center">
              <p>暂无数据</p>
            </li>
          </template>
        </template>
      </ul>
      <div class="more-button ly-flex-v ly-flex-pack-center ly-flex-align-center" @click="handleMore">
        <img src="@/assets/images/device/icon_more.png">
        查看更多
      </div>
    </div>

    <!-- 收起按钮 -->
    <img class="map-warning-table__pull" :src="require(`@/assets/images/device/icon_pull${isClose ? '_rotate' : ''}.png`)" @click="handlePull">

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
import { http_request } from '@/api';
import bus from '../components/bus';
import WarnDetail from './warnDetail.vue';
export default {
  components: {
    WarnDetail
  },
  props: {
    vehicleCode: {
      type: String,
      default: null
    },
    orgOrVehicleInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 定时器
      timer: null,
      // 当前选中tab
      activeTab: 'real',
      // tab
      tabList: [{
        code: 'real',
        tabName: '实时报警'
      }, {
        code: 'vehicle',
        tabName: '车辆报警'
      }, {
        code: 'device',
        tabName: '设备报警'
      }, {
        code: 'person',
        tabName: '人员报警'
      }],
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
        teamCode: undefined,
        orgCode: undefined,
        vehicleCode: undefined
      },
      // 当前选中的实时告警卡片
      activeRealWarnCard: 0
    }
  },
  watch: {
    vehicleCode: {
      handler(val) {
        if (val) {
          this.getList();
        }
      }
    }
  },
  mounted() {
    this.getList();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    /** 切换tab */
    handleTab(code) {
      if (this.activeTab === code) return;
      this.activeTab = code;
      this.getList();
    },
    getList() {
      const code = this.activeTab;
      // 构造公共参数
      if (this.orgOrVehicleInfo) {
        if (this.orgOrVehicleInfo.vehicleFlag) {
          this.queryParams.vehicleCode = this.orgOrVehicleInfo.orgOrVehicleCode;
        } else {
          this.queryParams.orgCode = this.orgOrVehicleInfo.orgOrVehicleCode;
          // 判断是否是树节点的最顶层
          if (this.orgOrVehicleInfo.icon && this.orgOrVehicleInfo.icon === 'second') {
            this.queryParams.teamCode = this.orgOrVehicleInfo.orgOrVehicleCode;
          }
        }
      }
      // 根据不同tab请求不同接口
      if (code === 'real') {
        this.getRealList();
      } else {
        this.getOtherList(code);
      }
      this.refreshTime();
    },
    /** 获取实时告警列表 */
    getRealList() {
      const params = {
        start: 1,
        limit: 5
      };
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'getRealWarnList',
        data: Object.assign({}, params, this.queryParams)
      }
      http_request(obj).then(response => {
        if (response.data && response.data.rows) {
          this.dataList = response.data.rows;
        } else {
          this.dataList = [];
        }
        this.handleRealWarnCard(this.dataList[0], 0);
      });
    },
    /** 获取 车辆/设备/人员 告警 */
    getOtherList(alarmObject) {
      const params = {
        start: 1,
        limit: 4,
        alarmObject // 告警对象(vehicle 车辆，device 设备，person 人员)
      };
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'getOtherWarnList',
        data: Object.assign({}, params, this.queryParams)
      }
      http_request(obj).then(response => {
        if (response.data && response.data.rows) {
          this.otherDataList = response.data.rows;
        } else {
          this.otherDataList = [];
        }
      });
    },
    /** 定时刷新 */
    refreshTime() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.getList();
      }, 30 * 1000);
    },
    /** 清除定时器 */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    /** 展开收起面板 */
    handlePull() {
      this.isClose = !this.isClose;
      bus.$emit('isClose', this.isClose);
    },
    /** 查看告警详情 */
    handleDetail(row) {
      this.detailOpen = true;
      this.$refs.WarnDetailRef.setData(row);
    },
    /** 查看更多 */
    handleMore() {
      this.$router.push('/warning/warning');
    },
    /** 点击实时告警事件 */
    handleRealWarnCard(row, index) {
      this.activeRealWarnCard = index;
      this.$parent.darwRealWarnMarker(row);
    }
  }
}
</script>

<style lang="scss" scoped>
.map-warning-table{
  $tab-height: 48px;
  transition: height 0.3s;
  &__tab{
    position: absolute;
    left: 0;
    top: calc(-#{$tab-height});
    z-index: 0;
    >li{
      padding: 0 30px;
      height: $tab-height;
      background: #E3E7F0;
      border-radius: 6px 6px 0 0;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 700;
      line-height: 36px;
      color: #8592AD;
      cursor: pointer;
      text-align: center;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
      z-index: 0;
      transform: translateY(12px);
      transition: transform 0.4s;
      margin-right: 8px;
      &.active{
        color: #3D4050;
        font-weight: 700;
        line-height: 48px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 6px -2px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(4px);
      }
    }
  }
  &__content{
    position: relative;
    height: 100%;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    background: rgba(255, 255, 255, 0.72);
    border-radius: 8px;
    z-index: 1;
    padding: 20px 12px 6px 12px;
    overflow: hidden;
    >.warning-list{
      width: calc(100% - 84px);
      height: 100%;
      overflow-x: scroll;
      >.warning-list-li{
        width: 20%;
        min-width: 270px;
        height: 100%;
        position: relative;
        padding: 0 10px;
        &:first-child{
          padding-left: 0px;
        }
        &::after{
          content: '';
          right: 0;
          width: 0px;
          height: 170px;
          border: 1px dashed #E0E5ED;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        // 告警卡片样式1
        .warning-card{
          height: 100%;
          border-radius: 6px;
          cursor: pointer;
          padding: 12px 14px;
          overflow: hidden;
          position: relative;
          &.active{
            &::before{
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, rgba(239, 105, 105, 0.16) 0%, rgba(239, 105, 105, 0) 100%);
              z-index: 0;
              animation: show-linear 0.6s;
              @keyframes show-linear {
                0% {
                  width: 0;
                }
                100%{
                  width: 100%;
                }
              }
            }
          }
          >h5{
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3D4050;
            position: relative;
            z-index: 1;
          }
          .label{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 26px;
            color: #A6A8AD;
            position: relative;
            z-index: 1;
          }
          .address{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
            position: relative;
            z-index: 1;
          }
          .center-box{
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3D4050;
            padding-right: 10px;
            position: relative;
            z-index: 1;
            img{
              width: 30px;
              height: 30px;
            }
            strong{
              font-size: 20px;
            }
            .text{
              font-weight: 700;
            }
          }
        }
      }
      >.warning-list-adas{
        width: 25%;
        min-width: 354px;
        height: 100%;
        position: relative;
        // 告警卡片样式2
        .warning-card{
          height: 100%;
          border-radius: 6px;
          cursor: pointer;
          padding: 6px 15px 12px;
          overflow: hidden;
          .label{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 26px;
            color: #A6A8AD;
          }
          .address{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
          }
          .center-box{
            font-size: 12px;
            font-family: PingFang SC;
            line-height: 24px;
            color: #3D4050;
            padding-right: 10px;
            img{
              width: 30px;
              height: 30px;
            }
            strong{
              font-size: 20px;
            }
            .text{
              font-weight: 700;
            }
            .count{
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: bold;
            }
          }
          .time-box{
            height: 68px;
            background: #EDF1F3;
            border-radius: 5px;
            padding: 10px 2px 10px 12px;
            margin-bottom: 6px;
            overflow: hidden;
            >div{
              width: 50%;
            }
            .label{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 24px;
              color: #A6A8AD;
            }
            .time{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: bold;
              line-height: 24px;
              color: #3D4050;
            }
          }
        }
      }
      >.warning-list-none{
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8592AD;
      }
    }
    >.more-button{
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
      color: #3D4050;
      >img{
        width: 32px;
        height: 32px;
      }
    }
  }
  &__pull{
    width: 52px;
    height: 20px;
    position: absolute;
    top: -20px;
    left: 50%;
    margin-left: -26px;
    cursor: pointer;
  }
  &.isClose{
    height: 32px !important;
    transition: height 0.3s;
  }
}
</style>