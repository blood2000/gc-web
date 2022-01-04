<template>
  <div>
    <div class="play-back-search" v-show="isShowVideo">
      <!--        <div class="play-back-search-title">查询结果：</div>-->
      <div :class="isbigger ? 'dialog-video' : ''">
        <div
          class="play-back-search-result"
          :class="isbigger ? 'dialog-video-full' : ''"
          @click.stop=""
        >
          <div class="dialog-video-full-title">
            <span>{{ isbigger ? getTypes() : '' }}</span>
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
          <!--          <div class="play-back-search-result-count">-->
          <!--            {{ `${this.currTimes}/${this.totalTime}` }}-->
          <!--          </div>-->
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
    <div class="play-back-right" :class="{ 'show-video': isShowVideo }">
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
                  popper-class="playback-create-time-date-picker-popper"
                  v-model="queryParams.dateRange"
                  unlink-panels
                  type="datetimerange"
                  size="small"
                  align="left"
                  style="width: 348px"
                  range-separator="-"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="选择摄像头：" prop="CHANNEL">
                <!-- <el-select
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
                </el-select> -->
                <el-row style="width: 348px">
                  <el-col
                    :span="12"
                    v-for="(item, index) in channelNumList"
                    :key="item.key"
                    class="channelNum-box"
                   
                    :style="{ 'margin-right': index % 2 == 0 ? '12px' : '0' }"
                    :class="
                      index + 1 == queryParams.CHANNEL
                        ? 'channelNum-active'
                        : ''
                    "
                    
                  >
                   <div   @click="channelNums(item)">
                     {{ item.key }}</div> </el-col
                  >
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="play-back-form-btn">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="deviceFileList"
                  :disabled="
                    channelNumList.length == 0 ||
                    !queryParams.dateRange ||
                    queryParams.dateRange.length == 0 ||
                    !queryParams.CHANNEL
                  "
                >
                  查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="play-back-bottom" v-show="isShowFileList">
      <ul class="play-back-bottom__tab ly-flex-pack-start ly-flex-align-end">
        <li class="active">录像文件</li>
      </ul>
      <div class="play-back-bottom__content ly-flex-pack-justify">
        <el-table
          class="play-back-file-table"
          :data="fileList"
          v-loading="isLoadingFileList"
          style="background: transparent"
          size="mini"
          height="260px"
        >
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="开始时间"
            prop="startTimeStr"
          ></el-table-column>
          <el-table-column label="结束时间" prop="endTimeStr"></el-table-column>
          <el-table-column label="文件大小" prop="SIZESTR"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="openRecordingVideo(scope.row)"
                >播放</el-button
              >
              <el-button
                v-if="!scope.row.HTTPPATH"
                :disabled="scope.row.isDownloadingToCenter"
                type="text"
                size="mini"
                @click="downloadVideoCenter(scope.row)"
              >
                <template v-if="scope.row.isDownloadingToCenter"
                  >视频处理中<i class="el-icon-loading"></i
                ></template>
                <template v-else>下载</template>
              </el-button>
              <el-button
                v-else
                type="text"
                size="mini"
                @click="downloadFile(scope.row.HTTPPATH)"
                >处理完成</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
import { parseTime } from "../../../utils/ruoyi";

