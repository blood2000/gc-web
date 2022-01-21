<template>
  <div class="stealing-coal-detail">
    <div id="stealing-coal-detail-map" class="stealing-coal-detail-map"></div>
    <div class="stealing-coal-detail-info">
      <div class="stealing-coal-detail-info-title">预警详情</div>
      <div class="stealing-coal-card" @click="$emit('click')">
<!--        <div class="stealing-coal-card-title"></div>-->
<!--        <div class="stealing-coal-card-time">2021-03-04 22:23:12</div>-->
        <div class="stealing-coal-card-content">
          <div class="stealing-coal-card-content-car">
            <span v-if="warnDetail.vehicleAlias" class="stealing-coal-card-content-car-id">{{warnDetail.vehicleAlias}}</span>
            {{ warnDetail.vehicleNumber }}
          </div>
          <div v-html="warnDetail.describeHtml"></div>
<!--          <div class="stealing-coal-card-content-main">车辆在 2022-01-01 10:15:10 产生了载重异常告警（载重异常增加/减少100千克）。</div>-->
<!--          <ul class="stealing-coal-card-content-item">-->
<!--            <li>2022-1-1 10:09:00<span class="desc">路线偏离告警，偏离距离为 550 米，累计时长 5 分钟 33 秒；</span></li>-->
<!--            <li>2022-1-1 10:10:13<span class="desc">产生了 超时停留告警，累计 停留 5 分钟 11 秒；</span></li>-->
<!--          </ul>-->
<!--          <div>故判断该车辆可能存在偷换货风险。</div>-->
        </div>
      </div>
      <div class="stealing-coal-detail-warn-content">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">相关告警</div>
        <div style="font-size: 14px; text-indent: 20px;">{{parseTime(warnDetail.triggerEvents[0].triggerTime, '{y}-{m}-{d}')}}</div>
        <div class="warn-item" v-for="item in warnDetail.triggerEvents">
          <div class="warn-item-time">{{parseTime(item.triggerTime, '{h}:{i}:{s}')}}</div>
          <div class="warn-item-timeline" :class="{'icon-warn-red': !item.type}"></div>
          <div class="warn-item-content">
            <div class="warn-item-content-title">{{item.eventName}} <span v-if="item.isView" @click="showWarnDetail(item)" class="view">查看</span></div>
            <div v-if="item.addressName" class="warn-item-content-address">{{item.addressName}}</div>
            <div v-if="item.describe" class="warn-item-content-desc">{{item.describe}}</div>
            <div v-if="item.type === 7014 || item.type === 7013 || item.type === 8001" class="warn-item-content-video" @click="playVideo(item)"></div>
          </div>
        </div>
