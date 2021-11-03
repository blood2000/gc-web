<!-- 告警详情 -->
<template>
  <el-drawer
    :title="options.title"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="40%"
    :append-to-body="true"
  >
    <div class="dispatch-base-contents-box" style="padding-top: 25px">
      <div class="warn-icon">
        <div class="warn-icon-box">
          <div class="warn-icon-box-centent">
            <img
              :src="dealAlarmImg()"
              style="width: 50px; height: 30px"
              alt=""
            />
            <span>{{ detail.alarmTypeName || "-" }}</span>
          </div>
        </div>
        <div class="warn-icon-box">
          <div class="warn-icon-box-centent">
            <img
              :src="levelDeal('img')"
              style="width: 30px; height: 30px"
              alt=""
            />
            <span>{{ levelDeal("text") }}</span>
          </div>
        </div>
      </div>
      <el-row class="contents-box">
        <!-- <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">告警类型:</span>
          <span class="dispatch-base-text warning">{{
            detail.alarmTypeName || "-"
          }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">告警级别:</span>
          <span class="dispatch-base-text warning">{{
            detail.alarmLevel || "-"
          }}</span>
        </el-col> -->
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">驾驶司机:</span>
          <span class="dispatch-base-text">{{ detail.nickName }}</span>
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">驾驶车辆:</span>
          <span class="dispatch-base-text">{{ detail.licenseNumber }}</span>
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">时速:</span>
          <span class="dispatch-base-text">{{ detail.speed || "-" }}km/h</span>
        </el-col>
        <el-col :span="24" style="padding-bottom: 16px">
          <span class="dispatch-base-label">告警地址:</span>
          <span class="dispatch-base-text">{{
            detail.alarmAddress || "-"
          }}</span>
        </el-col>
        <el-col :span="24">
          <span class="dispatch-base-label">告警时间:</span>
          <span class="dispatch-base-text">{{ detail.alarmTime }}</span>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "@/api";
import warningConfig from "./config";
import { number } from "echarts";
// import store from "@/store";
export default {
  name: "warningDetail",
  data() {
    return {
      detail: {},
      videoList: [],
      loading: false,
    };
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    detailDrawer: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  watch: {
    detailDrawer() {
      console.log("我在监听");
      if (this.detailDrawer) {
        console.log("他变成true");
        this.getWarningDetail();
        this.videoList = warningConfig.videoList;
      }
    },
  },
  methods: {
    dealAlarmImg(){
      if(!this.detail.key) return ''
      console.log('this.detail.key',this.detail)
      return require(`@/assets/images/detail/${this.detail.key}.png`)
    },
    levelDeal(type) {
      const obj = {
        text: () => {
          if (!this.detail.alarmLevel) return "-";
          console.log(
            "text",
            warningConfig.warningLevelObj[this.detail.alarmLevel][type]
          );
          return warningConfig.warningLevelObj[this.detail.alarmLevel].text;
        },
        img: () => {
          if (!this.detail.alarmLevel) return "";
          console.log(
            "warningConfig.warningLevelObj[this.detail.alarmLevel].img",
            warningConfig.warningLevelObj[this.detail.alarmLevel]
          );
          return warningConfig.warningLevelObj[this.detail.alarmLevel].img;
        },
      };
      return obj[type]();
    },
    async getWarningDetail() {
      this.loading = true;
      // let option = document.location.search.split("=")[1];
      // this.id = option;
      console.log(this.id);
      // this.driver = this.$router.param.driver;
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_detail",
        url_code: [this.id],
      };
      const res = await http_request(obj);
      this.loading = false;
      console.log("告警详情-->", res);
      if (res.code === 200) {
        this.detail = res.data;
      }
      console.log(this.detail);
    },
    //告警类型
    getWarinigTypeName(warningType) {
      let warningName = "";
      warningConfig.warningTypeList.map((item) => {
        if (item.warningType === warningType) {
          warningName = item.warningName;
        }
      });
      return warningName;
    },
    //设备类型
    getDeviceTypeName(deviceType) {
      let name = "";
      warningConfig.deviceTypeList.map((item) => {
        if (item.value === deviceType) {
          name = item.label;
        }
      });
      return name;
    },
    // 告警级别
    getWarningLevelName(level) {
      let levelName = "";
      warningConfig.warningLevelList.map((item) => {
        if (item.level === level) {
          levelName = item.name;
        }
      });
      return levelName;
    },
    handleClose() {
      this.$emit("colseDetailDrawer");
    },
  },
};
</script>
<style lang="scss" scoped>
.device-info {
  margin: 0 15px;
  @mixin box-shadow {
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left {
    @include box-shadow;
    margin-bottom: 0;
    min-height: calc(100vh - 192px);
  }

  .device-info-right {
    .device-info-right-top {
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom {
      @include box-shadow;
    }
    .main-box {
      padding: 10px 20px;
    }
  }
}
.card-title {
  position: relative;
  font-size: 14px;
  font-weight: bold;
  height: 30px;
}

.card-title::before {
  position: absolute;
  content: "";
  top: 2px;
  left: -10px;
  background: #1890ff;
  width: 2px;
  height: 16px;
  border-radius: 2px;
}

.card-title::after {
  content: "";
  height: 1px;
  position: absolute;
  left: -20px;
  right: -20px;
  bottom: 0;
  background: #f3f3f3;
}

.detail-item {
  height: 50px;
  line-height: 50px;
  color: #666;
  font-size: 14px;
}

.detail-item > span:last-child,
.item-line > div > span:last-child {
  padding-left: 5px;
  font-weight: bold;
}

.item-line {
  display: flex;
  align-items: center;
}

.item-line > div {
  min-width: 300px;
}

.warning {
  color: red;
  font-weight: bold;
}

.video-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  // justify-content: space-between;
}

.video-item {
  width: 320px;
  height: 180px;
  line-height: 178px;
  text-align: center;
  margin: 0 10px 10px;
  font-size: 24px;
  font-weight: bold;
  color: #eee;
  background: rgba(0, 0, 0, 0.4);
}

.warn-icon {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 28px;
  &-box {
    width: 76px;
    height: 76px;
    border: 1px solid rgba(112, 112, 112, 0.14901960784313725);
    opacity: 1;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 28px;
    &-centent {
      display: flex;
      flex-direction: column;
      align-items: center;
      & > span {
        padding-top: 5px;
      }
    }
  }
}
</style>
