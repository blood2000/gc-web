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
                :picker-options="pickerOptions"
                type="datetimerange"
                size="small"
                style="width: 348px"
                value-format="yyyy-MM-dd HH:mm"
                range-separator="-"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否停运" prop="type">
              <el-select
                v-model="queryParams.type"
                clearable
                filterable
                style="width: 348px"
                placeholder="请选择是否启用"
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
    <div class="play-back-search">
      <div class="play-back-search-title">查询结果：</div>
      <div class="play-back-search-result">
        <div class="play-back-search-result-play" @click="handleVideo">
          <img src="../../../assets/images/detail/play-back-play.png" alt="" />
        </div>
      </div>
    </div>

    <div class="dialog-video" @click="isShow = false" v-if="isShow">
      <div class="dialog-video-full" @click.stop="">
        <div class="dialog-video-full-title">
          {{ getTypes() }}
        </div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          name="videoPlayer"
          id="video"
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
    </div>
  </div>
</template>
<script>
import { pickerOptions } from "@/utils/dateRange";
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
      pickerOptions,
      typeList,
      isShow: false,
      queryParams: {
        dateRange: [],
        type: 0,
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
        sources: [
          {
            type: "video/mp4", // 类型
            src: require("@/assets/mp4/【2048】202104271143janv2_2021429115831.mp4"), // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      videoUrl: {},
    };
  },
  methods: {
    getTypes() {
      let result = "";
      for (const item of this.typeList) {
        if (item.value == this.queryParams.type) {
          result = item.label;
        }
      }
      return result;
    },
    handleVideo() {
      this.isShow = true;
    },
    searchResult() {
      console.log("表单", this.queryParams);
    },
    // 播放回调
    onPlayerPlay(player) {
      player.stopPropagation();
      console.log("player play!", player);
    },

    // 暂停回调
    onPlayerPause(player) {
      console.log("player pause!", player);
    },

    // 视频播完回调
    onPlayerEnded($event) {
      console.log(player);
    },
    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      let time = localStorage.getItem("cacheTime");
      if (player.cache_.currentTime - Number(time) > 0.1) {
        this.current = Number(time);
        this.playerReadied(player);
      } else {
        this.current = player.cache_.currentTime;
      }
    },

    // 已开始播放回调
    onPlayerPlaying($event) {
      // console.log(player)
    },

    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata($event) {
      // console.log(player)
    },

    // // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      this.playTime = player.cache_.currentTime;
      let playTime = player.cache_.currentTime;
      setTimeout(function () {
        localStorage.setItem("cacheTime", playTime);
      }, 500);

      let time = localStorage.getItem("cacheTime");
      if (player.cache_.currentTime - Number(time) > 2) {
        this.current = Number(time);
        this.playerReadied(player);
      } else {
        this.current = player.cache_.currentTime;
      }
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    //播放状态改变回调
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      // console.log('example player 1 readied', player);
      player.currentTime(this.current);
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
  &-title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: #3d4050;
    margin-bottom: 7px;
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
    width: 54%;
    // height: 60%;
    position: absolute;
    top: 20%;
    left: 25%;
    background: #3d4050;
    border-radius: 2px;
    &-title {
      position: absolute;
      left: 28px;
      top: 18px;
      color: #fff;
    }
  }
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