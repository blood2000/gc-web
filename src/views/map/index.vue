<template>
  <!-- 设备管理-电子围栏 -->
  <div class="map-container">
    <div class="header-panel">
      <ul class="map-tab">
        <li v-for="item in tabList" :key="item.code" :class="{active: item.code === currentTab}" @click="handleTab(item.code)">{{ item.label }}</li>
      </ul>
    </div>

    <div class="left-tree-panel">
      <!-- 车辆树 -->
      <template v-if="currentType === 1">
        <div class="device-search-box">
          <el-input
            v-model="vehicleParams.licenseNumber"
            placeholder="车牌号"
            clearable
            size="small"
            class="device-search-input"
            @keyup.enter.native="vehicleQuery"
          />
          <el-select v-model="vehicleParams.vehicleTypeCode" class="device-search-select" placeholder="车辆类型" size="small" clearable filterable>
            <el-option
              v-for="dict in vehicleTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="vehicleQuery">搜索</el-button>
        </div>
        <div class="device-info-list-box">
          <el-tree
            ref="vehicleTree"
            :data="vehicleTreeOptions"
            :props="vehicleTreeProps"
            :expand-on-click-node="true"
            :filter-node-method="vehicleFilterNode"
            :indent="0"
            :highlight-current="true"
            node-key="code"
            :current-node-key="vehicleCode"
            default-expand-all
            @node-click="vehicleNodeClick"
          >
            <span slot-scope="{ node, data }">
              <span class="node-label">
                <i class="tree-node-icon" :class="data.icon" />
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </template>
      <!-- 司机树 -->
      <template v-if="currentType === 2">
        <div class="device-search-box">
          <el-input
            v-model="driverParams.driverName"
            placeholder="司机姓名"
            clearable
            size="small"
            class="device-search-input"
            @keyup.enter.native="driverQuery"
          />
        </div>
        <div class="device-info-list-box">
          <el-tree
            ref="driverTree"
            :data="driverTreeOptions"
            :props="driverTreeProps"
            :expand-on-click-node="true"
            :filter-node-method="driverFilterNode"
            :indent="0"
            :highlight-current="true"
            node-key="code"
            :current-node-key="driverCode"
            default-expand-all
            @node-click="driverNodeClick"
          >
            <span slot-scope="{ node, data }">
              <span class="node-label">
                <i class="tree-node-icon" :class="data.icon" />
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </template>
    </div>

    <!-- 地图 -->
    <div id="device-map-container" />

    <!-- 车辆监控 -->
    <WarnList
      v-if="currentTab === 1"
      ref="WarnListRef"
      class="warn-list-panel"
    />

    <!-- 调度指派 -->

    <!-- 轨迹回放 -->
    <TrackList
      v-if="currentTab === 3"
      ref="TrackListRef"
      class="track-list-panel"
      @initPathSimplifier="initPathSimplifier"
      @startPathSimplifier="startPathSimplifier"
      @resumePathSimplifier="resumePathSimplifier"
      @pausePathSimplifier="pausePathSimplifier"
      @clearPathSimplifierIns="clearPathSimplifierIns"
      @handleSlideChange="handleSlideChange"
    />
  </div>
</template>

