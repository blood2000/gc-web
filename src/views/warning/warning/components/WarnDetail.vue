<!-- 告警详情 -->
<template>
  <el-drawer
    :title="options.title"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="760px"
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
            <span>{{ detail.vendorAlarmTypeName || "-" }}</span>
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
        <!-- <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">时速:</span>
          <span class="dispatch-base-text">{{ detail.speed || "-" }}km/h</span>
        </el-col> -->
        <el-col :span="24" style="padding-bottom: 16px">
          <div class="dispatch-base-line">
            <span class="label">告警地址:</span>
            <span class="text">
              {{ detail.alarmAddress || "-" }}
            </span>
          </div>
        </el-col>
        <el-col :span="24" style="padding-bottom: 16px">
          <div class="dispatch-base-line">
            <span class="label">告警描述:</span>
            <span class="text">
              {{ detail.alarmContent || "-" }}
            </span>
          </div>
          <!-- <span class="dispatch-base-label">告警描述:</span>
          <span class="dispatch-base-text">
            {{ detail.alarmContent || "-" }}
          </span> -->
        </el-col>
        <el-col :span="24">
          <span class="dispatch-base-label">告警时间:</span>
          <span class="dispatch-base-text">{{ detail.alarmTime }}</span>
        </el-col>
        <el-col :span="24">
          <div class="media-box">
            <div
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-item"
              :class="item.isFull ? 'full-modal' : ''"
            >
              <div class="media-icon" v-if="item.type === 'image'"></div>
              <img :src="item.src" alt="" v-if="item.type === 'image'" />

              <video-player
                v-if="item.type === 'video'"
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="getPlayerOptions(item.src)"
                :events="events"
                @fullscreenchange="onPlayerFullScreenchange($event, item)"
              ></video-player>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "@/api";
import warningConfig from "../config";
import { number } from "echarts";
// import store from "@/store";
export default {
  name: "warningDetail",
  data() {
    return {
      detail: {},
      mediaList: [],
      loading: false,
      events: ["fullscreenchange"],
      isFull: false,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "", //url地址
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
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
        this.mediaList = [];
      }
    },
  },
  methods: {
    dealAlarmImg() {
      if (!this.detail.key) return "";
      return require("@/assets/images/detail/aiot-yczd.png");
      // return require(`@/assets/images/detail/${this.detail.key}.png`);
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
        this.handleMedia();
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

    //处理媒体数据，区分图片和视频
    handleMedia() {
      let mediaArr = this.detail.pictureAndVideo || [];
      // let mediaArr = [
      //   "../../../../assets/mp4/test.mp4",
      //   "@/assets/images/login-background1.png",
      // ];

      mediaArr.map((item) => {
        let obj = {};
        let arr = item.split(".");
        let mediaType = arr[arr.length - 1];
        mediaType = mediaType.toLowerCase();
        if (
          mediaType === "jpg" ||
          mediaType === "png" ||
          mediaType === "jpeg"
        ) {
          obj.type = "image";
          obj.src = item;
        } else if (
          mediaType === "mp4" ||
          mediaType === "rmvb" ||
          mediaType === "avi"
        ) {
          obj.type = "video";
          obj.src = item;
          obj.isFull = false;
        }

        this.mediaList.push(obj);
      });
    },
    // mediaImgDeal(index) {
    //   let str = require("@/assets/images/login-background1.png");

    //   return str;
    // },

    getPlayerOptions(src) {
      let options = JSON.parse(JSON.stringify(this.playerOptions));
      options.sources[0].src = src;
      // options.sources[0].src = require("../../../../assets/mp4/test.mp4");
      return options;
    },
    onPlayerFullScreenchange(player, item) {
      // player.exitFullscreen(); //强制退出全屏，恢复正常大小
      // item.isFull = !item.isFull;
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
    min-width: 76px;
    height: 76px;
    padding: 0 10px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // width: 64px;
        text-align: center;
      }
    }
  }
}

.media-box {
  padding: 20px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.media-item {
  position: relative;
  width: 48%;
  height: 210px;
  background: #ddd;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  .video-player {
    width: 100%;
  }
  .video-js .vjs-control-bar {
    width: 100%;
  }
}

.full-modal {
  position: fixed;
  width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 102;
}

.media-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 66px;
  background: url("../../../../assets/images/detail/warn_img_corner.png")
    no-repeat center;
  background-size: contain;
}

.label {
  min-width: 60px;
  font-size: 14px;
  color: #adb5bd;
  margin-right: 5px;
  text-align: right;
}

.text {
  flex: 1;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #3d4050;
}
</style>
