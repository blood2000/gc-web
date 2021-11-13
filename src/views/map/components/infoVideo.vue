<template>
  <div class="dialog-video" v-if="show" @click="colse">
    <div class="dialog-video-full" @click.stop="">
      <div class="dialog-video-full-title">
        {{ options.typeName }}
        <i class="el-icon-close" @click.stop="colse"></i>
      </div>
      <div class="dialog-video-full-play" v-show="isPlay" @click="play">
        <img src="../../../assets/images/detail/play-back-play.png" alt="" />
      </div>
      <video
        id="video"
        width="100%"
        height="100%"
        poster="../../../utils/RVC/img/video-img.png"
        autoplay
        muted
      ></video>
    </div>
  </div>
</template>
<script>
export default {
  watch: {
    show() {
      if (this.show) {
        setTimeout(() => {
          const video = document.getElementById("video");
          console.log("video id", video);
          const options = this.options;
          console.log("打开视频列表", options);
          this.OpenVideo(
            video,
            options.VEHICLEID,
            options.CHANNEL,
            options.VEHICLELICENSE,
            options.DEVICENO,
            options.PLATECOLOR,
            options.STREAMTYPE
          );
        }, 200);
      }
    },
  },
  props: {
    show: {
      type: Boolean,
      default: null,
    },
    userId: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      isPlay: false,
      wfs: null,
    };
  },
  mounted() {},
  methods: {
    //打开视频
    OpenVideo(
      video,
      vehicleId,
      channel,
      vehiclelicense,
      deviceno,
      platecolor,
      streamtype
    )
     {
         console.log('init',this.wfs)
      if (this.wfs != null) return;
      const MSGID = 0xf003;
      this.wfs = new Wfs();
      console.log("wfs 2", this.wfs);
      const wfsObj = {
          PLATECOLOR: platecolor,
          DEVICETYPE: 0xd000,
          VEHICLEID: vehicleId,
          CHANNEL: channel,
          VEHICLELICENSE: vehiclelicense,
          DEVICENO: deviceno,
          STREAMTYPE: streamtype,
          DATATYPE: 0,
          RECORDFLAG: 0,
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
      console.log("poster", video);
      video.poster = require( "../../../utils/RVC/img/timg.gif");
      console.log("video.poster", video.poster);
      this.wfs.attachMedia(video, [wfsObj, player, userInfo]);
    },
    // 关闭视频
    colse() {
        const me = this
      console.log("11111");
      const options = me.options
      me.CloseVideo(
          me.wfs,
          options.VEHICLEID,
          options.CHANNEL,
          options.VEHICLELICENSE,
          options.DEVICENO,
          options.PLATECOLOR
          )
          setTimeout(()=>{
              me.wfs = null
              console.log('执行了')
          },500)
      me.$emit("colseVideoDialog");
      
    },
    CloseVideo(
      wfsObj,
      vehicleId,
      channel,
      vehiclelicense,
      deviceno,
      platecolor
    ) {
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
      console.log('wfsObj',wfsObj)
      wfsObj.websocketLoader.client.send(
        JSON.stringify({
          HEAD: { MSGID: MSGID, USERID: this.userId, TRANSNO: 0 },
          PARAM: closeObj,
        })
      );
      wfsObj.media.poster = "../../../assets/images/RVC/video.png";
      wfsObj.media.src = "";

      wfsObj.websocketLoader.client.close();
    },
    play() {},
  },
};
</script>
<style lang="scss" scoped>
.dialog-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.26);
  &-full {
    opacity: 1;
    width: 44.5%;
    height: 50%;
    position: absolute;
    top: 20%;
    left: 22%;
    background: #3d4050;
    border-radius: 2px;
    border-radius: 2px;
    &-title {
      position: absolute;
      font-family: PingFang SC;
      height: 40px;
      width: 100%;
      left: 0;
      top: 0;
      padding: 16px;
      color: #fff;
      & > i {
        position: absolute;
        right: 16px;
        top: 16px;
        display: inline-block;
        width: 20px;
        height: 20px;
        color: #fff;
        z-index: 4000;
      }
    }
    &-play {
      position: absolute;
      top: calc(50% - 30px);
      left: calc(50% - 30px);
      width: 60px;
      height: 60px;
    }
  }
}
#video{
    width: 100%; 
    object-fit:fill; 
}
</style>