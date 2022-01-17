<template>
  <div class="stealing-coal-detail">
    <div id="stealing-coal-detail-map" class="stealing-coal-detail-map"></div>
    <div class="stealing-coal-detail-info">
      <div class="stealing-coal-detail-info-title">预警详情</div>
      <div class="stealing-coal-card" :class="['level-3']" @click="$emit('click')">
        <div class="stealing-coal-card-title"></div>
        <div class="stealing-coal-card-time">2021-03-04 22:23:12</div>
        <div class="stealing-coal-card-content">
          <div class="stealing-coal-card-content-car">
            <span class="stealing-coal-card-content-car-id">0001</span>
            闽A54772
          </div>
          <div class="stealing-coal-card-address">车辆在 16:26 发生路线偏离，并在 3 分钟后超时停留，且在 5 分
            钟后载重异常。在时间区间内发生预警。</div>
        </div>
      </div>
      <div class="stealing-coal-detail-warn-content">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">相关告警</div>
        <div style="font-size: 14px; text-indent: 20px;">2022-01-10</div>
        <div class="warn-item">
          <div class="warn-item-time">13:46:58</div>
          <div class="warn-item-timeline"></div>
          <div class="warn-item-content">
            <div class="warn-item-content-title">载重异常告警</div>
            <div class="warn-item-content-address">河南省平顶山市湛河区荆山街道润建 代维公司驻点(黄河路29号北239米)</div>
            <div class="warn-item-content-desc">载重异常减少 1 吨</div>
            <div class="warn-item-content-video" @click="playVideo()"></div>
          </div>
        </div>
        <div class="warn-item">
          <div class="warn-item-time">13:46:58</div>
          <div class="warn-item-timeline"></div>
          <div class="warn-item-content">
            <div class="warn-item-content-title">路线偏离告警</div>
            <div class="warn-item-content-address">河南省平顶山市湛河区荆山街道润建 代维公司驻点(黄河路29号北239米)</div>
            <div class="warn-item-content-route">这里写的是路径名称</div>
            <div class="warn-item-content-desc">车辆偏离规划路径 650 米，偏离时长 6 分钟。</div>
            <div class="warn-item-content-video"></div>
          </div>
        </div>
        <div class="warn-item">
          <div class="warn-item-time">13:46:58</div>
          <div class="warn-item-timeline no-line"></div>
          <div class="warn-item-content">
            <div class="warn-item-content-title">停留超时告警</div>
            <div class="warn-item-content-address">河南省平顶山市湛河区荆山街道润建 代维公司驻点(黄河路29号北239米)</div>
<!--            <div class="warn-item-content-route">这里写的是路径名称</div>-->
            <div class="warn-item-content-desc">车辆偏离规划路径 650 米，偏离时长 6 分钟。</div>
<!--            <div class="warn-item-content-video"></div>-->
          </div>
        </div>
      </div>
      <div v-show="isShowVideo" class="stealing-coal-detail-video-wrap">
        <div class="stealing-coal-detail-video-wrap-content">
          <div class="video-list">
            <span v-for="(warnVideo, index) in warnVideoList"
                  :class="{'on': curPlayVideItem === warnVideo}" @click="playVideo(warnVideo)">{{warnVideo.name}}</span>
<!--            <span class="on">载重异常告警</span>-->
<!--            <span>路线偏离告警</span>-->
<!--            <span>超时停留告警</span>-->
          </div>
          <div class="video-close" @click="isShowVideo = false, colse()"></div>
          <video id="video"
                 ref="video"
                 width="100%"
                 height="100%"
                 :poster="require('../../../../utils/RVC/img/video-img.png')"
                 autoplay
                 muted></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {testRoute} from "./testData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import App from "../../../../App";