let websocket = null;

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
      isShowVideo: false,
      isShowFileList: false,
      isLoadingFileList: false,
      fileList: [],
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
    this.initSocket();
  },
  beforeDestroy() {
    console.log("推出播放");
    if (this.wfs) {
      this.colse();
    }
  },
  computed: {},
  methods: {
    channelNums(item) {
      console.log('fasdfa',item);
      this.queryParams.CHANNEL = item.value
      // this.$set( this.queryParams, key, value )
    },
    downloadFile(url) {
      const elink = document.createElement("a");
      elink.download = "test.mp4";
      elink.style.display = "none";
      elink.target = "_blank";
      elink.href = url;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    },
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
    initSocket() {
      return new Promise((resolve, reject) => {
        if (websocket == null || websocket.readyState !== WebSocket.OPEN) {
          const websocketIP = "219.134.190.133:6003"; //媒体服务ip
          websocket = new WebSocket("ws://" + websocketIP); //获取文件列表websocket对象
          websocket.onclose = function () {
            console.log("onclose", arguments);
            websocket = null;
          };
          websocket.onerror = function () {
            console.log("onerror", arguments);
            reject();
          };
          websocket.onopen = function () {
            resolve();
            console.log("onopen", arguments);
          };
        } else {
          websocket.onmessage = this.onSocketMessage;
          resolve();
        }
      });
    },
    onSocketMessage(event) {
      console.log("event", event);
      let jsonData = JSON.parse(event.data);
      var msgid = jsonData.HEAD.MSGID;
      switch (msgid) {
        case 5: {
          let itemList = jsonData.PARAM.ITEMLIST;
          itemList.forEach((item) => {
            item.startTimeStr = parseTime(item.STARTTIME * 1000);
            item.endTimeStr = parseTime(item.ENDTIME * 1000);
            item.HTTPPATH = null;
            item.isDownloadingToCenter = false;
          });
          this.fileList = itemList;
          this.isLoadingFileList = false;
          this.serviceFileList(); // 请求服务器路径
          console.log(itemList);
          //设备文件列表
          // document.forms["formId"].output += event.data + "\n";
          break;
        }
        case 11: // 赋值中心文件播放地址
          let itemList = jsonData.PARAM.ITEMLIST;
          itemList.forEach((item) => {
            let fileInfo = this.fileList.find(
              (file) =>
                file.STARTTIME === item.STARTTIME &&
                file.ENDTIME === item.ENDTIME
            );
            fileInfo.HTTPPATH = item["HTTPPATH"];
          });
          break;
        case 10: //下载完成
          this.serviceFileList(); // 请求服务器路径
          //window.open(JSON.parse(event.data).PARAM.HTTPPATH);//下载h264文件
          // alert("下载完成");
          break;
      }
      //console.log(event.data);
      //setMessageInnerHTML(event.data);
    },
    deviceFileList() {
      const startTime =
        parseInt(this.queryParams.dateRange[0].getTime() / 1000) + "";
      const endTime =
        parseInt(this.queryParams.dateRange[1].getTime() / 1000) + "";
      var wfsObj = {
        VEHICLEID: this.queryParams.VEHICLEID,
        VEHICLELICENSE: this.queryParams.VEHICLELICENSE,
        PLATECOLOR: this.queryParams.PLATECOLOR,
        DEVICENO: this.queryParams.DEVICENO,
        DEVICETYPE: 0xd000,
        RECORDTYPE: 0,
        DATATYPE: 0,
        ALARMTYPE: 0,
        CHANNEL: this.queryParams.CHANNEL,
        STORAGE: 1,
        STARTTIME: startTime,
        ENDTIME: endTime,
      };
      this.isShowFileList = true;
      this.isLoadingFileList = true;
      this.initSocket()
        .then(() => {
          websocket.send(
            JSON.stringify({
              HEAD: { MSGID: 0xf005, USERID: 1, TRANSNO: 0 },
              PARAM: wfsObj,
            })
          );
        })
        .catch(() => {
          this.msgError("连接失败");
          this.isShowFileList = false;
          this.isLoadingFileList = false;
        });
    },
    serviceFileList() {
      const startTime =
        parseInt(this.queryParams.dateRange[0].getTime() / 1000) + "";
      const endTime =
        parseInt(this.queryParams.dateRange[1].getTime() / 1000) + "";
      let wfsObj = {
        VEHICLEID: this.queryParams.VEHICLEID,
        VEHICLELICENSE: this.queryParams.VEHICLELICENSE,
        PLATECOLOR: this.queryParams.PLATECOLOR,
        DEVICENO: this.queryParams.DEVICENO,
        DEVICETYPE: 0xd000,
        CHANNEL: this.queryParams.CHANNEL,
        STARTTIME: startTime,
        ENDTIME: endTime,
      };
      websocket.send(
        JSON.stringify({
          HEAD: { MSGID: 0xf00b, USERID: 1, TRANSNO: 0 },
          PARAM: wfsObj,
        })
      );
    },
    downloadVideoCenter(row) {
      row.isDownloadingToCenter = true;
      let wfsObj = {
        VEHICLEID: this.queryParams.VEHICLEID,
        VEHICLELICENSE: this.queryParams.VEHICLELICENSE,
        PLATECOLOR: this.queryParams.PLATECOLOR,
        DEVICENO: this.queryParams.DEVICENO,
        DEVICETYPE: 0xd000,
        RECORDTYPE: 0,
        DATATYPE: 2,
        ALARMTYPE: 0,
        CHANNEL: this.queryParams.CHANNEL,
        STORAGE: 1,
        STARTTIME: row.STARTTIME,
        ENDTIME: row.ENDTIME,
        EXECUTEON: 0,
      };
      websocket.send(
        JSON.stringify({
          HEAD: { MSGID: 0xf00a, USERID: 1, TRANSNO: 0 },
          PARAM: wfsObj,
        })
      );
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
          console.log("playback res", res);
          this.queryParams.VEHICLELICENSE =
            res.data.vehicle && res.data.vehicle.plateNumber;
          this.queryParams.DEVICENO =
            res.data.device && res.data.device.deviceSN;
          // this.queryParams.DEVICENO = '016200116989'
          // this.queryParams.DEVICENO = '015800117661'
          const fields = res.data.fields;
          console.log("通道", fields.channelNum);
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
      return `通道 ${this.queryParams.CHANNEL}`;
    },
    // 关闭视频
    hanleScale() {
      if (this.isbigger) {
        this.isbigger = false;
      } else {
        this.colse(() => {
          this.isShowVideo = false
        })
      }
    },
    //获取视频的总时长
    getDuration() {
      const refVideo = this.$refs.video;
      console.log("refVideo", refVideo, refVideo.duration);
      this.totalTime = this.durationTrans(parseInt(refVideo.duration));
      // var hour = parseInt((refVideo.duration) / 3600);
      //               if (hour<10) {
      //                   hour = "0" + hour;
      //               }
      //               var minute = parseInt((refVideo.duration % 3600) / 60);
      //               if (minute<10) {
      //                   minute = "0" + minute;
      //               }
      //               var second = Math.ceil(refVideo.duration % 60);
      //               if (second<10) {
      //                   second = "0" + second;
      //               }
      //               var filetime = hour + ":" + minute + ":" + second;
      //               console.log('测试结果至',filetime)
      // console.log("getDuration", this.totalTime);
    },
    openRecordingVideo(row) {
      this.colse(() => {
        this.wfs = new Wfs();
        let wfsObj = {
          VEHICLEID: this.queryParams.VEHICLEID,
          VEHICLELICENSE: this.queryParams.VEHICLELICENSE,
          PLATECOLOR: this.queryParams.PLATECOLOR,
          DEVICENO: this.queryParams.DEVICENO,
          DEVICETYPE: 0xd000,
          DOWNLOAD: 0,
          CHANNEL: this.queryParams.CHANNEL,
          STORAGE: 0,
          VIDEOTYPE: 0,
          STREAMTYPE: 2,
          PLAYBACKTYPE: 0,
          MULTIPLE: 0,
          STARTTIME: row.STARTTIME,
          ENDTIME: row.ENDTIME,
        };
        let player = new PCMPlayer({
          encoding: "16bitInt",
          channels: 1,
          sampleRate: 8000,
          flushingTime: 1000,
        });
        const video = document.getElementById("video");
        video.poster = require("../../../utils/RVC/img/timg.gif");
        this.wfs.attachMedia(video, [
          wfsObj,
          player,
          { MSGID: 0xf006, userId: "1" },
        ]);
        this.isShowVideo = true;
      });
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
<style>
.play-back-file-table .el-table--mini th,
.el-table--mini td {
  padding: 1px 0;
}
.playback-create-time-date-picker-popper {
  margin-right: 40px;
}
</style>
<style lang="scss" scoped>
.play-back-bottom {
  $tab-height: 44px;
  transition: height 0.3s;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  pointer-events: all;

  &__tab {
    position: absolute;
    left: 0;
    top: calc(-#{$tab-height});
    height: 44px;
    z-index: 0;

    > li {
      padding: 0 30px;
      height: 38px;
      background: #e3e7f0;
      border-radius: 6px 6px 0 0;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 700;
      line-height: 38px;
      color: #8592ad;
      cursor: pointer;
      text-align: center;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
      transition: height 0.4s;
      margin-right: 8px;

      &.active {
        color: #3d4050;
        height: $tab-height;
        font-weight: 700;
        line-height: 44px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 6px -2px 10px rgba(0, 0, 0, 0.1);
      }
    }
  }

  &__content {
    position: relative;
    height: 100%;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    //background: rgba(255, 255, 255, 0.72);
    background: white;
    opacity: 0.85;
    border-radius: 0 8px 8px 8px;
    padding: 20px 12px 6px 12px;
    overflow: hidden;
  }
}
.play-back-right {
  box-sizing: border-box;
  height: 390px;
  width: 380px;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
  opacity: 0.85;
  border-radius: 6px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  pointer-events: all;
}
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
  height: 390px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 6px;
  margin-right: 10px;
  //border-top: 1px solid #dce3e9;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
  padding: 20px 16px 16px 16px;
  width: 656px;
  right: 380px;
  pointer-events: all;
  position: absolute;
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
    width: 623px;
    height: 350px;
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
      bottom: 6px;
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
  z-index: 300;
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
  z-index: 400;
}
.toBigger {
  position: absolute;
  bottom: 7px;
  right: 2px;
  width: 17px;
  height: 17px;
}
.downloadBtn {
  position: absolute;
  bottom: 7px;
  right: 25px;
  width: 17px;
  height: 17px;
}
#video {
  width: 100%;
  object-fit: fill;
}
.channelNum-box {
  width: 168px;
  height: 36px;
  border: 1px solid #e4ecf4;
  border-radius: 4px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #3d4050;
  cursor: pointer;
}
.channelNum-active {
  background: rgba(70, 130, 250, 0.2);
  border: 1px solid #4682fa;
  font-weight: bold;
  color: #4682fa;
}
</style>
