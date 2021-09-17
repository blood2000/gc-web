<!-- 告警详情 -->
<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="device-info-right">
          <div class="device-info-right-top">
            <div class="top-title">告警详情</div>
          </div>
          <div class="device-info-right-bottom">
            <div class="detail-item item-line">
              <div>
                <span>告警类型:</span>
                <span class="warning">{{ detail.warningTypeName }}</span>
              </div>
              <div>
                <span>告警级别:</span>
                <span class="warning">{{ detail.warningLevelName }}</span>
              </div>
            </div>
            <div class="detail-item ">
              <span>驾驶司机:</span>
              <span>{{ detail.driver }}</span>
            </div>
            <div class="detail-item ">
              <span>驾驶车辆:</span>
              <span>{{ detail.vehicle }}</span>
            </div>
            <div class="detail-item ">
              <span>时速:</span>
              <span>{{ detail.speed }}km/h</span>
            </div>
            <div class="detail-item ">
              <span>告警地址:</span>
              <span>{{ detail.upAddr }}</span>
            </div>
            <div class="detail-item ">
              <span>告警时间:</span>
              <span>{{ detail.upTime }}</span>
            </div>
            <div class="video-box" >
              <div class="video-item" v-for="item in videoList" :key="item.id">视频{{item.id * 1 + 1}}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { http_request } from "@/api";
import warningConfig from "./config";
// import store from "@/store";
export default {
  name: "warningDetail",
  data() {
    return {
      detail: {},
      driver: "",
      videoList: [],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getWarningDetail();
    this.videoList = warningConfig.videoList;
  },

  methods: {
    getWarningDetail() {
      let option = document.location.search.split("=")[1];
      this.driver = decodeURIComponent(option);
      // this.driver = this.$router.param.driver;
      let detail = {};
      let list = warningConfig.mockData;
      list.map(item => {
        if (item.driver === this.driver) {
          detail = item;
        }
      });
      detail.warningTypeName = this.getWarinigTypeName(detail.warinigType);
      detail.deviceTypeName = this.getDeviceTypeName(detail.deviceType);
      detail.warningLevelName = this.getWarningLevelName(detail.warningLevel);
      this.detail = detail;
      console.log(this.detail);
    },
    //告警类型
    getWarinigTypeName(warningType) {
      let warningName = "";
      warningConfig.warningTypeList.map(item => {
        if (item.warningType === warningType) {
          warningName = item.warningName;
        }
      });
      return warningName;
    },
    //设备类型
    getDeviceTypeName(deviceType) {
      let name = "";
      warningConfig.deviceTypeList.map(item => {
        if (item.value === deviceType) {
          name = item.label;
        }
      });
      return name;
    },
    // 告警级别
    getWarningLevelName(level) {
      let levelName = "";
      warningConfig.warningLevelList.map(item => {
        if (item.level === level) {
          levelName = item.name;
        }
      });
      return levelName;
    }
  }
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
  }
}
.top-title {
  position: relative;
  font-size: 20px;
  font-weight: bold;
  height: 40px;
}

.top-title::before {
  position: absolute;
  content: "";
  top: 1px;
  left: -15px;
  height: 26px;
  width: 5px;
  background: #1890ff;
}

.detail-item {
  height: 50px;
  line-height: 50px;
  color: #666;
  font-size: 16px;
}

.detail-item > span:first-child,
.item-line > div > span:first-child {
  padding-right: 5px;
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
  justify-content: space-between;
}

.video-item {
  width: 420px;
  height: 260px;
  line-height: 258px;
  text-align: center;
  margin: 0 10px 10px;
  font-size: 24px;
  font-weight: bold;
  color: #eee;
  background: rgba(0,0,0,.4);
}
</style>