<!--        <div class="warn-item">-->
<!--          <div class="warn-item-time">13:46:58</div>-->
<!--          <div class="warn-item-timeline"></div>-->
<!--          <div class="warn-item-content">-->
<!--            <div class="warn-item-content-title">路线偏离告警</div>-->
<!--            <div class="warn-item-content-address">河南省平顶山市湛河区荆山街道润建 代维公司驻点(黄河路29号北239米)</div>-->
<!--            <div class="warn-item-content-route">这里写的是路径名称</div>-->
<!--            <div class="warn-item-content-desc">车辆偏离规划路径 650 米，偏离时长 6 分钟。</div>-->
<!--            <div class="warn-item-content-video"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="warn-item">-->
<!--          <div class="warn-item-time">13:46:58</div>-->
<!--          <div class="warn-item-timeline"></div>-->
<!--          <div class="warn-item-content">-->
<!--            <div class="warn-item-content-title">停留超时告警</div>-->
<!--            <div class="warn-item-content-address">河南省平顶山市湛河区荆山街道润建 代维公司驻点(黄河路29号北239米)</div>-->
<!--&lt;!&ndash;            <div class="warn-item-content-route">这里写的是路径名称</div>&ndash;&gt;-->
<!--            <div class="warn-item-content-desc">车辆偏离规划路径 650 米，偏离时长 6 分钟。</div>-->
<!--&lt;!&ndash;            <div class="warn-item-content-video"></div>&ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="warn-item">-->
<!--          <div class="warn-item-time">13:46:58</div>-->
<!--          <div class="warn-item-timeline icon-warn-red"></div>-->
<!--          <div class="warn-item-content">-->
<!--            <div class="warn-item-content-title">停留超时告警</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="warn-item">-->
<!--          <div class="warn-item-time">13:46:58</div>-->
<!--          <div class="warn-item-timeline no-line icon-warn-red"></div>-->
<!--          <div class="warn-item-content">-->
<!--            <div class="warn-item-content-title">停留超时告警</div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div v-show="isShowVideo" class="stealing-coal-detail-video-wrap">
        <div class="stealing-coal-detail-video-wrap-content">
          <div class="video-close" @click="isShowVideo = false, colse()"></div>
          <video id="video"
                 ref="video"
                 width="100%"
                 height="100%"
                 :poster="require('../../../../utils/RVC/img/video-img.png')"
                 autoplay
                 muted></video>
          <div class="video-list">
            <div class="video-list-tip">
              点击告警时间，可快捷查看时间点前后1分钟的视频。
            </div>
            <div class="video-item" v-for="(warnVideo, index) in warnVideoList" :class="{'on': curPlayVideItem === warnVideo}" @click="playVideo(warnVideo)">
              <div class="video-item-name">{{warnVideo.name}}</div>
              <div class="video-item-time">{{warnVideo.time}}</div>
            </div>
          </div>
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
import {parseTime} from "../../../../utils/ddc";
import {http_request} from "../../../../api";
import http_planRoute from "../../../../api/planroute";

