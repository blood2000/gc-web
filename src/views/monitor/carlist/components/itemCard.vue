<template>
  <div class="monitor-card" @click="mapSearch">
    <div @click.stop="">
      <el-dropdown class="monitor-card-menu-ab" trigger="click">
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span class="menu-item" @click="lookCarOrder">查看派车单</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="menu-item" @click="mapSearch">地图查看</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="menu-item" @click="travelSeach">轨迹查看</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="menu-item" @click="seeVideo">视频回放</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="monitor-card-title">
      <span>{{ data.plate_number }}</span>
      <span v-if="data.vehicleAlias" class="monitor-card-label">
        {{ data.vehicleAlias }}
      </span>
    </div>
    <div class="monitor-card-location">
      <span class="monitor-card-location-text1">当前位置 |</span>
      <el-tooltip
        v-if="data.attribute"
        effect="dark"
        :content="data.attribute"
        placement="top"
      >
        <span class="monitor-card-location-text2">{{ data.attribute }}</span>
      </el-tooltip>
      <span v-else class="monitor-card-location-text2">暂无数据</span>
    </div>
    <div class="monitor-card-driver">
      <span>最新告警</span>
      <img src="@/assets/images/monitor-line.png" />
    </div>
    <div v-if="data.sn" class="monitor-card-content">
      <div class="monitor-card-content-img">
        <img v-if="dealBigImage" :src="dealBigImage" />
      </div>
      <div class="monitor-card-content-right">
        <div class="monitor-card-content-right-title">
          <div
            class="monitor-card-content-right-title-warn"
            v-if="data.alarmLevel"
          >
            <img :src="levelDeal('img')" />
            <span>{{ levelDeal("text") }}</span>
          </div>
          <div class="monitor-card-content-right-title-anomaly">
            <img :src="dealAlarmImg()" />
            <span>{{ data.alarm_type }}</span>
          </div>
        </div>
        <el-tooltip effect="dark" :content="data.alarm_address" placement="top">
          <div class="monitor-card-content-right-address g-single-row">
            {{ data.alarm_address }}
          </div>
        </el-tooltip>
        <div class="monitor-card-content-right-date">{{ dealAlarmTime }}</div>
      </div>
    </div>
    <div v-else class="nothing">
      <el-empty :image-size="39.5"></el-empty>
    </div>
    <div class="monitor-card-footer">
      <div class="monitor-card-footer-left">
        <img src="../../../../assets/images/detail/monitor-phone.png" alt="" />
        <el-tooltip
          effect="dark"
          v-if="data.model_name"
          :content="data.model_name"
          placement="top"
        >
          <span class="g-single-row">{{ data.model_name }}</span>
        </el-tooltip>
        <span v-else class="g-single-row">暂未绑定设备...</span>
      </div>
      <div class="monitor-card-footer-middle">
        <img src="../../../../assets/images/detail/monitor-people.png" alt="" />
        <el-tooltip
          v-if="data.driver_name"
          effect="dark"
          :content="data.driver_name"
          placement="top"
        >
          <span class="g-single-row">{{ data.driver_name }}</span>
        </el-tooltip>
        <span v-else class="g-single-row">未分配</span>
      </div>
      <div class="monitor-card-footer-right">
        <span
          :style="{ color: dealVehicleStatusColor }"
          style="font-size: 16px"
          v-show="dealVehicleStatus"
          >•
        </span>
        <!-- g-single-row -->
        <span class="g-single-row" :style="{ color: dealVehicleStatusColor }">{{
          dealVehicleStatus
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  tableColumnsConfig,
  vehicleStatusList,
  warningLevelObj,
} from "../config";
import { parseTime } from "../../../../utils/ddc";
import { http_request } from '../../../../api';
export default {
  name: "itemCard",
  data() {
    return {
      open: false,
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    dealAlarmTime() {
      return parseTime(Number(this.data.alarm_time));
    },
    //返回大图
    dealBigImage() {
      const result = this.data.model_code;
      if (result) {
        return `http://static.zjz1.net/device/model/${result}/${result}-icon.png`;
        // return "http://static.zjz1.net/device/model/A1/A1-{tag}.png".replace(
        //   /\{tag\}/g,
        //   "icon"
        // );
      } else {
        return "";
      }

      //http://static.zjz1.net/device/model/A1/A1-icon.png
    },
    //处理车辆状态
    dealVehicleStatus() {
      let result = "";
      vehicleStatusList.forEach((element) => {
        if (element.value == this.data.vehicle_status) {
          result = element.label;
        }
      });
      return result;
    },
    //处理车辆状态颜色
    dealVehicleStatusColor() {
      let result = "";
      vehicleStatusList.forEach((element) => {
        if (element.value == this.data.vehicle_status) {
          result = element.color;
        }
      });
      console.log("result", result);
      return result;
    },
  },
  mounted() {
    console.log("卡片数据", this.data);
  },
  methods: {
    // 处理异常图片
    dealAlarmImg() {
      if (!this.data.key) return "";
      // console.log("this.detail.key", this.data);
      return require(`@/assets/images/detail/aiot-yczd.png`);
      // return require(`@/assets/images/detail/${this.data.key}.png`);
    },
    // 处理危险等级显示
    levelDeal(type) {
      console.log("levelDeal", type, this.data);
      const obj = {
        text: () => {
          if (!this.data.alarmLevel) return "-";
          console.log("text", warningLevelObj[this.data.alarmLevel][type]);
          return warningLevelObj[this.data.alarmLevel].text;
        },
        img: () => {
          if (!this.data.alarmLevel) return "";
          console.log(
            " warningLevelObj[this.data.alarmLevel].img",
            warningLevelObj[this.data.alarmLevel]
          );
          return warningLevelObj[this.data.alarmLevel].img;
        },
      };
      return obj[type]();
    },
    // 点开菜单
    handleMenuItem() {
      this.open = true;
    },

    // 查看地图
    mapSearch() {
      console.log("查看地图 this.data", this.data);
      if (!this.data.sn) {
        this.msgWarning("该车辆未绑定设备");
        return;
      }
      if (!this.data.activation_flag) {
        this.msgWarning("该设备未激活");
        return;
      }
      const vehicleCode = this.data.vehicle_code;
      const trackType = 1;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    // 视频查看
    seeVideo() {
      console.log("我是视频查看 this.data", this.data);
      const vehicleCode = this.data.vehicle_code;
      const trackType = 4;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    // 轨迹查看
    travelSeach() {
      console.log("this.data", this.data);
      const vehicleCode = this.data.vehicle_code;
      const trackType = 3;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    // 查看派车单
    async lookCarOrder() {
      console.log("this.data", this.data);
      const tmp = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "CarOrderIng_ByVehicleCode",
        url_code: [this.data.vehicle_code],
      };
      const res = await http_request(tmp);
      console.log("res", res);
      if (res.data == null) return this.msgError("没有派车单");
      this.currCode = res.data.appointCarOrderCode;
      this.detailDrawer = true;

      // this.$router.push("/dispatch/manage/detail?code=" + code);
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-card {
  position: relative;
  width: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    border-radius: 3px;
  height: 228px;
  background: #ffffff;
  border-radius: 6px;
  padding-top: 16px;
  box-sizing: border-box;
  &-menu-ab {
    width: 32px;
    height: 20px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    top: 10px;
    & > div {
      width: 32px;
      height: 20px;
      & > div {
        width: 4px;
        height: 4px;
        background: #3d4050;
        border-radius: 50%;
        display: inline-block;
        margin-right: 4px;
      }
    }
  }
  &-title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #3d4050;
    padding-left: 16px;
    padding-right: 16px;
    
    // &>span{
    //   display: inline-block;
    //   margin-right: 9px;
    // }
  }
  &-label {
    margin-left: 9px;
    width: 60px;
    height: 20px;
    background: #ebf2ff;
    border-radius: 2px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #4682fa;
    padding: 1px 6px;
  }
  &-location {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #3d4050;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    &-text1 {
      width: 64px;
    }
    &-text2 {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 5px;
    }
  }
  &-driver {
    height: 17px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #adb5bd;
    margin-top: 10px;
    margin-bottom: 15px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    align-items: center;
    & > span {
      padding-right: 2px;
    }
    & > img {
      width: 294px;
      height: 9px;
      vertical-align: middle;
      // padding-left: 2px;
    }
  }
  &-content {
    height: 68px;
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    &-img {
      // width: 104px;
      // height: 68px;

      min-width: 104px !important;
      height: 68px !important;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      padding-left: 12px;

      &-title {
        display: flex;
        align-items: center;
        height: 24px;
        &-warn {
          display: flex;

          height: 24px;
          padding-right: 28px;
          & > img {
            display: inline-block;
            margin-right: 5px;
            width: 24px;
            height: 24px;
          }
          & > span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
          }
        }
        &-anomaly {
          display: flex;
          height: 24px;
          & > img {
            height: 24px;
          }
          & > span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
          }
        }
      }
      &-address {
        width: 235px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #3d4050;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 1px 0;
      }
      &-date {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #adb5bd;
      }
    }
  }
  &-footer {
    border-top: 1px solid #f3f4f5;
    display: flex;
    height: 40px;
    &-left {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 180px;
      padding: 0 10px;
      border-right: 1px solid #f3f4f5;
      display: flex;
      align-items: center;
      & > img {
        width: 12.5px;
        height: 12px;
        padding-right: 2px;
      }
      & > span {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #3d4050;
      }
    }
    &-middle {
      padding: 0 10px;
      width: 96px;
      border-right: 1px solid #f3f4f5;
      display: flex;
      align-items: center;
      & > img {
        width: 14px;
        height: 14px;
        display: inline-block;
        margin-right: 2px;
      }
      & > span {
        display: inline-block;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #3d4050;
      }
    }
    &-right {
      padding-left: 25px;
      line-height: 40px;
      & > span {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #43b91e;
      }
    }
  }
}
.menu-item {
  padding-right: 10px;
  color: #4682fa;
}
.nothing {
}
/deep/ .el-empty {
  padding: 0;
}
</style>