export default {
  name: "StealingCoalWarnDetail",
  data () {
    return {
      isShowVideo: false,
      map: null,
      wfs: null,
      warnVideoList: [
        {name: '载重异常告警', STARTTIME: 1642385435, ENDTIME: 1642385555},
        {name: '路线偏离告警', STARTTIME: 1642386155, ENDTIME: 1642386335},
        {name: '超时停留告警', STARTTIME: 1642386995, ENDTIME: 1642387175},
      ],
      curPlayVideItem: null,
      videoParam: {
        VEHICLEID: "0",
        VEHICLELICENSE: "粤A4DX40",
        DEVICENO: '016200116989',
        // DEVICENO: "015800117661",
        PLATECOLOR: "2",
        CHANNEL: "1"
      }
    }
  },
  mounted() {
    setTimeout(this.initMap, 1000)
  },
  destroyed() {
    this.close()
  },
  methods: {
    playVideo (item) {
      if (!item) item = this.warnVideoList[0]
      this.curPlayVideItem = item
      this.isShowVideo = true
      // let row = {
      //   STARTTIME: 1642349435,
      //   ENDTIME: 1642349734
      // }
      this.openRecordingVideo(item)
    },
    openRecordingVideo(row) {
      let vm = this
      this.colse(() => {
        this.wfs = new Wfs();
        let wfsObj = {
          VEHICLEID: vm.videoParam.VEHICLEID,
          VEHICLELICENSE: vm.videoParam.VEHICLELICENSE,
          PLATECOLOR: vm.videoParam.PLATECOLOR,
          DEVICENO: vm.videoParam.DEVICENO,
          DEVICETYPE: 0xd000,
          DOWNLOAD: 0,
          CHANNEL: vm.videoParam.CHANNEL,
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
        video.poster = require("../../../../utils/RVC/img/timg.gif");
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
        const options = me.videoParam;
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
          callback && callback();
        }, 100);
      } else {
        callback && callback();
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
      wfsObj.media.poster = "../../../../assets/images/RVC/video.png";
      wfsObj.media.src = "";
      console.log("CloseVideo end", wfsObj.websocketLoader.client);
      wfsObj.websocketLoader.client.close();
    },
    initMap () {
      let vm = this
      this.map = new AMap.Map("stealing-coal-detail-map", {
        mapStyle: "amap://styles/2fe468ae95b55caa76404a537353e63a", //设置地图的显示样式
        resizeEnable: true,
        autoFitView: true,
        // center: [116.303843, 39.983412],
        center: [116.407535, 39.915822],
        zoom: 11,
      })
      // https://lbs.amap.com/api/amap-ui/reference-amap-ui/mass-data/pathsimplifier/#render
      AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
        vm.pathSimplifierIns = new PathSimplifier({
          zIndex: 101,
          map: vm.map, //所属的地图实例
          autoSetFitView: true,
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            return ''
          },
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: "#4682FA",
              lineWidth: 6,
              dirArrowStyle: false,
            },
            pathLineHoverStyle: null,
            pathLineSelectedStyle: {
              strokeStyle: "#4682FA",
              lineWidth: 6,
              dirArrowStyle: false,
            },
            startPointStyle: null,
            endPointStyle: null,
            renderAllPointsIfNumberBelow: -1, // 绘制路线节点，如不需要可设置为-1
          }
        })
        vm.pathSimplifierIns2 = new PathSimplifier({
          zIndex: 100,
          map: vm.map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            let point = pathData.path[pointIndex]
            if (!point) return
            return `point=${point[0]},${point[1]}`
          },
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: "#EF6969",
              lineWidth: 6,
              dirArrowStyle: false,
            },
            pathLineHoverStyle: null,
            pathLineSelectedStyle: {
              strokeStyle: "#EF6969",
              lineWidth: 6,
              dirArrowStyle: false,
            },
            startPointStyle: null,
            endPointStyle: null,
            renderAllPointsIfNumberBelow: -1, // 绘制路线节点，如不需要可设置为-1
          }
        })
        vm.setPathData()
      })
    },
    makeWarnMarker (img, lng, lat) {
      const markerContent = `<div style="position: relative; width: 80px; height: 80px;">
<span style="position:absolute; left: 33px; bottom: -7px;display: block;background-color: white; border: solid #EF6969 5px; border-radius: 50%; width: 15px; height: 15px;"></span>
<img style="width: 80px; height: 80px;" src="${img}"></div>`
      let marker = new AMap.Marker({
        position: [lng, lat],
        content: markerContent,
        offset: new AMap.Pixel(-40, -80)
      })
      this.map.add(marker)
      return marker
    },
    setPathData () {
      let planPath = testRoute.planPath.map(item => [item.lng, item.lat])
      let realPath = testRoute.realPath.map(item => [item.lng, item.lat])
      this.pathSimplifierIns.setData([
        {
          name: '规划路径',
          path: planPath
        }
      ])
      this.pathSimplifierIns2.setData([
        {
          name: '行驶路径',
          path: realPath
        }
      ])
      let pointStartImage = require('../../../../assets/images/stealingcoal/point-start.png')
      let pointEndImage = require('../../../../assets/images/stealingcoal/point-end.png')
      let startMarker = new AMap.Marker({
        // position: new AMap.LngLat(realPath[0][0], realPath[1][1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        position: realPath[0],
        icon: pointStartImage,
        draggable: false,
        offset: new AMap.Pixel(-45, -45)
      })
      let lastPoint = realPath[realPath.length - 1]
      let endMarker = new AMap.Marker({
        // position: new AMap.LngLat(lastPoint[0], lastPoint[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        position: lastPoint,
        icon: pointEndImage,
        draggable: false,
        offset: new AMap.Pixel(-45, -45)
      })
      this.map.add(startMarker)
      this.map.add(endMarker)

      // 告警位置
      let level1WarnImage = require('../../../../assets/images/stealingcoal/map-warn-1.png')
      this.makeWarnMarker(level1WarnImage, 119.331671, 26.052947)

      let level2WarnImage = require('../../../../assets/images/stealingcoal/map-warn-2.png')
      this.makeWarnMarker(level2WarnImage, 119.332565, 26.053628)

      let level3WarnImage = require('../../../../assets/images/stealingcoal/map-warn-3.png')
      this.makeWarnMarker(level3WarnImage, 119.333993, 26.053789)
    }
  }
}
</script>