<script>
import WarnList from './warning/warnList.vue';
import TrackList from './track/trackList.vue';
import { http_request } from '@/api';
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});
export default {
  name: 'MapInfo',
  components: {
    WarnList,
    TrackList
  },
  data() {
    return {
      // 地图
      map: null,
      // 树切换
      currentType: 1,
      typeList: [
        {code: 1, label: '车辆'},
        {code: 2, label: '司机'}
      ],
      // 车树查询
      vehicleParams: {
        licenseNumber: undefined,
        vehicleTypeCode: undefined
      },
      vehicleTypeOptions: [],
      // 车树
      vehicleTreeOptions: undefined,
      vehicleTreeProps: {
        children: 'children',
        label: 'typeName'
      },
      // 当前选中的车节点
      vehicleCode: undefined,
      // 司机树查询
      driverParams: {
        driverName: undefined
      },
      // 司机树
      driverTreeOptions: [],
      driverTreeProps: {
        children: 'children',
        label: 'typeName'
      },
      // 当前选中的司机节点
      driverCode: undefined,
      // 地图切换
      currentTab: 1,
      tabList: [
        {code: 1, label: '车辆监控'},
        {code: 2, label: '调度指派'},
        {code: 3, label: '轨迹回放'}
      ],
      // 巡航器轨迹
      pathSimplifierIns: null,
      // 巡航器
      navgtr: null,
      // 巡航速度
      navgtrSpeed: 3000,
      // 巡航起点
      startMarker: null,
      // 巡航终点
      endMarker: null
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('device-map-container', {
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11
      });
    },
    /** 绘制标记
     * @param {Array} position 经纬度必传
     * @param {Object} labelText 信息窗内容,没有就不传
     * @param {string} content 图标
     * @param {Array} offset 图标偏移量
    */
    drawMarker(position, {clickable = true, content = '<div class="own-device-marker-car"></div>', offset = [-19, -28]}) {
      const marker = new AMap.Marker({
        map: this.map,
        position,
        content,
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(offset[0], offset[1]),
        clickable
      });
      return marker;
    },
    /** 设置点标记的文本标签
     * @param {Object} marker 标记点对象
     * @param {Object} content 文本内容,没有就不传
     */
    setLabel(marker, content = {}) {
      if (!marker) return;
      marker.setLabel(content);
    },
    /** 生成文本标签内容
     * @param {string} text 文本标签内容,没有就不传
     * @param {Array} offset 文本标签偏移量
     */
    setLabelContent(text, offset = [0, -8]) {
      const option = text ? {
        offset: new AMap.Pixel(offset[0], offset[1]),
        content: '<div>' + text + '</div>',
        direction: 'top'
      } : {};
      return option;
    },
    /** 实例化窗体并打开
     * @param {Object} marker 标记点对象
     * @param {Object} info 动态内容
     * @param {string} anchor 图标锚点
     * @param {Array} offset 窗体偏移量
     */
    markerInfoInit(marker, {info = [], offset = [20, -16] , anchor = 'top-center'}) {
      const infoWindow = new AMap.InfoWindow({
        isCustom: false, // 使用自定义窗体
        content: info.join('<br/>'),
        offset: new AMap.Pixel(offset[0], offset[1]),
        anchor
      });
      infoWindow.open(this.map, marker.getPosition());
      return infoWindow;
    },
    /** 关闭地图信息窗体 */
    closeInfoWindow() {
      this.map.clearInfoWindow();
    },
    /**
     * 通过经纬度获取详细点位信息
     * @param {Array} position 经纬度必传
     *  */
    getAddressBylnglat(position) {
      return new Promise((resolve, reject) => {
        let address;
        geocoder.getAddress(position, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              const { formattedAddress } = result.regeocode;
              address = formattedAddress;
            }
            resolve(address);
          }
        });
      })
    },
    /** 绘制线
     * @param {Array} path 组成轨迹的点数组必传
     * @param {Array} strokeColor 轨迹线颜色
     * @param {Array} strokeWeight 轨迹粗细
     * @param {Array} showDir 线内是否显示箭头
    */
    drawLine(path = [], {strokeColor = '#1990FF', strokeWeight = 8, showDir = true}) {
      const polyline = new window.AMap.Polyline({
        map: this.map,
        path,
        strokeColor,
        strokeWeight,
        showDir,
        lineJoin: 'round'
      });
      return polyline;
    },
    /**
     * 绘制圆
     * @param {LngLat} center 中心点经纬度必传
     * @param {Number} radius 半径必传
     * @param {string} strokeColor 边框线颜色
     * @param {Number} strokeOpacity 边框线透明度
     * @param {Number} strokeWeight 边框线宽
     * @param {string} fillColor 填充色
     * @param {Number} fillOpacity 填充透明度
     */
    drawCircle(center, radius, {strokeColor = '#ff4d4d', strokeOpacity = 1, strokeWeight = 3, fillColor = '#ff4d4d', fillOpacity = 0.3}) {
      const circle = new AMap.Circle({
        map: this.map,
        center: center,
        radius: radius,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity
      });
      return circle;
    },
    /** 清除地图所有绘制的覆盖物 */
    clearMap() {
      this.map.clearMap();
    },
    /** 判断当前位置是否在可视区域 */
    isPointInRing(position) {
      const bounds = this.map.getBounds();
      const NorthEast = bounds.getNorthEast();
      const SouthWest = bounds.getSouthWest();
      const SouthEast = [NorthEast.lng, SouthWest.lat];
      const NorthWest = [SouthWest.lng, NorthEast.lat];
      const path = [[NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest]; // 将地图可视区域四个角位置按照顺序放入path，用于判断point是否在可视区域
      const isPointInRing = AMap.GeometryUtil.isPointInRing(position, path); // 判断point是否在可视区域
      return isPointInRing;
    },
    /** 绘制巡航轨迹 */
    initPathSimplifier() {
      const that = this;
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！');
          return;
        }
        // 创建一个巡航轨迹路线
        that.pathSimplifierIns = new PathSimplifier({
          zIndex: 100, // 地图层级，
          map: this.map, // 所属的地图实例
          // 巡航路线轨迹列表
          getPath: (pathData, pathIndex) => {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            return '';
          },
          // 自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
          // 绘制路线节点
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: '#28F',
              lineWidth: 8,
              dirArrowStyle: true
            },
            pathLineHoverStyle: null,
            pathLineSelectedStyle: {
              strokeStyle: '#28F',
              lineWidth: 8,
              dirArrowStyle: true
            },
            renderAllPointsIfNumberBelow: -1 // 绘制路线节点，如不需要可设置为-1
          }
        });
        // 设置数据
        that.pathSimplifierIns.setData([{
          path: that.$refs.TrackListRef.jmTracklist
        }]);
        // 对线路创建一个巡航器
        const contentImg = require('@/assets/images/device/track_car_c.png');
        that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
          loop: false, // 循环播放
          speed: that.navgtrSpeed, // 巡航速度，单位千米/小时
          pathNavigatorStyle: {
            width: 20,
            height: 59,
            // 使用图片
            content: PathSimplifier.Render.Canvas.getImageContent(contentImg,
              function onload() {
                // 图片加载成功，重新绘制一次
                that.pathSimplifierIns.renderLater();
              },
              function onerror(e) {
                that.msgError('图片加载失败！');
              }
            ),
            strokeStyle: null,
            fillStyle: null,
            // 经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 8,
              strokeStyle: '#AF5',
              dirArrowStyle: true
            }
          }
        });
        // 巡航器移动事件
        that.navgtr.on('move', function(data, position) {
          const path = position.dataItem.pathData.path;
          const idx = position.dataItem.pointIndex; // 走到了第几个点
          const tail = position.tail; // 至下一个节点的比例位置
          const totalIdx = idx + tail;
          const len = path.length;
          // 设置当前轨迹点时间、速度
          that.$refs.TrackListRef.setCurrentTrackTimeAndSpeed(idx);
          // 计算下一个距离速度
          if (idx < len - 1) {
            that.navgtr.setSpeed(that.navgtrSpeed * that.$refs.TrackListRef.rateTime);
          }
          // 进度条实时展示tail
          that.$refs.TrackListRef.setSlideValue((totalIdx / len) * 100);
          // 车超出视野范围后重新定位
          if (!that.isPointInRing(path[idx])) {
            that.map.setCenter(path[idx]);
          }
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.$refs.TrackListRef.setPlayStatus(0);
          }
        });
        // 绘制起点
        this.startMarker = this.drawMarker(
          this.$refs.TrackListRef.jmTracklist[0], 
          {
            clickable: false,
            content: '<div class="own-device-line-icon start">起</div>',
            offset: [-20, -20]
          }
        );
        // 绘制终点
        this.endMarker = this.drawMarker(
          this.$refs.TrackListRef.jmTracklist[this.$refs.TrackListRef.jmTracklist.length - 1], 
          {
            clickable: false,
            content: '<div class="own-device-line-icon end">终</div>',
            offset: [-20, -20]
          }
        );
      });
    },
    /** 巡航轨迹事件 */
    startPathSimplifier() {
      this.$refs.TrackListRef.setPlayStatus(1);
      this.map.setZoomAndCenter(12, this.$refs.TrackListRef.jmTracklist[0]);
      this.navgtr.start();
    },
    pausePathSimplifier() {
      this.$refs.TrackListRef.setPlayStatus(2);
      this.navgtr.pause();
    },
    resumePathSimplifier() {
      this.$refs.TrackListRef.setPlayStatus(1);
      this.navgtr.resume();
    },
    /** 清除巡航轨迹 */
    clearPathSimplifierIns() {
      this.startMarker && this.startMarker.setMap(null);
      this.endMarker && this.endMarker.setMap(null);
      this.$refs.TrackListRef.setSlideValue(0);
      this.$refs.TrackListRef.setPlayStatus(0);
      if (this.pathSimplifierIns) {
        this.pathSimplifierIns.setData([]);
      }
    },
    /** 进度条滑块触发改变巡航轨迹 */
    handleSlideChange(value) {
      if (!this.navgtr) return;
      const newVal = typeof (value) === 'number' ? value : this.$refs.TrackListRef.slideValue;
      const num = parseInt((newVal / 100) * this.$refs.TrackListRef.jmTracklist.length);
      const decimal = String((newVal / 100) * this.$refs.TrackListRef.jmTracklist.length).split('.')[1] || 0;
      this.navgtr.moveToPoint(num, Number('0.' + decimal));
      this.pathSimplifierIns.renderLater();
    },
    // 车树查询
    vehicleQuery() {

    },
    vehicleFilterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },
    // 车树节点选中
    vehicleNodeClick(data) {

    },
    // 司机树查询
    driverQuery() {

    },
    driverFilterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },
    // 司机节点选中
    driverNodeClick(data) {
      
    },
    // 切换地图tab
    handleTab(code) {
      if (this.currentTab === code) return;
      this.currentTab = code;
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container{
  margin: 0;
  height: 100%;
  min-width: 1320px;
  overflow-x: auto;
  $header-height: 60px; 
  $left-tree-width: 300px;

  >.header-panel{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: $header-height;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.9);
    // tab
    .map-tab{
      font-size: 0;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      >li{
        display: inline-block;
        width: 150px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        background: #fff;
        text-align: center;
        cursor: pointer;
        &.active{
          color: #fff;
          background: blue;
        }
      }
    }
  }

  >.left-tree-panel{
    position: absolute;
    top: $header-height;
    left: 0;
    width: $left-tree-width;
    height: calc(100% - #{$header-height});
    padding: 0;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    z-index: 9998;
  }

  // 报警列表
  >.warn-list-panel{
    position: absolute;
    bottom: 10px;
    left: calc(#{$left-tree-width} + 10px);
    right: 10px;
  }

  // 行车轨迹
  >.track-list-panel{
    position: absolute;
    bottom: 10px;
    left: calc(#{$left-tree-width} + 10px);
    right: 10px;
  }

  // 地图
  >#device-map-container{
    width: 100%;
    height: 100%;
    // 地图信息窗体样式-覆盖
    ::v-deep.amap-info-content{
      padding: 0;
      .amap-info-close{
        top: 10px;
        right: 10px !important;
      }
    }
    ::v-deep.amap-info-outer, ::v-deep.amap-menu-outer{
      box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.15);
      border-radius: 6px;
    }
    ::v-deep.middle-left .amap-info-sharp:after{
      filter: blur(8px);
    }
    // 地图标记label样式
    ::v-deep.amap-marker-label{
      border: none;
      border-radius: 4px;
      font-size: 12px;
      line-height: 14px;
      color: #262626;
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
      padding: 3px 6px;
      &::after{
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-top: 6px solid #fff;
        border-right: 6px solid transparent;
      }
    }
    // 地图信息窗体样式
    ::v-deep.own-map-info-content{
      >h5{
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #262626;
        padding: 15px 15px 0;
      }
      br{
        display: none !important;
      }
      >.top-content{
        padding: 15px 20px 9px 15px;
        border-bottom: 1px solid rgba(159, 162, 181, 0.2);
        .input-item{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 20px;
          color: #20273A;
          margin-bottom: 6px;
          >span{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: rgba(144, 147, 152, 0.9);
            margin-right: 12px;
          }
        }
      }
      >.bottom-content{
        padding: 14px 15px 10px;
        font-size: 0;
        >a{
          display: inline-block;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 22px;
          color: #409EFF;
          margin-bottom: 4px;
          margin-right: 20px;
        }
      }
    }
    // 轨迹起点终点样式
    ::v-deep.own-device-line-icon{
      width: 40px;
      height: 40px;
      border: 4px solid #FFFFFF;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 32px;
      text-align: center;
      color: #FFFFFF;
      &.start{
        background: #FB8720;
      }
      &.end{
        background: #1990FF;
      }
    }
    // 轨迹车样式
    ::v-deep.own-device-line-car{
      width: 58px;
      height: 20px;
      background: url('~@/assets/images/device/track_car.png') no-repeat;
      background-size: 100% 100%;
    }
    // 标记物车样式
    ::v-deep.own-device-marker-car{
      width: 40px;
      height: 58px;
      background: url('~@/assets/images/device/car.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>