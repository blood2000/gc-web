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
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.label"
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
              >
                查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="play-back-search" v-show="isResult">
      <div class="play-back-search-title">查询结果：</div>
      <div :class="isbigger ? 'dialog-video' : ''" @click="colse">
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
            <i class="el-icon-close" @click.stop="colse"></i>
          </div>
          <video
            id="video"
            ref="video"
            width="100%"
            height="100%"
            poster="../../../assets/images/RVC/video.png"
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

    <!-- <div class="dialog-video" @click="isShow = false" v-if="isShow">
      <div class="dialog-video-full" @click.stop="">
        <div class="dialog-video-full-title">
          {{ getTypes() }}
        </div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer1"
          name="videoPlayer1"
          id="video1"
          :playsinline="true"
          :options="playerOptions"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
          @ended="onPlayerEnded($event)"
          @statechanged="playerStateChanged($event)"
          @canplaythrough="onPlayerCanplaythrough($event)"
          @ready="playerReadied"
        ></video-player>
      </div>
    </div> -->
  </div>
</template>
<script>
import { getTimeRange } from "@/utils/timeRange";
import { typeList } from "./config";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";

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
        CHANNEL: 1, //通道号
        VEHICLEID: "0", ////车辆ID
        VEHICLELICENSE: "91750", //车牌号
        DEVICENO: "015800091750", //设备编码
        PLATECOLOR: "2", //车牌颜色
        STREAMTYPE: "1", //主/子码流
      },
      playTime: "",
      current: "",
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // sources: [
        //   {
        //     type: "video/mp4", // 类型
        //     src: require("@/assets/mp4/【2048】202104271143janv2_2021429115831.mp4"), // url地址
        //   },
        // ],
        poster: "../../../assets/images/RVC/video.png", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      videoUrl: {},
      isResult: false,
      wfs: null,
      currTimes: 0,
      totalTime: 0,
      ttTime: 0,
      isbigger: false,
    };
  },
  mounted() {
    // this.queryParams.dateRange = [1635580507000, 1635586507000];
    this.timeUpdate();
  },
  methods: {
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
      let result = "";
      for (const item of this.typeList) {
        if (item.value == this.queryParams.CHANNEL) {
          result = item.label;
        }
      }
      return result;
    },
    // 关闭视频
    colse() {
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
      this.wfs = null;
      console.log("表单", this.queryParams);
      const video = document.getElementById("video");
      const queryParams = this.queryParams;
      console.log("queryParams.dateRange", queryParams.dateRange);
      if (!queryParams || queryParams.dateRange.length !== 2) return;
      const startTime = parseInt(queryParams.dateRange[0].getTime() / 1000);
      const endTime = parseInt(queryParams.dateRange[1].getTime() / 1000);
      // const startTime = parseInt(queryParams.dateRange[0] / 1000);
      // const endTime = parseInt(queryParams.dateRange[1] / 1000);
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
      video.poster = "../../../assets/images/RVC/timg.gif";
      this.wfs.attachMedia(video, [wfsObj, player, userInfo]);
    },
    // // 播放回调
    // onPlayerPlay(player) {
    //   console.log("player play!", player);
    // },

    // // 暂停回调
    // onPlayerPause(player) {
    //   console.log("player pause!", player);
    // },

    // // 视频播完回调
    // onPlayerEnded($event) {
    //   console.log(player);
    // },
    // // DOM元素上的readyState更改导致播放停止
    // onPlayerWaiting(player) {
    //   let time = localStorage.getItem("cacheTime");
    //   if (player.cache_.currentTime - Number(time) > 0.1) {
    //     this.current = Number(time);
    //     this.playerReadied(player);
    //   } else {
    //     this.current = player.cache_.currentTime;
    //   }
    // },

    // // 已开始播放回调
    // onPlayerPlaying($event) {
    //   // console.log(player)
    // },

    // // 当播放器在当前播放位置下载数据时触发
    // onPlayerLoadeddata($event) {
    //   // console.log(player)
    // },

    // // // 当前播放位置发生变化时触发。
    // onPlayerTimeupdate(player) {
    //   this.playTime = player.cache_.currentTime;
    //   let playTime = player.cache_.currentTime;
    //   setTimeout(function () {
    //     localStorage.setItem("cacheTime", playTime);
    //   }, 500);

    //   let time = localStorage.getItem("cacheTime");
    //   if (player.cache_.currentTime - Number(time) > 2) {
    //     this.current = Number(time);
    //     this.playerReadied(player);
    //   } else {
    //     this.current = player.cache_.currentTime;
    //   }
    // },

    // //媒体的readyState为HAVE_FUTURE_DATA或更高
    // onPlayerCanplay(player) {
    //   // console.log('player Canplay!', player)
    // },

    // //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    // onPlayerCanplaythrough(player) {
    //   // console.log('player Canplaythrough!', player)
    // },

    // //播放状态改变回调
    // playerStateChanged(playerCurrentState) {
    //   // console.log('player current update state', playerCurrentState)
    // },

    // //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    // playerReadied(player) {
    //   // console.log('example player 1 readied', player);
    //   player.currentTime(this.current);
    // },
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
  &-title {
    position: absolute;
    top: 0;
    left: 0;
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
  &-full {
    opacity: 1 !important;
    width: 54% !important;
    height: 45% !important;
    position: absolute !important;
    top: 20% !important;
    left: 25% !important;
    background: #3d4050 !important;
    border-radius: 2px !important;
    &-title {
      position: absolute !important;
      width: 100%;
      height: 50px;
      padding: 16px;
      left: 0 !important;
      top: 0 !important;
      color: #fff !important;
      display: flex;
      justify-content: space-between;
      & > i {
        display: inline-block;
        height: 15px;
        width: 15px;
        z-index: 4000;
      }
    }
  }
}

.toBigger {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 17px;
  height: 17px;
}

.vjs-custom-skin > .video-js .vjs-big-play-button {
  background-color: rgba(0, 0, 0, 0.45);
  font-size: 3em;
  /* border-radius: 50%; */
  height: 1.5em !important;
  line-height: 1.5em !important;
  margin-top: -1em !important;
}
/*这里用了第三方vue-video-player插件，但这个插件有bug，设置globalSetting:{controls:true}隐藏进度条不生效，故可设置插件样式进行隐藏vjs-progress-contro*/
.vjs-progress-control {
  /*visibility:hidden;       // 隐藏进度条*/
}
</style>