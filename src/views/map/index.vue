<template>
  <!-- 设备管理-电子围栏 -->
  <div class="map-container">
    <div class="header-panel ly-flex-pack-start">
      <img class="logo" src="~@/assets/images/device/logo.png" />
      <div class="time-box ly-flex-pack-center ly-flex-align-center">
        <div class="time">{{ currentTime }}</div>
        <div>
          <p class="date">{{ currentday }}</p>
          <p class="date">{{ currentDate }}</p>
        </div>
      </div>
      <ul class="map-tab">
        <li v-for="item in headerTabList" :key="item.code" :class="{active: item.code === headerTab}" @click="handleHeaderTab(item.code)">{{ item.label }}</li>
      </ul>
      <div class="return-button" @click="backPage">返回</div>
    </div>

    <div class="left-tree-panel">
      <ul class="left-tree-panel__tab ly-flex-pack-justify">
        <li :class="{active: currentType === '1'}" @click="handleType('1')">车辆（16）</li>
        <li :class="{active: currentType === '2'}" @click="handleType('2')">司机（16）</li>
      </ul>
      <div class="left-tree-panel__content">
        <!-- 车辆树 -->
        <template v-if="currentType === '1'">
          <ul class="btn-list-box">
            <li v-for="item in vehicleTablist" :key="item.code" :class="{active: item.code === vehicleActiveTab}" @click="handleVehicleTab(item.code)">{{ `${item.tabName}（10）` }}</li>
          </ul>
          <div class="device-search-box">
            <el-input
              v-model="vehicleParams.licenseNumber"
              placeholder="请输入车牌号搜索"
              clearable
              size="small"
              class="device-search-input"
              @keyup.enter.native="vehicleQuery"
            />
            <div class="ly-flex-pack-justify">
              <el-select v-model="vehicleParams.vehicleTypeCode" class="device-search-select" @change="vehicleQuery" placeholder="车辆类型" size="small" clearable filterable>
                <el-option
                  v-for="dict in vehicleTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select v-model="vehicleParams.vehicleStatus" class="device-search-select" @change="vehicleQuery" placeholder="车辆状态" size="small" clearable filterable>
                <el-option
                  v-for="dict in vehicleStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </div>
          </div>
          <div class="device-info-list-box own-map-panel-tree map-scroll-panel">
            <el-tree
              ref="vehicleTree"
              :data="vehicleTreeOptions"
              :props="vehicleTreeProps"
              :expand-on-click-node="true"
              :filter-node-method="vehicleFilterNode"
              :indent="24"
              :highlight-current="true"
              node-key="code"
              :current-node-key="vehicleCode"
              default-expand-all
              @node-click="vehicleNodeClick"
            >
              <span slot-scope="{ node, data }">
                <template v-if="!data.vehicleFlag">
                  <span class="node-label">
                    <i class="tree-node-icon" :class="data.icon" />
                    {{ `${node.label}（${data.vehicleCount}）` }}
                  </span>
                </template>
                <template v-if="data.vehicleFlag">
                  <div class="tree-node-car-box ly-flex ly-flex-align-center">
                    <div class="img-box"></div>
                    <div class="info-box ly-flex-1">
                      <h5>
                        {{ data.orgOrlicenseNumber }}
                        <span class="type">渣土车</span>
                      </h5>
                      <p>
                        <!-- 在线/离线 -->
                        <span class="status green"><strong>· </strong>设备在线</span>
                        <!-- <span class="status gray"><strong>· </strong>设备离线</span> -->
                        <!-- 设备状态 -->
                        <span class="status blue" v-if="data.vehicleStatus === 0"><strong>· </strong>空闲中</span>
                        <span class="status green" v-if="data.vehicleStatus === 1"><strong>· </strong>任务中</span>
                        <span class="status gray" v-if="data.vehicleStatus === 2"><strong>· </strong>维修</span>
                        <span class="status gray" v-if="data.vehicleStatus === 3"><strong>· </strong>保养</span>
                      </p>
                    </div>
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </template>
        <!-- 司机树 -->
        <template v-if="currentType === '2'">
          <ul class="btn-list-box">
            <li v-for="item in driverTablist" :key="item.code" :class="{active: item.code === driverActiveTab}" @click="handleDriverTab(item.code)">{{ `${item.tabName}（10）` }}</li>
          </ul>
          <div class="device-search-box">
            <el-input
              v-model="driverParams.driverName"
              placeholder="请输入司机姓名搜索"
              clearable
              size="small"
              class="device-search-input"
              @keyup.enter.native="driverQuery"
            />
          </div>
          <div class="device-info-list-box own-map-panel-tree map-scroll-panel">
            <el-tree
              ref="driverTree"
              :data="driverTreeOptions"
              :props="driverTreeProps"
              :expand-on-click-node="true"
              :filter-node-method="driverFilterNode"
              :indent="24"
              :highlight-current="true"
              node-key="code"
              :current-node-key="driverCode"
              default-expand-all
              @node-click="driverNodeClick"
            >
              <span slot-scope="{ data }">
                <template v-if="!data.driverFlag	">
                  <span class="node-label">
                    <i class="tree-node-icon" :class="data.icon" />
                    {{ data.orgOrDriverName }}
                  </span>
                </template>
                <template v-if="data.driverFlag	">
                  <div class="tree-node-driver-box ly-flex ly-flex-align-center">
                    {{ data.orgOrDriverName }}
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </template>
      </div>
    </div>

    <!-- 地图 -->
    <div id="device-map-container" />

    <!-- 车辆监控 -->
    <WarnList
      v-if="headerTab === 1"
      ref="WarnListRef"
      class="warn-list-panel"
    />
    <!-- <WarnDetail
      v-if="headerTab === 1"
      ref="WarnDetailRef"
      class="warn-detail-panel"
    /> -->

    <!-- 调度指派 -->

    <!-- 轨迹回放 -->
    <TrackList
      v-if="headerTab === 3"
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
import WarnDetail from './warning/warnDetail.vue';
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
    WarnDetail,
    TrackList
  },
  data() {
    return {
      // 地图
      map: null,
      // 时间
      timer: null,
      currentday: '',
      currentDate: '',
      currentTime: '',
      // 树切换
      currentType: '1',
      // 车小tab
      vehicleActiveTab: '0',
      vehicleTablist: [{
        code: '0',
        tabName: '全部'
      }, {
        code: '1',
        tabName: '在线'
      }],
      // 车树查询
      vehicleParams: {
        licenseNumber: undefined,
        vehicleTypeCode: undefined,
        vehicleStatus: undefined // 0 空闲 1 任务中  2 维修 3 保养
      },
      // 车辆类型字典
      vehicleTypeOptions: [],
      // 车辆状态字典
      vehicleStatusOptions: [
        { dictLabel: '空闲', dictValue: 0 },
        { dictLabel: '任务中', dictValue: 1 },
        { dictLabel: '维修', dictValue: 2 },
        { dictLabel: '保养', dictValue: 3 }
      ],
      // 车树
      vehicleTreeOptions: undefined,
      vehicleTreeProps: {
        children: 'children',
        label: 'orgOrlicenseNumber'
      },
      // 当前选中的车节点
      vehicleCode: undefined,
      // 司机小tab
      driverActiveTab: '0',
      driverTablist: [{
        code: '0',
        tabName: '空闲'
      }, {
        code: '1',
        tabName: '任务'
      }],
      // 司机树查询
      driverParams: {
        driverName: undefined,
        driverStatus: undefined // 0 任务中 1 空闲中 2 不可用
      },
      // 司机树
      driverTreeOptions: undefined,
      driverTreeProps: {
        children: 'children',
        label: 'orgOrDriverName'
      },
      // 当前选中的司机节点
      driverCode: undefined,
      // 地图切换
      headerTab: 1,
      headerTabList: [
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
    this.getCurrentTime();
    this.refreshTime();
    this.initMap();
    this.getOrgVehicleTree();
    this.getOrgDriverTree();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('device-map-container', {
        mapStyle: 'amap://styles/2fe468ae95b55caa76404a537353e63a', //设置地图的显示样式
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11,
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
     * @param {Array} position 经纬度必传
     * @param {Object} info 动态内容
     * @param {string} anchor 图标锚点
     * @param {Array} offset 窗体偏移量
     */
    markerInfoInit(position, {info = [], offset = [10, -12] , anchor = 'bottom-center'}) {
      const infoWindow = new AMap.InfoWindow({
        isCustom: false, // 使用自定义窗体
        content: info.join('<br/>'),
        offset: new AMap.Pixel(offset[0], offset[1]),
        anchor
      });
      infoWindow.open(this.map, position);
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
        const contentImg = require('@/assets/images/device/track_car.png');
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
        // 创建信息窗
        const info = ['<div>111111</div>']
        const infoWindow = that.markerInfoInit(that.$refs.TrackListRef.jmTracklist[0], {info});
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
          // 重新设置信息窗口位置
          infoWindow.setPosition(path[idx]);
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
    // 返回上一页 
    backPage() {
      this.$router.go(-1);
    },
    // 实时获取当前时间
    getCurrentTime() {
      const date = new Date(); 
      const day = date.getDay();
      if (day === 0) {
        this.currentday = '星期天';
      } else if (day === 1) {
        this.currentday = '星期一';
      } else if (day === 2) {
        this.currentday = '星期二';
      } else if (day === 3) {
        this.currentday = '星期三';
      } else if (day === 4) {
        this.currentday = '星期四';
      } else if (day === 5) {
        this.currentday = '星期五';
      } else if (day === 6) {
        this.currentday = '星期六';
      }
      this.currentDate = this.parseTime(date, '{y} / {m} / {d}');
      this.currentTime = this.parseTime(date, '{h}:{i}')
    },
    // 定时刷新时间
    refreshTime() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.getCurrentTime();
      }, 60 * 1000)
    },
    // 清除定时器
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    // 切换车辆/司机
    handleType(code) {
      if (this.currentType === code) return;
      this.currentType = code;
    },
    // 车小tab
    handleVehicleTab(code) {
      if (this.vehicleActiveTab === code) return;
      this.vehicleActiveTab = code;
    },
    // 获取车辆树数据
    getOrgVehicleTree() {
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'orgVehicleTree',
        data: this.vehicleParams
      };
      http_request(obj).then(res => {
        this.vehicleTreeOptions = res.data;
      });
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
    // 司机小tab
    handleDriverTab(code) {
      if (this.driverActiveTab === code) return;
      this.driverActiveTab = code;
    },
    // 获取司机树数据
    getOrgDriverTree() {
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'orgDriverTree',
        data: this.driverParams
      };
      http_request(obj).then(res => {
        this.driverTreeOptions = res.data;
      });
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
    handleHeaderTab(code) {
      if (this.headerTab === code) return;
      this.headerTab = code;
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
  $header-height: 68px; 
  $left-tree-width: 300px;
  $bottom: 16px;

  >.header-panel{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: $header-height;
    z-index: 9999;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, #FFFFFF 100%);
    border-bottom: 1px solid #E4ECF4;
    >.logo{
      width: 136px;
      height: 46px;
      margin: 12px 2px 10px 16px;
    }
    >.time-box{
      padding: 4px 0 0 16px;
      position: relative;
      .time{
        font-size: 30px;
        font-family: Bahnschrift;
        font-weight: 600;
        line-height: 28px;
        color: #505361;
        padding-top: 2px;
        margin-right: 8px;
      }
      .date{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 14px;
        color: #505361;
      }
      &::before{
        content: '';
        height: 24px;
        width: 1px;
        background: #6A6D79;
        position: absolute;
        left: 4px;
        top: 24px;
      }
    }
    // tab
    .map-tab{
      font-size: 0;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      height: 100%;
      >li{
        position: relative;
        display: inline-block;
        width: 90px;
        height: 100%;
        line-height: $header-height;
        color: #A7AABB;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        margin: 0 26px;
        &::after{
          content: "";
          width: 0;
          height: 4px;
          background: #4682FA;
          position: absolute;
          bottom: 0;
          left: 50%;
          transition: all .3s;
        }
        &.active{
          color: #3A3D4D;
          font-size: 20px;
          &::after{
            left: 8px;
            width: 74px;
          }
        }
      }
    }
    // 返回按钮
    .return-button{
      width: 72px;
      height: 32px;
      line-height: 32px;
      opacity: 1;
      border-radius: 4px;
      padding-left: 34px;
      position: absolute;
      right: 24px;
      top: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #3D4050;
      cursor: pointer;
      background: #EEF1F3 url('~@/assets/images/device/return.png') no-repeat 8px center;
    }
  }

  >.left-tree-panel{
    $tab-height: 48px;
    position: absolute;
    top: calc(#{$header-height} + #{$tab-height} + 20px);
    left: 0;
    bottom: $bottom;
    width: $left-tree-width;
    z-index: 9998;

    // 大tab样式
    >.left-tree-panel__tab{
      position: absolute;
      left: 0;
      right: 0;
      top: calc(-#{$tab-height});
      >li{
        width: 50%;
        height: $tab-height;
        background: #E3E7F0;
        border-radius: 6px 6px 0 0;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 700;
        line-height: 36px;
        color: #8592AD;
        cursor: pointer;
        text-align: center;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
        z-index: 0;
        transform: translateY(12px);
        transition: transform 0.4s;
        &:first-child{
          margin-right: 8px;
        }
        &.active{
          color: #3D4050;
          font-weight: 700;
          line-height: 48px;
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 6px -2px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(4px);
        }
      }
    }
    >.left-tree-panel__content{
      position: relative;
      height: 100%;
      z-index: 1;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 6px 3px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0 8px 8px 0;
      padding: 18px 0;
    }

    // 小tab样式
    .btn-list-box{
      font-size: 0;
      background: #E3E7F0;
      opacity: 1;
      border-radius: 5px;
      overflow: hidden;
      margin: 0 16px 12px;
      width: calc(100% - 32px);
      >li{
        display: inline-block;
        width: 50%;
        height: 36px;
        line-height: 32px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #8592AD;
        text-align: center;
        cursor: pointer;
        border: 2px solid #E3E7F0;
        border-radius: 4px;
        &.active{
          background: #FFFFFF;
          color: #3D4050;
        }
      }
    }

    // 搜索样式
    .device-search-box{
      padding: 0 16px;
      .label{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #8592AD;
        line-height: 32px;
      }
      .device-search-input{
        margin-bottom: 12px;
      }
      .device-search-select{
        margin-bottom: 12px;
        width: calc(50% - 4px);
      }
    }
    // 树盒子
    .device-info-list-box{
      height: calc(100% - 124px);
      overflow: auto;
    }
  }

  // 报警列表
  >.warn-list-panel{
    position: absolute;
    bottom: 10px;
    left: calc(#{$left-tree-width} + 10px);
    right: 10px;
    z-index: 1000;
  }

  // 报警详情
  >.warn-detail-panel{
    position: absolute;
    right: 10px;
    top: $header-height;
    bottom: 10px;
    z-index: 1000;
    height: calc(100% - #{$header-height});
  }

  // 行车轨迹
  >.track-list-panel{
    position: absolute;
    bottom: 10px;
    left: calc(#{$left-tree-width} + 10px);
    right: 10px;
    z-index: 1000;
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
      width: 20px;
      height: 59px;
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

<style lang="scss">
// elementui 覆盖tab样式
.own-map-panel-tab{
  .el-tabs__item{
    color: #ccc;
    font-weight: 700;
    &.is-active{
      color: #000;
    }
  }
  .el-tabs__nav-wrap::after{
    background: transparent;
  }
}

// elementui 覆盖tree样式
.own-map-panel-tree{
  .el-tree{
    background: transparent;
  }
  .el-tree-node:before{
    display: none;
  }
  .el-tree-node:after{
    border-top: none;
  }
  .el-tree-node__children{
    padding-left: 0;
  }
  .el-tree-node{
    padding-left: 0;
  }
  .el-tree-node__content{
    height: auto;
    min-height: 32px;
    .el-tree-node__expand-icon{
      padding: 6px;
      color: #ccc;
    }
    .tree-node-icon{
      margin-left: -2px;
    }
  }
  // 车的树节点
  .tree-node-car-box{
    .img-box{
      width: 48px;
      height: 48px;
      background: #F1F1F1;
      border-radius: 3px;
      margin: 6px 8px 6px 0;
    }
    .info-box{
      >h5{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3D4050;
        >.type{
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: #959AA4;
          margin-top: -4px;
        }
      }
      >p{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #959AA4;
        line-height: 24px;
        >.status{
          display: inline-block;
          margin-right: 8px;
          height: 20px;
          line-height: 20px;
          border-radius: 4px;
          padding: 0 8px;
          &.green{
            color: #43B91E;
            background: #E5F0E4;
          }
          &.gray{
            color: #959AA4;  
            background: #F1F1F1;
          }
          &.blue{
            color: #4682FA;  
            background: #E5ECF6;
          }
        }
      }
    }
  }
  // 司机的树节点
  .tree-node-driver-box{

  }
}

// 滚动条样式
.map-scroll-panel::-webkit-scrollbar {
	width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
	height: 6px;
}
.map-scroll-panel::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	border-radius: 6px;
	background: rgba(0, 0, 0, 0.2);
}
.map-scroll-panel::-webkit-scrollbar-thumb:hover {
	background:rgba(0, 0, 0, 0.25);
}
</style>