export default {
  name: "StealingCoalWarnDetail",
  props: {
    warnDetail: {
      type: Object
    }
  },
  watch: {
    warnDetail: {
      handler (newVal) {
        console.log('handler', newVal)
        this.initData(newVal)
      },
      deep: true
    }
  },
  data () {
    return {
      warnDate: null,
      isShowVideo: false,
      map: null,
      wfs: null,
      warnVideoList: [],
      curPlayVideItem: null,
      videoParam: {
        VEHICLEID: "0",
        VEHICLELICENSE: "粤A4DX40",
        // DEVICENO: '016200116989',
        DEVICENO: "015800117661",
        PLATECOLOR: "2",
        CHANNEL: "1"
      },
      startMarker: null,
      endMarker: null,
      warnMarkerList: [],
      driverPaths: [],
    }
  },
  mounted() {
    setTimeout(async () => {
      await this.initMap()
      console.log('initMap')
      this.initData(this.warnDetail)
    }, 1000)
  },
  destroyed() {
    this.colse()
  },
  methods: {
    showWarnDetail (item) {
      this.$emit('showWarnDetail', item)
    },
    initData (newVal) {
      if (newVal && newVal.triggerEvents) {
        this.warnVideoList = []
        this.videoParam.VEHICLELICENSE = newVal.vehicleNumber
        this.warnMarkerList.forEach(marker => {
          this.map.remove(marker)
        })
        this.driverPaths = []
        newVal.triggerEvents.forEach(item => {
          const showTime = parseTime(item.triggerTime, '{h}:{i}:{s}')
          if (item.deviceNo) {
            this.videoParam.DEVICENO = item.deviceNo
          }
          this.warnVideoList.push({
            name: item.eventName,
            time: showTime,
            triggerTime: item.triggerTime,
            STARTTIME: new Date(item.triggerTime).getTime() / 1000 - 60,
            ENDTIME: new Date(item.triggerTime).getTime() / 1000 + 60
          })

          // 设置地图告警位置
          if (item.type) {
            let level2WarnImage = require('../../../../assets/images/stealingcoal/map-warn-2.png')
            this.makeWarnMarker(level2WarnImage, item.lng, item.lat, item.eventName, item.describe)
          }
          if (item.type === 7014) {
            // 获取轨迹
            this.showDriverPath(item)
          }
        })
        // 告警位置
        let level1WarnImage = require('../../../../assets/images/stealingcoal/map-warn-1.png')
        this.makeWarnMarker(level1WarnImage, newVal.lng, newVal.lat)

        http_request({
          moduleName: "http_planRoute",
          method: "get",
          url_alias: "planRouteGet",
          url_code: [newVal.routeId]
        }).then(res => {
          this.showPlanPath(res.data.route_coordinates)
        })
      }
    },
    showDriverPath (event) {
      http_request({
        moduleName: "http_map",
        method: "post",
        url_alias: "getVehicleTrack",
        data: {
          beginTime: event.startTime,
          endTime: event.endTime,
          vehicleCode: event.vehicleCode,
        }
      }).then(res => {
        console.log('res', res)
        if (!res.data || res.data.length === 0) {
          return
        }
        let path = []
        res.data.forEach(item => {
          let ary = item.split('|')
          path.push([ary[0], ary[1]])
        })
        this.driverPaths.push({name: '偏离轨迹', path: path})
        this.pathSimplifierIns2.setData(this.driverPaths)
      })
    },
    showPlanPath (route_coordinates) {
      const coordinates = route_coordinates.split(';')
      let planPath = coordinates.map(item => item.split(','))
      this.pathSimplifierIns.setData([
        {
          name: '规划路径',
          path: planPath
        }
      ])
      this.startMarker && this.map.remove(this.startMarker)
      this.endMarker && this.map.remove(this.endMarker)

      let pointStartImage = require('../../../../assets/images/stealingcoal/point-start.png')
      let pointEndImage = require('../../../../assets/images/stealingcoal/point-end.png')
      this.startMarker = new AMap.Marker({
        position: planPath[0],
        content: `<img style="width: 60px; height: 60px;" src="${pointStartImage}">`,
        draggable: false,
        offset: new AMap.Pixel(-30, -30)
      })
      let lastPoint = planPath[planPath.length - 1]
      this.endMarker = new AMap.Marker({
        position: lastPoint,
        content: `<img style="width: 60px; height: 60px;" src="${pointEndImage}">`,
        draggable: false,
        offset: new AMap.Pixel(-30, -30)
      })
      this.map.add(this.startMarker)
      this.map.add(this.endMarker)
    },
    playVideo (item) {
      if (!item) item = this.warnVideoList[0]
      if (!item.STARTTIME) {
        let idx = this.warnVideoList.findIndex(videoInfo => videoInfo.triggerTime === item.triggerTime)
        item = this.warnVideoList[idx]
      }
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
      console.log(vm)
      return new Promise(((resolve, reject) => {
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
          resolve()
        })
      }))
    },
    makeWarnMarker (img, lng, lat, title, desc) {
      const markerContent = `<div style="position: relative; width: 80px; height: 80px;">
<span style="position:absolute; left: 33px; bottom: -7px;display: block;background-color: white; border: solid #EF6969 5px; border-radius: 50%; width: 15px; height: 15px;"></span>
<img style="width: 80px; height: 80px;" src="${img}"></div>`
      let marker = new AMap.Marker({
        position: [lng, lat],
        content: markerContent,
        offset: new AMap.Pixel(-40, -80)
      })
      //background: #fefefe;
      // border-radius: 6px;
      // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
      function getTextWidth(str) {
        const dom = document.createElement('span')
        dom.style.display = 'inline-block';
        dom.style.fontSize = '14px'
        dom.textContent = str
        document.body.appendChild(dom)
        const width = dom.clientWidth
        document.body.removeChild(dom)
        return width
      }
      if (title && desc) {
        marker.on('mouseover', function (event) {
          let textLen = getTextWidth(desc)
          let contentLen = Math.max(textLen, 120)
          marker.setContent(`<div style="position: relative; width: 80px; height: 80px;">
<span style="position:absolute; left: 33px; bottom: -7px;display: block;background-color: white; border: solid #EF6969 5px; border-radius: 50%; width: 15px; height: 15px;"></span>
<div style="position: absolute; background-color: rgba(254,254,254,0.8);box-shadow: 8px 7px 10px 0 rgb(0 0 0 / 11%); border-radius: 0 6px 6px 0; padding: 10px 0 10px 5px; border: none; left: 72px; top: 5px; width: ${contentLen}px; height: 61px;">
<div style="font-size: 16px; color: #333; font-weight: bold; line-height: 22px">${title}</div>
<div style="font-size: 14px; color: #999;">${desc}</div>
</div>
<img style="width: 80px; height: 80px;" src="${img}"></div>`)
          marker.setzIndex(101)
        })
        marker.on('mouseout', function (event) {
          marker.setContent(markerContent)
          marker.setzIndex(100)
        })
      }
      this.map.add(marker)
      this.warnMarkerList.push(marker)
      return marker
    },
    setPathData () {
      if (!this.pathSimplifierIns) return
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
    margin: 20px 25px 5px 20px;
    border-left: dotted 2px #C9CFDB;
    position: relative;
    &::before {
      content: '';
      background: url("../../../../assets/images/stealingcoal/alert.png") no-repeat;
      width: 18px;
      height: 18px;
      position: absolute;
      left: -9px;
      top: -20px;
    }
  }
  &-timeline.icon-warn-red::before {
    background: url("../../../../assets/images/stealingcoal/warn-red.png") no-repeat;
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
      .view {
        color: #4682FA;
        font-weight: normal;
        margin-left: 10px;
        cursor: pointer;
      }
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
      //color: #EF6969;
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


.stealing-coal-detail-warn-content .warn-item:last-child .warn-item-timeline {
  border-left: dotted 2px #F6F9FC;
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
    display: flex;
    flex-direction: column;
    &-title {
      flex: none;
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
    //max-height: calc(100% - 190px);
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
      padding: 25px 15px 25px 15px;
      border-radius: 5px;
      z-index: 201;
      color: white;
      position: relative;
      display: flex;
      video {
        flex: none;
        display: block;
        width: 800px;
        height: 450px;
        background-color: #000;
        //background-color: #4682FA;
      }
      .video-list {
        flex: none;
        width: 190px;
        max-height: 450px;
        overflow-y: auto;
        margin-left: 15px;
        //line-height: 30px;
        font-size: 16px;
        //margin-bottom: 3px;
        color: #74797D;

        &-tip {
          color: #FFBC00;
          font-size: 12px;
          font-weight: 400;
          padding: 10px 10px 10px 30px;
          background-color: rgba(255, 188, 0, .1);
          border-radius: 5px;
          line-height: 20px;
          margin-top: 10px;
          position: relative;
        }
        &-tip::before {
          content: '';
          background: url("../../../../assets/images/stealingcoal/warn-yellow.png") no-repeat;
          display: inline-block;
          width: 11px;
          height: 11px;
          position: absolute;
          left: 10px;
          top: 15px;
        }
        .video-item {
          cursor: pointer;
          user-select: none;
          padding: 15px 0 10px 0;
          color: #A6A6A6;
          position: relative;
          &-name {
            font-size: 12px;
            font-weight: normal;
          }
          &-time {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .video-item.on {
          color: #fff;
        }
        .video-item.on::after {
          content: '';
          display: block;
          background: url("../../../../assets/images/stealingcoal/video-playing.png") no-repeat;
          background-size: 100% 100%;
          width: 18px;
          height: 10px;
          right: 15px;
          top: 28px;
          position: absolute;
        }
        .video-item:not(:nth-child(2))::before {
          border-top: solid #404143 1px;
          border-bottom: solid #121314 1px;
          //color: red;
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          //background: url("../../../../assets/images/stealingcoal/ver-line.png") no-repeat;
          //background-size: 100% 100%;
          display: block;
          width: 100%;
          //height: 1px;
        }
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
        right: 5px;
        top: 5px;
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
  flex: none;
  position: relative;
  width: 100%;
  //height: 130px;
  color: #4682FA;
  background: url("../../../../assets/images/stealingcoal/light-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 1px 0;
  margin-top: 15px;
  //margin: 0 1% 20px 1%;
  cursor: pointer;
  &::before {
    content: '';
    display: block;
    background: url("../../../../assets/images/stealingcoal/light.png") no-repeat;
    width: 128px;
    height: 135px;
    position: absolute;
    right: 0;
    top: 0;
  }
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
    &-main {
      font-weight: bold;
      color: #4682FA;
    }
    &-item {
      margin: 5px 0 5px 20px;
      line-height: 25px;
      li {
        list-style: disc;
        .desc {
          display: block;
          font-weight: bold;
        }
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