<style lang="scss" scoped>
.warn-item {
  display: flex;
  color: #3D4050;
  font-size: 14px;
  &-time {
    flex: none;
    width: 90px;
    text-align: right;
    font-weight: bold;
  }
  &-timeline {
    width: 1px;
    margin: 20px 25px 10px 20px;
    border-left: dotted 2px #C9CFDB;
    position: relative;
    &::before {
      content: '';
      background: url("../../../../assets/images/stealingcoal/alert.png") no-repeat;
      width: 18px;
      height: 18px;
      position: absolute;
      left: -9px;
      top: -23px;
    }
  }
  &-timeline.no-line {
    border-left: dotted 2px #F6F9FC;
  }
  &-content {
    //flex: 1;
    //width: 244px;
    margin-bottom: 15px;
    &-title {
      font-weight: bold;
    }
    &-address {
      margin: 10px 0 10px 25px;
      position: relative;
      &::before {
        content: '';
        background: url("../../../../assets/images/stealingcoal/address.png") no-repeat;
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        left: -25px;
        top: 2px;
      }
    }
    &-desc {
      margin: 10px 0 10px 25px;
      color: #EF6969;
      position: relative;
      &::before {
        content: '';
        background: url("../../../../assets/images/stealingcoal/warn.png") no-repeat;
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        left: -25px;
        top: 2px;
      }
    }
    &-video {
      background: url("../../../../assets/images/stealingcoal/warn-item-video.png") no-repeat;
      width: 244px;
      height: 137px;
    }
    &-route {
      margin: 10px 0 10px 25px;
      position: relative;
      &::before {
        content: '';
        background: url("../../../../assets/images/stealingcoal/route.png") no-repeat;
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        left: -25px;
        top: 2px;
      }
    }
  }
}

