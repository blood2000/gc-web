<template>
  <div class="play-back">
    <div class="play-back-warn">
      <i class="el-icon-warning-outline"></i>
      <span>历史视频也将消耗您的设备流量！</span>
    </div>
    <div class="play-back-form">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        size="small"
        label-position="top"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryParams.dateRange"
                unlink-panels
                type="datetimerange"
                size="small"
                style="width: 348px"
                range-separator="-"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择摄像头：" prop="CHANNEL">
              <el-select
                v-model="queryParams.CHANNEL"
                clearable
                filterable
                style="width: 348px"
                placeholder="请选择摄像头"
              >
                <el-option
                  v-for="item in channelNumList"
                  :key="item.key"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="play-back-form-btn">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchResult"
                :disabled="channelNumList.length == 0 ||!queryParams.dateRange ||queryParams.dateRange.length == 0 || !queryParams.CHANNEL"
              >
                查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="play-back-search">
      <div class="play-back-search-title">查询结果：</div>
      <div
        :class="isbigger ? 'dialog-video' : ''"
        :style="{ 'margin-top': isbigger ? '' : '40px' }"
        @click="colse"
      >
        <div
          class="play-back-search-result"
          :class="isbigger ? 'dialog-video-full' : ''"
          @click.stop=""
        >
          <!--           src="@/assets/mp4/【2048】202104271143janv2_2021429115831.mp4"
 -->
          <div
            v-show="isbigger"
            :class="isbigger ? 'dialog-video-full-title' : ''"
          >
            {{ getTypes() }}
            <i class="el-icon-close" @click.stop="hanleScale"></i>
          </div>
          <video
            id="video"
            ref="video"
            width="100%"
            height="100%"
            :poster="require('../../../utils/RVC/img/video-img.png')"
            autoplay
            @canplay="getDuration"
            muted
          ></video>
          <div class="play-back-search-result-count">
            {{ `${this.currTimes}/${this.totalTime}` }}
          </div>
          <div
            class="toBigger"
            @click.stop="isbigger = true"
            v-show="!isbigger"
          >
            <!--  video-bottom-right -->
            <img src="@/assets/images/detail/video-bottom-right.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTimeRange } from "@/utils/timeRange";
import { typeList } from "./config";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import { http_request } from "../../../api";

