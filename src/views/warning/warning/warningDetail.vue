<!-- 告警详情 -->
<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="device-info-right">
          <div class="device-info-right-bottom main-box">
            <div class="card-title">告警详情</div>
            <div class="detail-item item-line">
              <div>
                <span>告警类型:</span>
                <span class="warning">{{ detail.alarmTypeName || '-' }}</span>
              </div>
              <div>
                <span>告警级别:</span>
                <span class="warning">{{ detail.alarmLevel || '-' }}</span>
              </div>
            </div>
            <div class="detail-item ">
              <span>驾驶司机:</span>
              <span>{{ detail.nickName }}</span>
            </div>
            <div class="detail-item ">
              <span>驾驶车辆:</span>
              <span>{{ detail.licenseNumber }}</span>
            </div>
            <div class="detail-item ">
              <span>时速:</span>
              <span>{{ detail.speed || '-' }}km/h</span>
            </div>
            <div class="detail-item ">
              <span>告警地址:</span>
              <span>{{ detail.alarmAddress || '-' }}</span>
            </div>
            <div class="detail-item ">
              <span>告警时间:</span>
              <span>{{ detail.alarmTime }}</span>
            </div>
            <!-- <div class="video-box" >
              <div class="video-item" v-for="item in videoList" :key="item.id">视频{{item.id * 1 + 1}}</div>
            </div> -->
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
      id: "",
      videoList: [],
      loading: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getWarningDetail();
    this.videoList = warningConfig.videoList;
  },

  methods: {
    async getWarningDetail() {
      this.loading = true;
      let option = document.location.search.split("=")[1];
      this.id = option;
      console.log(this.id)
      // this.driver = this.$router.param.driver;
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_detail",
        url_code: [this.id],
      };
      const res = await http_request(obj);
      this.loading = false;
      console.log('告警详情-->', res);
      if (res.code === 200) {
        this.detail = res.data;
      }
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
    content: '';
    height: 1px;
    position: absolute;
    left: -20px;
    right: -20px;
    bottom: 0;
    background: #F3F3F3;
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
  background: rgba(0,0,0,.4);
}
</style>