.stealing-coal-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  &-map {
    width: calc(100% - 450px);
    height: 100%;
  }
  &-info {
    margin-left: 20px;
    width: 430px;
    height: 100%;
    &-title {
      color: #3D4050;
      font-size: 20px;
      font-weight: bold;
    }
  }
  &-warn-content {
    margin-top: 15px;
    padding: 10px 15px;
    border-radius: 6px;
    background-color: #F6F9FC;
    max-height: calc(100% - 190px);
    overflow-y: auto;
  }
  &-video-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.6);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    &-content {
      background-color: rgba(0,0,0,.7);
      padding: 15px;
      border-radius: 5px;
      z-index: 201;
      color: white;
      position: relative;
      video {
        display: block;
        width: 800px;
        height: 450px;
        background-color: #000;
        //background-color: #4682FA;
      }
      .video-list {
        line-height: 30px;
        font-size: 16px;
        margin-bottom: 3px;
        color: #74797D;
      }
      .video-list span {
        margin-right: 10px;
        user-select: none;
        cursor: pointer;
        position: relative;
      }
      .video-list span:nth-child(2)::before,
      .video-list span:nth-child(3)::before{
        content: '';
        border-left: solid #3D3F40 1px;
        //border-right: solid #121314 1px;
        //background: url("../../../../assets/images/stealingcoal/separate-line.png") no-repeat;
        //background-size: 100% 100%;
        width: 15px;
        height: 20px;
        margin-left: 7px;
        display: inline-block;
        vertical-align: middle;
        //display: block;
        left: -10px;
        top: 0;
        //position: absolute;
      }
      .video-list span.on {
        font-size: 16px;
        color: white;
        padding-right: 5px;
      }
      .video-list span.on::after {
        content: '';
        background: url("../../../../assets/images/stealingcoal/video-playing.png") no-repeat;
        width: 18px;
        height: 10px;
        margin-left: 7px;
        display: inline-block;
      }
      .video-close {
        position: absolute;
        right: 15px;
        top: 15px;
        background: url("../../../../assets/images/stealingcoal/close.png") no-repeat;
        width: 24px;
        height: 24px;
      }
    }
  }
}
#stealing-coal-detail-map {

}
.stealing-coal-card {
  position: relative;
  width: 100%;
  height: 130px;
  background: url("../../../../assets/images/stealingcoal/card-warning-1-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #EF6969;
  padding: 1px 0;
  margin-top: 15px;
  //margin: 0 1% 20px 1%;
  cursor: pointer;
  &-title {
    background: url("../../../../assets/images/stealingcoal/card-title-warning-1.png") no-repeat;
    height: 28px;
    width: 226px;
    margin-top: 15px;
  }
  &-time {
    position: absolute;
    right: 20px;
    top: 15px;
    line-height: 28px;
    font-weight: bold;
  }
  &-content {
    padding: 10px 15px;
    font-size: 14px;
    color: #3D4050;
    font-weight: 400;
    &-car {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
      &-id {
        font-size: 16px;
        border: solid 1px #3d4050;
        padding: 0 5px;
        border-radius: 5px;
      }
    }
  }
}
.stealing-coal-card.level-2 {
  background: url("../../../../assets/images/stealingcoal/card-warning-2-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #C76E29;
}
.stealing-coal-card.level-2 .stealing-coal-card-title {
  background: url("../../../../assets/images/stealingcoal/card-title-warning-2.png") no-repeat;
}
.stealing-coal-card.level-3 {
  color: #4682FA;
  background: url("../../../../assets/images/stealingcoal/card-warning-3-bg.png") no-repeat;
  background-size: 100% 100%;
}
.stealing-coal-card.level-3 .stealing-coal-card-title {
  background: url("../../../../assets/images/stealingcoal/card-title-warning-3.png") no-repeat;
  background-size: 100% 100%;
}
</style>