export default {
  components: { videoPlayer },
  watch: {
    isShow() {
      if (this.isShow == false) {
        this.$refs.videoPlayer.player.pause();
      }
    },
  },
  data() {
    return {
      getTimeRange,
      typeList,
      isShow: false,
      queryParams: {
        dateRange: [],
        CHANNEL: null, //通道号
        // VEHICLEID: "0", ////车辆ID
        // VEHICLELICENSE: "闽A80808", //车牌号
        // DEVICENO: "015800117661", //设备编码
        // PLATECOLOR: "2", //车牌颜色
        // STREAMTYPE: "1", //主/子码流
        VEHICLEID: "0", ////车辆ID
        VEHICLELICENSE: "", //车牌号
        DEVICENO: "", //设备编码
        PLATECOLOR: "2", //车牌颜色
        STREAMTYPE: "1", //主/子码流
      },
      playTime: "",
      current: "",
      videoUrl: {},
      isResult: false,
      wfs: null,
      currTimes: 0,
      totalTime: 0,
      ttTime: 0,
      isbigger: false,
      channelNumList: [],
    };
  },
  props: {
    vehicleCode: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.timeUpdate();
    console.log("进来了");
    this.getChannelNumListList();
    this.initTime();
  },
  beforeDestroy() {
    console.log("推出播放");
    if (this.wfs) {
      this.colse();
    }
  },
  watch: {},
  computed: {},
  methods: {
    initTime() {
      console.log(
        this.parseTime(
          new Date(new Date().setHours(0, 0, 0, 0)),
          "{y}-{m}-{d} {h}:{i}:{s}"
        )
      );

      this.queryParams.dateRange.push(
        new Date(new Date().setHours(0, 0, 0, 0))
      );
      this.queryParams.dateRange.push(
        new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
            24 * 60 * 60 * 1000 -
            1
        )
      );

      console.log("this.queryParams.dateRange", this.queryParams.dateRange);
    },
    getChannelNumListList() {
      const type = "vehicle,location,device,function,attribute,field"; // 获取信息类型, 可指定多个
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getVehicleInfo",
        url_code: [this.vehicleCode, type],
      };
      http_request(obj)
        .then((res) => {
          console.log('playback res',res)
          this.queryParams.VEHICLELICENSE = res.data.vehicle && res.data.vehicle.plateNumber
           this.queryParams.DEVICENO =res.data.device && res.data.device.deviceSN
          const fields = res.data.fields;
          this.channelNumList = [];
          for (let i = 0; i < Number(fields.channelNum); i++) {
            const obj = {
              key: `通道${i + 1}`,
              value: `${i + 1}`,
            };
            this.channelNumList.push(obj);
          }
          if (fields.channelNum > 0) {
            this.queryParams.CHANNEL = "1";
          }
        })
        .catch(() => {
          console.log("没有接口");
        });
    },
    // 时长转换
    durationTrans(a) {
      var b = "";
      var h = parseInt(a / 3600),
        m = parseInt((a % 3600) / 60),
        s = parseInt((a % 3600) % 60);
      if (h > 0) {
        h = h < 10 ? "0" + h : h;
        b += h + ":";
      }
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      b += m + ":" + s;
      return b;
    },
    //实时时间
    timeUpdate() {
      const refVideo = this.$refs.video;
      const me = this;
      refVideo.ontimeupdate = () => {
        me.currTimes = this.durationTrans(parseInt(refVideo.currentTime));
      };
    },
    // 标题头
    getTypes() {
      // let result = "";
      // for (const item of this.channelNumList) {
      //   if (item.value == this.queryParams.CHANNEL) {
      //     result = item.label;
      //   }
      // }
      return `通道${this.queryParams.CHANNEL}`;
    },
    // 关闭视频
    hanleScale() {
      this.isbigger = false;
    },
    //获取视频的总时长
    getDuration() {
      const refVideo = this.$refs.video;
      console.log("refVideo", refVideo);
      this.totalTime = this.durationTrans(parseInt(refVideo.duration));
      console.log("getDuration", this.totalTime);
    },
    // 查询结果
    searchResult() {
      this.colse(() => {
        this.wfs = null;
        console.log("表单", this.queryParams);
        const video = document.getElementById("video");
        const queryParams = this.queryParams;
        console.log("queryParams.dateRange", queryParams.dateRange);
        if (!queryParams.dateRange || queryParams.dateRange.length !== 2) return;
        const startTime =
          parseInt(queryParams.dateRange[0].getTime() / 1000) + "";
        const endTime =
          parseInt(queryParams.dateRange[1].getTime() / 1000) + "";
        this.OpenRecordingVideo(
          video,
          queryParams.VEHICLEID,
          queryParams.VEHICLELICENSE,
          queryParams.PLATECOLOR,
          queryParams.DEVICENO,
          queryParams.CHANNEL,
          startTime,
          endTime
        );
        this.isResult = true;
      });
    },
    //打开录像
    OpenRecordingVideo(
      video,
      vehicleId,
      vehiclelicense,
      platecolor,
      deviceno,
      channel,
      startTime,
      endTime
    ) {
      if (this.wfs != null) return;
      this.wfs = new Wfs();
      const MSGID = 0xf006;
      var wfsObj = {
          VEHICLEID: vehicleId,
          VEHICLELICENSE: vehiclelicense,
          PLATECOLOR: platecolor,
          DEVICENO: deviceno,
          DEVICETYPE: 0xd000,
          DOWNLOAD: 0,
          CHANNEL: channel,
          STORAGE: 0,
          VIDEOTYPE: 0,
          STREAMTYPE: 2,
          PLAYBACKTYPE: 0,
          MULTIPLE: 0,
          STARTTIME: startTime,
          ENDTIME: endTime,
        },
        player = new PCMPlayer({
          encoding: "16bitInt",
          channels: 1,
          sampleRate: 8000,
          flushingTime: 1000,
        }),
        userInfo = {
          MSGID,
          userId: "1",
        };
      video.poster = require("../../../utils/RVC/img/timg.gif");
      this.wfs.attachMedia(video, [wfsObj, player, userInfo]);
    },
    //退出播放
    colse(callback) {
      const me = this;
      if (this.wfs) {
        const options = me.queryParams;
        console.log("1111");
        me.CloseVideo(
          me.wfs,
          options.VEHICLEID,
          options.CHANNEL,
          options.VEHICLELICENSE,
          options.DEVICENO,
          options.PLATECOLOR
        );
        setTimeout(() => {
          me.wfs = null;
          console.log("录像了执行了");
          callback();
        }, 100);
      } else {
        callback();
      }
    },
    // 关闭视频
    CloseVideo(
      wfsObj,
      vehicleId,
      channel,
      vehiclelicense,
      deviceno,
      platecolor
    ) {
      console.log("wfsObj", wfsObj);
      if (wfsObj === null) {
        return;
      }
      var MSGID = 0xf004;
      var closeObj = {
        VEHICLEID: vehicleId,
        VEHICLELICENSE: vehiclelicense,
        PLATECOLOR: platecolor,
        DEVICENO: deviceno,
        DEVICETYPE: 0xd000,
        CHANNEL: channel,
        CTRLFLAG: 0,
        STOP: 0,
        SWICH: 1,
      };
      console.log("wfsObj", wfsObj);
      wfsObj.websocketLoader.client.send(
        JSON.stringify({
          HEAD: { MSGID: MSGID, USERID: this.userId, TRANSNO: 0 },
          PARAM: closeObj,
        })
      );
      wfsObj.media.poster = "../../../assets/images/RVC/video.png";
      wfsObj.media.src = "";
      console.log("CloseVideo end", wfsObj.websocketLoader.client);
      wfsObj.websocketLoader.client.close();
    },
  },
};
</script>
<style lang="scss" scoped>
.play-back-warn {
  margin: 0 16px;
  margin-top: 16px;
  width: 348px;
  height: 28px;
  background: rgba(239, 105, 105, 0.1);
  opacity: 1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ef6969;
}
.play-back-form {
  padding: 0 16px;
  &-btn {
    display: flex;
    justify-content: center;
  }
}
.play-back-search {
  height: 262px;
  border-top: 1px solid #dce3e9;
  padding: 20px 16px 16px 16px;
  width: 100%;
  position: relative;
  &-title {
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: #3d4050;
    margin-bottom: 7px;
    display: flex;
    justify-content: space-between;
  }
  .play-back-search-result {
    width: 356px;
    height: 200px;
    border-radius: 2px;
    position: relative;
    &-play {
      width: 65px;
      height: 65px;
      position: absolute;
      top: calc(50% - 37.5px);
      left: calc(50% - 37.5px);
      & > img {
        width: 65px;
        height: 65px;
      }
    }
    &-count {
      position: absolute;
      bottom: 2px;
      right: 28px;
      color: #fff;
    }
  }
}

.dialog-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.26);
}
.dialog-video-full {
  opacity: 1 !important;
  width: 38.5% !important;
  height: 45% !important;
  position: absolute !important;
  top: 27.5% !important;
  left: 30.78% !important;
  background: #3d4050 !important;
  border-radius: 2px !important;
}

.dialog-video-full-title {
  position: absolute !important;
  width: 100%;
  height: 50px;
  padding: 16px;
  left: 0 !important;
  top: 0 !important;
  color: #fff !important;
  display: flex;
  justify-content: space-between;
}

.dialog-video-full-title > i {
  display: inline-block;
  height: 15px;
  width: 15px;
  z-index: 4000;
}
.toBigger {
  position: absolute;
  bottom: 7px;
  right: 2px;
  width: 17px;
  height: 17px;
}
#video {
  width: 100%;
  object-fit: fill;
}
</style>
