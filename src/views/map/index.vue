<template>
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
        <li
          v-for="item in headerTabList"
          :key="item.code"
          :class="{ active: item.code === headerTab }"
          @click="handleHeaderTab(item.code)"
        >
          {{ item.label }}
        </li>
      </ul>
      <div class="return-button" @click="backPage">返回</div>
    </div>

    <div class="left-tree-panel">
      <ul class="left-tree-panel__tab ly-flex-pack-justify">
        <li :class="{ active: currentType === '1' }" @click="handleType('1')">
          {{ `车辆（${countVehicle.countAll ? countVehicle.countAll : 0}）` }}
        </li>
        <li :class="{ active: currentType === '2' }" @click="handleType('2')">
          {{ `司机（${countDriver.countAll ? countDriver.countAll : 0}）` }}
        </li>
      </ul>
      <div class="left-tree-panel__content">
        <!-- 车辆树 -->
        <div v-show="currentType === '1'">
          <ul class="btn-list-box">
            <li
              :class="{ active: vehicleActiveTab === '0' }"
              @click="handleVehicleTab('0')"
            >
              {{
                `全部（${countVehicle.countAll ? countVehicle.countAll : 0}）`
              }}
            </li>
            <li
              :class="{ active: vehicleActiveTab === '1' }"
              @click="handleVehicleTab('1')"
            >
              {{
                `在线（${
                  countVehicle.countOnline ? countVehicle.countOnline : 0
                }）`
              }}
            </li>
          </ul>
          <div class="device-search-box">
            <el-input
              v-model="vehicleParams.licenseNumber"
              placeholder="请输入车牌号搜索"
              clearable
              size="small"
              class="device-search-input"
            />
            <div class="ly-flex-pack-justify">
              <el-select
                v-model="vehicleParams.carrierType"
                class="device-search-select"
                @change="vehicleQuery"
                placeholder="车辆类型"
                size="small"
                clearable
                filterable
              >
                <el-option
                  v-for="dict in vehicleCarrierTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select
                v-model="vehicleParams.vehicleStatus"
                class="device-search-select"
                @change="vehicleQuery"
                placeholder="车辆状态"
                size="small"
                clearable
                filterable
              >
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
              :expand-on-click-node="false"
              :filter-node-method="vehicleFilterNode"
              :indent="24"
              :highlight-current="true"
              node-key="code"
              :current-node-key="orgOrVehicleCode"
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
                    <img
                      class="img-box"
                      :src="
                        require('@/assets/images/device/car_type_' +
                          (data.carrierType || 'qt') +
                          '.png')
                      "
                    />
                    <div class="info-box ly-flex-1">
                      <h5>
                        {{ data.orgOrlicenseNumber }}
                        <span class="type">{{
                          selectDictLabel(
                            vehicleCarrierTypeOptions,
                            data.carrierType
                          )
                        }}</span>
                      </h5>
                      <p>
                        <!-- 在线/离线 -->
                        <span
                          v-if="data.deviceStatus === 1"
                          class="status green"
                          ><strong>· </strong>设备在线</span
                        >
                        <span v-if="data.deviceStatus === 0" class="status gray"
                          ><strong>· </strong>设备离线</span
                        >
                        <!-- 设备状态 -->
                        <span
                          v-if="
                            data.vehicleStatus !== null &&
                            data.vehicleStatus !== undefined
                          "
                          class="status"
                          :class="
                            selectDictColor(
                              vehicleStatusOptions,
                              data.vehicleStatus
                            )
                          "
                        >
                          <strong>· </strong
                          >{{
                            selectDictLabel(
                              vehicleStatusOptions,
                              data.vehicleStatus
                            )
                          }}
                        </span>
                      </p>
                    </div>
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </div>
        <!-- 司机树 -->
        <div v-show="currentType === '2'">
          <!-- <ul class="btn-list-box">
            <li v-for="item in driverTablist" :key="item.code" :class="{active: item.code === driverActiveTab}" @click="handleDriverTab(item.code)">{{ `${item.tabName}（10）` }}</li>
          </ul> -->
          <div class="device-search-box">
            <el-input
              v-model="driverParams.driverName"
              placeholder="请输入司机姓名搜索"
              clearable
              size="small"
              class="device-search-input"
            />
            <el-select
              v-model="driverParams.driverStatus"
              class="device-search-select"
              style="width: 100%"
              @change="driverQuery"
              placeholder="司机状态"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="dict in driverStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </div>
          <div class="device-info-list-box own-map-panel-tree map-scroll-panel">
            <el-tree
              ref="driverTree"
              :data="driverTreeOptions"
              :props="driverTreeProps"
              :expand-on-click-node="false"
              :filter-node-method="driverFilterNode"
              :indent="24"
              :highlight-current="true"
              node-key="code"
              :current-node-key="driverCode"
              default-expand-all
              @node-click="driverNodeClick"
            >
              <span slot-scope="{ data }">
                <template v-if="!data.driverFlag">
                  <span class="node-label">
                    <i class="tree-node-icon" :class="data.icon" />
                    {{ data.orgOrDriverName }}
                  </span>
                </template>
                <template v-if="data.driverFlag">
                  <div
                    class="tree-node-driver-box ly-flex ly-flex-align-center"
                  >
                    <img class="driver-avatar" src="~@/assets/images/device/driver_avatar.png" />
                    <span class="driver-name">{{ data.orgOrDriverName }}</span>
                    <!-- 司机状态 -->
                    <span
                      v-if="
                        data.driverStatus !== null &&
                        data.driverStatus !== undefined
                      "
                      class="status"
                      :class="
                        selectDictColor(driverStatusOptions, data.driverStatus)
                      "
                    >
                      <strong>· </strong
                      >{{
                        selectDictLabel(driverStatusOptions, data.driverStatus)
                      }}
                    </span>
                  </div>
                </template>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>

    <!-- 地图 -->
    <div id="device-map-container" />

    <!-- 设备信息 -->
    <Infos
      v-if="
        (headerTab === 1 && isShowVehicleInfo) ||
        (headerTab === 2 && showVehicleDetail)
      "
      ref="InfosRef"
      class="map-info-panel"
      :class="
        headerTab === 2 && showVehicleDetail ? 'vehicle-detail-panel' : ''
      "
      :vehicleCode="orgOrVehicleCode"
    />

    <!-- 车辆监控 -->
    <WarnList
      v-if="headerTab === 1"
      ref="WarnListRef"
      class="warn-list-panel"
      :vehicleCode="orgOrVehicleCode"
      :orgOrVehicleInfo="orgOrVehicleInfo"
    />

    <!-- 调度指派 -->
    <DispatchList
      v-if="headerTab === 2"
      ref="DispatchListRef"
      class="dispatch-list-panel"
    />

    <!-- 派车 -->
    <DispatchVehicle />
    <!-- 车辆详情 -->
    <!-- <VehicleDetail
      v-if="showVehicleDetail"
      class="vehicle-detail-panel"
    /> -->

    <!-- 轨迹回放 -->
    <TrackList
      v-if="headerTab === 3"
      ref="TrackListRef"
      class="track-list-panel"
      :isShowVehicleInfo="isShowVehicleInfo"
      :orgOrVehicleCode="orgOrVehicleCode"
      :orgOrVehicleInfo="orgOrVehicleInfo"
      :locationProp="locationProp"
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
import Infos from "./components/infos.vue";
import WarnList from "./warning/warnList.vue";
import DispatchList from "./dispatch/dispatchList.vue";
import DispatchVehicle from "./dispatch/dispatchVehicle";
import VehicleDetail from "./dispatch/vehicleDetail";
import TrackList from "./track/trackList.vue";
import { http_request } from "@/api";
import store from "@/store";
import { mapState } from "vuex";
export default {
  name: "MapInfo",
  components: {
    Infos,
    WarnList,
    DispatchList,
    DispatchVehicle,
    VehicleDetail,
    TrackList,
  },
  data() {
    return {
      // 地图
      map: null,
      geocoder: null,
      // 时间
      timer: null,
      currentday: "",
      currentDate: "",
      currentTime: "",
      // 树切换
      currentType: "1",
      // 车小tab
      vehicleActiveTab: "0",
      // 车各个状态统计值
      countVehicle: {
        countAll: 0, // 所有
        countOnline: 0, // 在线
        countOffline: 0, // 离线
        countIdle: 0, // 空闲
        countInTask: 0, // 任务
        countRepair: 0, // 维修
        countMaintenance: 0, // 保养
      },
      // 车树查询
      vehicleParams: {
        deviceStatus: undefined,
        licenseNumber: undefined,
        carrierType: undefined,
        vehicleStatus: undefined,
      },
      // 车辆承运类型字典
      vehicleCarrierTypeOptions: [],
      // 车辆状态字典
      vehicleStatusOptions: [
        { dictLabel: "空闲中", dictValue: 0, color: "blue" },
        { dictLabel: "任务中", dictValue: 1, color: "green" },
        { dictLabel: "维修中", dictValue: 2, color: "red" },
        { dictLabel: "保养中", dictValue: 3, color: "yellow" },
      ],
      // 车树
      vehicleTreeOptions: undefined,
      vehicleTreeProps: {
        children: "children",
        label: "orgOrlicenseNumber",
      },
      // 当前选中的车节点
      orgOrVehicleCode: undefined,
      orgOrVehicleInfo: null,
      // 司机小tab
      driverActiveTab: "0",
      driverTablist: [
        {
          code: "0",
          tabName: "空闲",
        },
        {
          code: "1",
          tabName: "任务",
        },
      ],
      // 司机各个状态统计值
      countDriver: {
        countAll: 0, // 全部
        countIdle: 0, // 空闲
        countInTask: 0, // 任务中
        countUnavailable: 0, // 不可用
      },
      // 司机树查询
      driverParams: {
        driverName: undefined,
        driverStatus: undefined,
      },
      // 司机状态字典
      driverStatusOptions: [
        { dictLabel: "任务中", dictValue: 0, color: "green" },
        { dictLabel: "空闲中", dictValue: 1, color: "blue" },
        { dictLabel: "不可用", dictValue: 2, color: "gray" },
      ],
      // 司机树
      driverTreeOptions: undefined,
      driverTreeProps: {
        children: "children",
        label: "orgOrDriverName",
      },
      // 当前选中的司机节点
      driverCode: undefined,
      // 通过这个值判断当前是否选中车辆
      isShowVehicleInfo: false,
      // 地图切换
      headerTab: 1,
      headerTabList: [
        { code: 1, label: "车辆监控" },
        { code: 2, label: "调度指派" },
        { code: 3, label: "轨迹回放" },
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
      endMarker: null,
      // 地图点位集合
      markerList: {},
      // 定时刷新地图点位
      refreshMarkerTimer: null,
      // 不同承运类型车辆图片大小不同所以点位偏移不同
      offsetList: {
        ztc: [-17, -38],
        jbc: [-17, -40],
        llc: [-14, -31],
        phc: [-15, -39],
        qt: [-15, -39],
      },
      // showVehicleDetail: false,  //车辆详情组件显示
      locationProp: null, //路由上有参数时
      // 实时告警点位marker
      realWarnMarker: null
    };
  },

  watch: {
    "vehicleParams.licenseNumber": {
      handler() {
        this.vehicleQuery();
      },
    },
    "driverParams.driverName": {
      handler() {
        this.driverQuery();
      },
    },
  },
  computed: {
    showDispatchVehicle() {
      return this.$store.getters.showDispatchVehicle;
    },
    showVehicleDetail() {
      return this.$store.getters.showVehicleDetail;
    },
    // isFresh() {
    //   if(this.$store.getters.isFresh){
    //     //TODO...

    //     this.$store.commit('set_isFresh',false);
    //   }
    //   return this.$store.getters.isFresh;
    // },
    // vehicleInfo() {
    //   console.log(123)
    //   return this.$store.getters.vehicleInfo;
    // },
  },
  mounted() {
    if (document.location.search.includes("trackType")) {
      console.log('document.location.search.split("=")', document.location);
      this.locationProp = this.locationQueryDeal();
      this.headerTab = Number(this.locationProp.trackType);
    }
    // 时间
    this.getCurrentTime();
    this.refreshTime();
    // 地图
    this.$nextTick(() => {
      this.initMap();
    });
    // 字典
    this.getDictData();
    // 统计值
    this.getCountVehicle();
    this.getCountDriver();
    // 树
    this.getOrgVehicleTree();
    this.getOrgDriverTree();
    // 获取全部车定位
    this.getVehicleLoLocations();
    // 开启车辆位置定时刷新
    this.refreshMarker();
  },
  beforeDestroy() {
    this.clearTimer();
    this.clearRefreshMarkerTimer();
  },
  methods: {
    locationQueryDeal() {
      const url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
      const theRequest = new Object();
      if (url.indexOf("?") != -1) {
        const str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      console.log("theRequest", theRequest);
      return theRequest;
    },

    /** 初始化地图 */
    initMap() {
      if (!AMap) {
        this.msgWarning("地图加载失败，请刷新页面重试");
        return;
      }
      this.map = new AMap.Map("device-map-container", {
        mapStyle: "amap://styles/2fe468ae95b55caa76404a537353e63a", //设置地图的显示样式
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11,
      });
      console.log(
        "==========>",
        new AMap.Geocoder({
          radius: 1000,
          extensions: "all",
        })
      );
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all",
      });
    },
    /** 绘制标记
     * @param {Array} position 经纬度必传
     * @param {Object} labelText 信息窗内容,没有就不传
     * @param {string} content 图标
     * @param {Array} offset 图标偏移量
     * @param {number} angle 旋转角度
     */
    drawMarker(
      position,
      {
        clickable = true,
        content = '<div class="own-device-marker-car qt"></div>',
        offset = [0, 0],
        angle = 0,
      }
    ) {
      const marker = new AMap.Marker({
        map: this.map,
        position,
        content,
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(offset[0], offset[1]),
        angle,
        clickable,
        topWhenClick: true, // 鼠标点击时marker置顶
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
     * @param {string} info 文本标签内容,没有就不传
     * @param {Array} offset 文本标签偏移量
     * @param {string} direction 文本标签出现位置 top'|'right'|'bottom'|'left'|'center
     */
    setLabelContent(info = [], { offset = [0, -8], direction = "top" }) {
      const option =
        info.length > 0
          ? {
              offset: new AMap.Pixel(offset[0], offset[1]),
              content: info.join(""),
              direction,
            }
          : {};
      return option;
    },
    /** 实例化窗体并打开
     * @param {Array} position 经纬度必传
     * @param {Object} info 动态内容
     * @param {string} anchor 图标锚点
     * @param {Array} offset 窗体偏移量
     */
    markerInfoInit(
      position,
      { info = [], offset = [10, -12], anchor = "bottom-center" }
    ) {
      const infoWindow = new AMap.InfoWindow({
        isCustom: false, // 使用自定义窗体
        content: info.join(""),
        offset: new AMap.Pixel(offset[0], offset[1]),
        anchor,
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
      const _this = this;
      return new Promise((resolve, reject) => {
        let address;
        _this.geocoder.getAddress(position, function (status, result) {
          if (status === "complete" && result.info === "OK") {
            if (result && result.regeocode) {
              const { formattedAddress } = result.regeocode;
              address = formattedAddress;
            }
            resolve(address);
          }
        });
      });
    },
    /** 绘制线
     * @param {Array} path 组成轨迹的点数组必传
     * @param {Array} strokeColor 轨迹线颜色
     * @param {Array} strokeWeight 轨迹粗细
     * @param {Array} showDir 线内是否显示箭头
     */
    drawLine(
      path = [],
      { strokeColor = "#1990FF", strokeWeight = 8, showDir = true }
    ) {
      const polyline = new window.AMap.Polyline({
        map: this.map,
        path,
        strokeColor,
        strokeWeight,
        showDir,
        lineJoin: "round",
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
    drawCircle(
      center,
      radius,
      {
        strokeColor = "#ff4d4d",
        strokeOpacity = 1,
        strokeWeight = 3,
        fillColor = "#ff4d4d",
        fillOpacity = 0.3,
      }
    ) {
      const circle = new AMap.Circle({
        map: this.map,
        center: center,
        radius: radius,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity,
      });
      return circle;
    },
    /** 清除地图所有绘制的覆盖物 */
    clearMap() {
      this.map.clearMap();
    },
    /** 清除指定的地图点位集合 */
    clearMarkerList() {
      for (const key in this.markerList) {
        this.markerList[key].setMap(null);
        this.markerList[key] = null;
      }
      this.markerList = {};
    },
    /** 判断当前位置是否在可视区域 */
    isPointInRing(position) {
      const bounds = this.map.getBounds();
      const NorthEast = bounds.getNorthEast();
      const SouthWest = bounds.getSouthWest();
      const SouthEast = [NorthEast.lng, SouthWest.lat];
      const NorthWest = [SouthWest.lng, NorthEast.lat];
      const path = [
        [NorthEast.lng, NorthEast.lat],
        SouthEast,
        [SouthWest.lng, SouthWest.lat],
        NorthWest,
      ]; // 将地图可视区域四个角位置按照顺序放入path，用于判断point是否在可视区域
      const isPointInRing = AMap.GeometryUtil.isPointInRing(position, path); // 判断point是否在可视区域
      return isPointInRing;
    },
    /** 绘制巡航轨迹 */
    initPathSimplifier() {
      const that = this;
      AMapUI.load(["ui/misc/PathSimplifier"], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
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
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            return "";
          },
          // 自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
          // 绘制路线节点
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: "#4682FA",
              lineWidth: 8,
              dirArrowStyle: false,
            },
            pathLineHoverStyle: null,
            pathLineSelectedStyle: {
              strokeStyle: "#4682FA",
              lineWidth: 8,
              dirArrowStyle: false,
            },
            renderAllPointsIfNumberBelow: -1, // 绘制路线节点，如不需要可设置为-1
          },
        });
        // 设置数据
        that.pathSimplifierIns.setData([
          {
            path: that.$refs.TrackListRef.jmTracklist,
          },
        ]);
        // 对线路创建一个巡航器
        const icon = that.orgOrVehicleInfo.carrierType || "qt";
        const contentImg = require(`@/assets/images/device/map_car_${icon}.png`);
        that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
          loop: false, // 循环播放
          speed: that.navgtrSpeed, // 巡航速度，单位千米/小时
          pathNavigatorStyle: {
            width: 30,
            height: 78,
            // 使用图片
            content: PathSimplifier.Render.Canvas.getImageContent(
              contentImg,
              function onload() {
                // 图片加载成功，重新绘制一次
                that.pathSimplifierIns.renderLater();
              },
              function onerror(e) {
                that.msgError("图片加载失败！");
              }
            ),
            strokeStyle: null,
            fillStyle: null,
            // 经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 8,
              strokeStyle: "#4682FA",
              dirArrowStyle: true,
            },
          },
        });
        // 创建信息窗
        const info = [];
        info.push("<div class='own-map-navgtr-info-window'>");
        info.push(
          "<p class='input-item'><span class='speed'>速度：</span>" +
            that.$refs.TrackListRef.jmTrackInfolist[0].gpsSpeed +
            " km/h</p>"
        );
        info.push(
          "<p class='input-item'><span class='time'>时间：</span>" +
            that.$refs.TrackListRef.jmTrackInfolist[0].gpsTime +
            "</p>"
        );
        info.push("</div>");
        const infoWindow = that.markerInfoInit(
          that.$refs.TrackListRef.jmTracklist[0],
          { info, offset: [0, -20] }
        );
        // 巡航器移动事件
        that.navgtr.on("move", function (data, position) {
          const path = position.dataItem.pathData.path;
          const idx = position.dataItem.pointIndex; // 走到了第几个点
          const tail = position.tail; // 至下一个节点的比例位置
          const totalIdx = idx + tail;
          const len = path.length;
          // 设置当前轨迹点时间、速度
          that.$refs.TrackListRef.setCurrentTrackTimeAndSpeed(idx);
          // 计算下一个距离速度
          if (idx < len - 1) {
            that.navgtr.setSpeed(
              that.navgtrSpeed * that.$refs.TrackListRef.rateTime
            );
          }
          // 进度条实时展示tail
          that.$refs.TrackListRef.setSlideValue((totalIdx / len) * 100);
          // 移动的时候,信息窗体保持打开
          if (!infoWindow.getIsOpen()) {
            infoWindow.open(that.map, path[idx]);
          }
          // 重新设置信息窗口位置
          infoWindow.setPosition(path[idx]);
          // 重新设置信息窗体内容
          const nweInfo = [];
          nweInfo.push("<div class='own-map-navgtr-info-window'>");
          nweInfo.push(
            "<p class='input-item'><span class='speed'>速度：</span>" +
              that.$refs.TrackListRef.jmTrackInfolist[idx].gpsSpeed +
              " km/h</p>"
          );
          nweInfo.push(
            "<p class='input-item'><span class='time'>时间：</span>" +
              that.$refs.TrackListRef.jmTrackInfolist[idx].gpsTime +
              "</p>"
          );
          nweInfo.push("</div>");
          infoWindow.setContent(nweInfo.join(""));
          // 车超出视野范围后重新定位
          if (!that.isPointInRing(path[idx])) {
            that.map.setCenter(path[idx]);
          }
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.$refs.TrackListRef.setPlayStatus(0);
          }
          // 显示装\卸\停车点
          if (that.$refs.TrackListRef.jmTrackInfolist[idx].event_type) {
            const marker = that.drawMarker(path[idx], {
              clickable: false,
              content:
                '<div class="own-navgtr-marker ' +
                that.$refs.TrackListRef.jmTrackInfolist[idx].event_type +
                '"></div>',
              offset: [-15, -40],
              angle: 0,
            });
            setTimeout(() => {
              marker.setMap(null);
            }, 3 * 1000);
          }
        });
        // 绘制起点
        this.startMarker = this.drawMarker(
          this.$refs.TrackListRef.jmTracklist[0],
          {
            clickable: false,
            content:
              '<div class="own-device-line-icon start"><div>起</div></div>',
            offset: [-58, -58],
          }
        );
        // 绘制终点
        this.endMarker = this.drawMarker(
          this.$refs.TrackListRef.jmTracklist[
            this.$refs.TrackListRef.jmTracklist.length - 1
          ],
          {
            clickable: false,
            content:
              '<div class="own-device-line-icon end"><div>终</div></div>',
            offset: [-58, -58],
          }
        );
      });
    },
    /** 巡航轨迹事件 */
    startPathSimplifier() {
      this.$refs.TrackListRef.setPlayStatus(1);
      // this.map.setZoomAndCenter(12, this.$refs.TrackListRef.jmTracklist[0]);
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
      this.$refs.TrackListRef && this.$refs.TrackListRef.setSlideValue(0);
      this.$refs.TrackListRef && this.$refs.TrackListRef.setPlayStatus(0);
      this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
    },
    /** 进度条滑块触发改变巡航轨迹 */
    handleSlideChange(value) {
      if (!this.navgtr) return;
      const newVal =
        typeof value === "number" ? value : this.$refs.TrackListRef.slideValue;
      const num = parseInt(
        (newVal / 100) * this.$refs.TrackListRef.jmTracklist.length
      );
      const decimal =
        String(
          (newVal / 100) * this.$refs.TrackListRef.jmTracklist.length
        ).split(".")[1] || 0;
      this.navgtr.moveToPoint(num, Number("0." + decimal));
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
        this.currentday = "星期天";
      } else if (day === 1) {
        this.currentday = "星期一";
      } else if (day === 2) {
        this.currentday = "星期二";
      } else if (day === 3) {
        this.currentday = "星期三";
      } else if (day === 4) {
        this.currentday = "星期四";
      } else if (day === 5) {
        this.currentday = "星期五";
      } else if (day === 6) {
        this.currentday = "星期六";
      }
      this.currentDate = this.parseTime(date, "{y} / {m} / {d}");
      this.currentTime = this.parseTime(date, "{h}:{i}");
    },
    // 定时刷新时间
    refreshTime() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.getCurrentTime();
      }, 60 * 1000);
    },
    // 清除定时器
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    // 获取字典
    getDictData() {
      // 车辆承运类型
      this.getDicts("vehicle-carrier-type").then((response) => {
        this.vehicleCarrierTypeOptions = response.data;
      });
    },
    // 字典匹配颜色
    selectDictColor(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].dictValue == "" + value) {
          actions.push(datas[key].color);
          return true;
        }
      });
      return actions.join("");
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
      if (code === "0") {
        // 全部
        this.vehicleParams.deviceStatus = undefined;
      } else if (code === "1") {
        // 在线
        this.vehicleParams.deviceStatus = 1;
      }
      this.vehicleQuery();
    },
    // 获取车辆各个状态统计值
    getCountVehicle() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "countVehicle",
      };
      http_request(obj).then((res) => {
        this.countVehicle = res.data;
      });
    },
    // 获取车辆树数据
    getOrgVehicleTree() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "orgVehicleTree",
        data: this.vehicleParams,
      };
      http_request(obj).then((res) => {
        console.log("车 树 查询res", res);
        this.vehicleTreeOptions = res.data;
        let result = { row: null, isTure: false };
        if (this.locationProp) {
          this.recursionVehicleTree(res.data, result);
          console.log("result", result);
          if (result.isTure) this.vehicleNodeClick(result.row);
        }
      });
    },
    recursionVehicleTree(data, result) {
      const me = this;
      for (const el of data) {
        console.log(el);
        if (
          el.vehicleFlag &&
          el.orgOrVehicleCode &&
          el.orgOrVehicleCode == me.locationProp.vehicleCode
        ) {
          console.log("1221", el);
          result.row = el;
          result.isTure = true;
          return;
        } else {
          if (el.children) {
            me.recursionVehicleTree(el.children, result);
          }
        }
      }
    },
    // 车树查询
    vehicleQuery() {
      this.$refs.vehicleTree.filter(this.vehicleParams);
    },
    // 车树节点筛选
    vehicleFilterNode(vehicleParams, data) {
      const { licenseNumber, carrierType, vehicleStatus, deviceStatus } =
        vehicleParams;
      if (
        !licenseNumber &&
        !carrierType &&
        (vehicleStatus === undefined || vehicleStatus === null) &&
        (deviceStatus === undefined || deviceStatus === null)
      )
        return true;
      let flag1 = true,
        flag2 = true,
        flag3 = true,
        flag4 = true;
      if (licenseNumber && licenseNumber !== "")
        flag1 = data.orgOrlicenseNumber.indexOf(licenseNumber) !== -1;
      if (carrierType && carrierType !== "")
        flag2 = data.carrierType === carrierType;
      if (
        vehicleStatus !== undefined &&
        vehicleStatus !== null &&
        vehicleStatus !== ""
      )
        flag3 = data.vehicleStatus === vehicleStatus;
      if (
        deviceStatus !== undefined &&
        deviceStatus !== null &&
        deviceStatus !== ""
      )
        flag3 = data.deviceStatus === deviceStatus;
      return flag1 && flag2 && flag3 && flag4;
    },
    // 车树节点选中
    vehicleNodeClick(data) {
      if (this.orgOrVehicleCode === data.orgOrVehicleCode) return;
      console.log("tree-node: ", data);
      this.orgOrVehicleCode = data.orgOrVehicleCode;
      this.orgOrVehicleInfo = data;
      if (data.vehicleFlag) {
        // 选中车
        this.isShowVehicleInfo = true;
        this.$store.commit("set_showVehicleDetail", true);
        this.getDeviceLocationInfo(data.orgOrlicenseNumber);
      } else {
        // 选中组织
        this.isShowVehicleInfo = false;
        this.$store.commit("set_showVehicleDetail", false);
        this.getVehicleLoLocations(data.orgOrVehicleCode);
      }
    },
    // 司机小tab
    handleDriverTab(code) {
      if (this.driverActiveTab === code) return;
      this.driverActiveTab = code;
    },
    // 获取司机各个状态统计值
    getCountDriver() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "countDriver",
      };
      http_request(obj).then((res) => {
        this.countDriver = res.data;
      });
    },
    // 获取司机树数据
    getOrgDriverTree() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "orgDriverTree",
        data: this.driverParams,
      };
      http_request(obj).then((res) => {
        this.driverTreeOptions = res.data;
      });
    },
    // 司机树查询
    driverQuery() {
      this.$refs.driverTree.filter(this.driverParams);
    },
    // 司机树节点筛选
    driverFilterNode(driverParams, data) {
      const { driverName, driverStatus } = driverParams;
      if (!driverName && (driverStatus === undefined || driverStatus === null))
        return true;
      let flag1 = true,
        flag2 = true;
      if (driverName && driverName !== "")
        flag1 = data.orgOrDriverName.indexOf(driverName) !== -1;
      if (
        driverStatus !== undefined &&
        driverStatus !== null &&
        driverStatus !== ""
      )
        flag2 = data.driverStatus === driverStatus;
      return flag1 && flag2;
    },
    // 司机节点选中
    driverNodeClick(data) {},
    // 获取车辆定位列表
    getVehicleLoLocations(orgCode) {
      const params = orgCode ? { orgCode } : {};
      const obj = {
        moduleName: "http_map",
        method: "post",
        url_alias: "getVehicleLoLocations",
        data: params,
      };
      http_request(obj).then((res) => {
        console.log('res',res)
        // 绘制前先清空之前的绘制, 避免重复绘制
        this.clearMarkerList();
        if (res.data.rows && res.data.rows.length > 0) {
          // 绘制全部车辆点位
          res.data.rows.forEach((el) => {
            const { attribute } = el;
            if (
              attribute &&
              attribute.coordinate &&
              attribute.coordinate.value &&
              attribute.coordinate.value.length === 2 &&
              attribute.coordinate.value[0] &&
              attribute.coordinate.value[1]
            ) {
              this.drawVehicleMarker(el);
            }
          });
          // 只有在监控页，刷新点位后才有重新设置视野
          if(this.headerTab === 1) {
            this.$nextTick(() => {
              this.map.setFitView();
            }); 
          }
        } else {
          this.msgWarning("该组织下暂无车辆定位信息");
        }
      });
    },
    // 获取设备定位信息
    getDeviceLocationInfo(plateNumber) {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getDeviceLocationInfo",
        url_code: [plateNumber],
      };
      http_request(obj).then((res) => {
        const { data } = res;
        // 绘制前先清空之前的绘制, 避免重复绘制
        this.clearMarkerList();
        if (data) {
          // 绘制全部车辆点位
          const { attribute } = data;
          console.log('attribute',attribute)
          if (
            attribute &&
            attribute.coordinate &&
            attribute.coordinate.value &&
            attribute.coordinate.value.length === 2 &&
            attribute.coordinate.value[0] &&
            attribute.coordinate.value[1]
          ) {
            this.drawVehicleMarker(data);
            // 只有在监控页，刷新点位后才有重新设置视野
            if(this.headerTab === 1) {
              this.$nextTick(() => {
                this.map.setZoomAndCenter(13, attribute.coordinate.value);
              });
            }
            return;
          }
        }
        this.msgWarning("该车辆暂无定位信息");
      });
    },
    // 绘制车辆定位marker
    drawVehicleMarker(row) {
      const _this = this;
      const { vehicle_code, carrier_type, plate_number, attribute } = row;
      const direction = attribute.direction || {};
      const onlineStatus = attribute.onlineStatus || {};
      const speed = attribute.speed || {};
      const position = attribute.coordinate.value;
      const statusColor = onlineStatus === 1 ? "green" : "gray"; // 设备状态 0离线 1在线
      const contentValue = [];
      if (speed.text) contentValue.push(speed.text + " km/h");
      if (direction.text) contentValue.push(direction.text + "°");
      // 绘制标记
      const styleObj = {
        content:
          '<div style="transform:rotate(' +
          (direction.value || -30) +
          'deg)" class="own-device-marker-car ' +
          (carrier_type || "qt") +
          '"></div>',
        offset: this.offsetList[carrier_type || "qt"],
        angle: 0,
      };
      const marker = this.drawMarker(position, styleObj);
      this.markerList[vehicle_code] = marker;
      // 绘制文本框
      const info = [];
      info.push("<div class='own-map-vehicle-marker-label'>");
      info.push("<h5>" + plate_number);
      if (onlineStatus.text)
        info.push(
          "<span class='status " +
            statusColor +
            "'><strong class='mr5'>· </strong>" +
            onlineStatus.text +
            "</span>"
        );
      info.push("</h5>");
      if (contentValue.length > 0)
        info.push(
          "<p class='input-item'>" + contentValue.join("  |  ") + "</p>"
        );
      info.push("</div>");
      const content = this.setLabelContent(info, { offset: [0, -10] });
      this.setLabel(marker, content);
      // 双击定位
      marker.on("dblclick", function (e) {
        _this.map.setFitView(marker);
      });
      // 单击
      marker.on("click", function (e) {
        if (JSON.stringify(marker.getLabel()) === "{}") {
          _this.setLabel(marker, content);
        } else {
          _this.setLabel(marker, {});
        }
      });
    },
    // 切换地图tab
    handleHeaderTab(code) {
      console.log('切换地图tab',code)
      if (this.headerTab === code) return;
      this.headerTab = code;
      // 清除巡航轨迹
      this.clearPathSimplifierIns();
      // 关闭地图信息窗体
      this.closeInfoWindow();
      // 清除告警标记
      this.clearRealWarnMarker();
    },
    // 定时刷新车位置
    refreshMarker() {
      this.clearRefreshMarkerTimer();
      this.refreshMarkerTimer = setInterval(() => {
        if (this.isShowVehicleInfo) {
          // 选中车
          this.getDeviceLocationInfo(this.orgOrVehicleInfo.orgOrlicenseNumber);
        } else {
          // 选中组织
          this.getVehicleLoLocations(this.orgOrVehicleCode);
        }
      }, 60 * 1000);
    },
    // 清除定时刷新车位置
    clearRefreshMarkerTimer() {
      if (this.refreshMarkerTimer) clearInterval(this.refreshMarkerTimer);
    },
    // 绘制告警点位
    darwRealWarnMarker(row) {
      console.log('绘制告警点位：', row)
      // 绘制前先清除
      this.clearRealWarnMarker();
      if (row.lng && row.lat) {
        const styleObj = {
          content:
            '<div style="transform:rotate(' +
            (row.direction || -30) +
            'deg)" class="own-device-marker-warn ' +
            (row.carrier_type || "qt") +
            '"><div class="warn-car"></div><div class="warn-cirle"></div></div>',
          offset: this.offsetList[row.carrierType || "qt"],
          angle: 0,
        };
        this.realWarnMarker = this.drawMarker([row.lng, row.lat], styleObj);
        this.map.setCenter([row.lng, row.lat]);
      }
    },
    // 清除告警点位
    clearRealWarnMarker() {
      if (this.realWarnMarker) {
        this.realWarnMarker.setMap(null);
        this.realWarnMarker = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  margin: 0;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden !important;
  $header-height: 68px;
  $left-tree-width: 300px;
  $bottom: 16px;
  $right: 16px;

  > .header-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: $header-height;
    z-index: 999;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.28) 0%,
      #ffffff 100%
    );
    border-bottom: 1px solid #e4ecf4;
    > .logo {
      width: 136px;
      height: 46px;
      margin: 12px 2px 10px 16px;
    }
    > .time-box {
      padding: 4px 0 0 16px;
      position: relative;
      .time {
        font-size: 30px;
        font-family: Bahnschrift;
        font-weight: 600;
        line-height: 28px;
        color: #505361;
        padding-top: 2px;
        margin-right: 8px;
      }
      .date {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 14px;
        color: #505361;
      }
      &::before {
        content: "";
        height: 24px;
        width: 1px;
        background: #6a6d79;
        position: absolute;
        left: 4px;
        top: 24px;
      }
    }
    // tab
    .map-tab {
      font-size: 0;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      height: 100%;
      > li {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 100%;
        line-height: $header-height;
        color: #a7aabb;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        margin: 0 26px;
        &::after {
          content: "";
          width: 0;
          height: 4px;
          background: #4682fa;
          position: absolute;
          bottom: 0;
          left: 50%;
          transition: all 0.3s;
        }
        &.active {
          color: #3a3d4d;
          font-size: 20px;
          &::after {
            left: 8px;
            width: 74px;
          }
        }
      }
    }
    // 返回按钮
    .return-button {
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
      color: #3d4050;
      cursor: pointer;
      background: #eef1f3 url("~@/assets/images/device/return.png") no-repeat
        8px center;
    }
  }

  > .left-tree-panel {
    $tab-height: 48px;
    position: absolute;
    top: calc(#{$header-height} + #{$tab-height} + 18px);
    left: 0;
    bottom: $bottom;
    width: $left-tree-width;
    z-index: 998;

    // 大tab样式
    > .left-tree-panel__tab {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(-#{$tab-height});
      > li {
        width: 50%;
        height: $tab-height;
        background: #e3e7f0;
        border-radius: 6px 6px 0 0;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 700;
        line-height: 36px;
        color: #8592ad;
        cursor: pointer;
        text-align: center;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
        z-index: 0;
        transform: translateY(12px);
        transition: transform 0.4s;
        &:first-child {
          margin-right: 8px;
        }
        &.active {
          color: #3d4050;
          font-weight: 700;
          line-height: 48px;
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 6px -2px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(4px);
        }
      }
    }
    > .left-tree-panel__content {
      position: relative;
      height: 100%;
      z-index: 1;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 6px 3px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0 8px 8px 0;
      padding: 18px 0;
      > div {
        height: 100%;
      }
    }

    // 小tab样式
    .btn-list-box {
      font-size: 0;
      background: #e3e7f0;
      opacity: 1;
      border-radius: 5px;
      overflow: hidden;
      margin: 0 16px 12px;
      width: calc(100% - 32px);
      > li {
        display: inline-block;
        width: 50%;
        height: 36px;
        line-height: 32px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #8592ad;
        text-align: center;
        cursor: pointer;
        border: 2px solid #e3e7f0;
        border-radius: 4px;
        &.active {
          background: #ffffff;
          color: #3d4050;
        }
      }
    }

    // 搜索样式
    .device-search-box {
      padding: 0 16px;
      .label {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #8592ad;
        line-height: 32px;
      }
      .device-search-input {
        margin-bottom: 12px;
      }
      .device-search-select {
        margin-bottom: 12px;
        width: calc(50% - 4px);
      }
    }
    // 树盒子
    .device-info-list-box {
      height: calc(100% - 124px);
      overflow: auto;
    }
  }

  // 信息
  > .map-info-panel {
    position: absolute;
    top: calc(#{$header-height} + 12px);
    bottom: 254px;
    right: $right;
    z-index: 1000;
    width: 380px;
  }

  // 报警列表
  > .warn-list-panel {
    position: absolute;
    bottom: $bottom;
    left: calc(#{$left-tree-width} + 10px);
    right: $right;
    z-index: 1000;
    height: 226px;
  }
  // 调度指派
  > .dispatch-list-panel {
    position: absolute;
    padding-bottom: 32px;
    top: calc(#{$header-height} + 12px);
    right: $right;
    z-index: 1000;
    width: 380px;
    max-height: calc(100% - #{$header-height} - #{$bottom} - 12px);
  }

  //车辆详情
  > .vehicle-detail-panel {
    position: absolute;
    top: calc(#{$header-height} + 12px);
    right: calc(#{$right} + 390px);
    // width: 380px;
    // height: calc(100% - #{$header-height} - #{$bottom} - 12px);
    // z-index: 1000;
  }

  // 行车轨迹
  > .track-list-panel {
    position: absolute;
    top: calc(#{$header-height} + 12px);
    bottom: $bottom;
    right: $right;
    z-index: 1000;
    height: calc(100% - #{$header-height} - #{$bottom} - 12px);
  }

  // 地图
  > #device-map-container {
    width: 100%;
    height: 100%;
    // 地图信息窗体样式-覆盖
    ::v-deep.amap-info-sharp {
      display: none;
    }
    ::v-deep.amap-info-content {
      background: transparent;
      box-shadow: 0px 3px 5px rgba(206, 206, 206, 0.7);
      padding: 0;
      .amap-info-close {
        top: 6px;
        right: 6px !important;
      }
    }
    // 地图标记label样式-覆盖
    ::v-deep.amap-marker-label {
      border: none;
      font-size: 12px;
      line-height: 14px;
      background: transparent;
      color: #262626;
      box-shadow: none;
      padding: 0;
      // &::after{
      //   content: '';
      //   position: absolute;
      //   bottom: -6px;
      //   left: 50%;
      //   transform: translateX(-50%);
      //   border-left: 6px solid transparent;
      //   border-top: 6px solid #fff;
      //   border-right: 6px solid transparent;
      // }
    }
    // 车标记的信息样式
    ::v-deep.own-map-vehicle-marker-label {
      min-width: 218px;
      min-height: 40px;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 0px 3px 5px rgba(206, 206, 206, 0.7);
      border-radius: 4px;
      padding: 8px 12px;
      > h5 {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3d4050;
        > .status {
          float: right;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 24px;
          &.blue {
            color: #4682fa;
          }
          &.green {
            color: rgba(67, 185, 30, 1);
          }
          &.red {
            color: rgba(239, 105, 105, 1);
          }
          &.gray {
            color: rgba(173, 181, 189, 1);
          }
        }
      }
      > .input-item {
        height: 26px;
        line-height: 26px;
        background: #e4ecf4;
        opacity: 1;
        border-radius: 5px;
        margin-top: 8px;
        padding: 0 8px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #3d4050;
      }
    }
    // 巡航信息窗体样式
    ::v-deep.own-map-navgtr-info-window {
      min-width: 216px;
      max-width: 246px;
      min-height: 68px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      padding: 10px 18px 10px 14px;
      .input-item {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3d4050;
        > span {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #a6a8ad;
          margin-right: 2px;
          padding-left: 22px;
          &.speed {
            background: url("~@/assets/images/device/icon_speed.png") no-repeat
              0px 1px;
            background-size: 16px 16px;
          }
          &.time {
            background: url("~@/assets/images/device/icon_time.png") no-repeat
              0px 2px;
            background-size: 16px 16px;
          }
        }
      }
    }
    // 轨迹起点终点样式
    ::v-deep.own-device-line-icon {
      width: 118px;
      height: 118px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      padding: 31px;
      position: relative;
      > div {
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        margin: 16px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        position: relative;
        z-index: 1;
      }
      &::after {
        content: "";
        position: absolute;
        width: 56px;
        height: 56px;
        top: 31px;
        left: 31px;
        background: rgba(255, 255, 255, 0.72);
        border-radius: 50%;
        z-index: 0;
      }
      &.start {
        > div {
          background: linear-gradient(180deg, #ffbc00 0%, #ff9405 100%);
          box-shadow: 0px 0px 6px rgba(241, 184, 25, 0.35);
        }
      }
      &.end {
        > div {
          background: linear-gradient(180deg, #4682fa 0%, #1359e6 100%);
          box-shadow: 0px 0px 6px rgba(70, 130, 250, 0.49);
        }
      }
    }
    // 标记物车样式
    ::v-deep.own-device-marker-car {
      transform-origin: center center;
      &.ztc {
        width: 34px;
        height: 76px;
        background: url("~@/assets/images/device/map_car_ztc.png") no-repeat;
        background-size: 100% 100%;
      }
      &.jbc {
        width: 34px;
        height: 80px;
        background: url("~@/assets/images/device/map_car_jbc.png") no-repeat;
        background-size: 100% 100%;
      }
      &.llc {
        width: 28px;
        height: 62px;
        background: url("~@/assets/images/device/map_car_llc.png") no-repeat;
        background-size: 100% 100%;
      }
      &.phc {
        width: 31px;
        height: 79px;
        background: url("~@/assets/images/device/map_car_phc.png") no-repeat;
        background-size: 100% 100%;
      }
      &.qt {
        width: 31px;
        height: 79px;
        background: url("~@/assets/images/device/map_car_qt.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    // 巡航装卸货停车点样式
    ::v-deep.own-navgtr-marker {
      width: 30px;
      height: 48px;
      animation: show-marker 3s;
      @keyframes show-marker {
        0% {
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      &.loading {
        background: url("~@/assets/images/device/map_icon_loading.png")
          no-repeat;
        background-size: 100% 100%;
      }
      &.unloading {
        background: url("~@/assets/images/device/map_icon_unloading.png")
          no-repeat;
        background-size: 100% 100%;
      }
      &.vehicle-stop {
        background: url("~@/assets/images/device/map_icon_vehicle-stop.png")
          no-repeat;
        background-size: 100% 100%;
      }
    }
    // 告警标记样式
    ::v-deep.own-device-marker-warn{
      position: relative;
      transform-origin: center center;
      .warn-car{
        position: relative;
        z-index: 1;
      }
      &.ztc {
        .warn-car{
          width: 34px;
          height: 76px;
          background: url("~@/assets/images/device/map_car_ztc.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      &.jbc {
        .warn-car{
          width: 34px;
          height: 80px;
          background: url("~@/assets/images/device/map_car_jbc.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      &.llc {
        .warn-car{
          width: 28px;
          height: 62px;
          background: url("~@/assets/images/device/map_car_llc.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      &.phc {
        .warn-car{
          width: 31px;
          height: 79px;
          background: url("~@/assets/images/device/map_car_phc.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      &.qt {
        .warn-car{
          width: 31px;
          height: 79px;
          background: url("~@/assets/images/device/map_car_qt.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .warn-cirle{
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -45px;
        margin-top: -45px;
        width: 90px;
        height: 90px;
        border: 1px solid rgba(239, 105, 105, 0.6);
        border-radius: 50%;
        background: rgba(239, 105, 105, 0.15);
        z-index: 0;
        &::before{
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -80px;
          margin-top: -80px;
          width: 160px;
          height: 160px;
          border: 1px solid rgba(239, 105, 105, 0.4);
          border-radius: 50%;
          background: rgba(239, 105, 105, 0.08);
        }
        &::after{
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -114px;
          margin-top: -114px;
          width: 228px;
          height: 228px;
          border: 1px solid rgba(239, 105, 105, 0.2);
          border-radius: 50%;
          background: rgba(239, 105, 105, 0.04);
        }
      }
    }
  }
}
</style>

<style lang="scss">
// elementui 覆盖tab样式
.own-map-panel-tab {
  .el-tabs__item {
    color: #ccc;
    font-weight: 700;
    &.is-active {
      color: #000;
    }
  }
  .el-tabs__nav-wrap::after {
    background: transparent;
  }
}

// elementui 覆盖tree样式
.own-map-panel-tree {
  .el-tree {
    background: transparent;
  }
  .el-tree-node:before {
    display: none;
  }
  .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node__children {
    padding-left: 0;
  }
  .el-tree-node {
    padding-left: 0;
  }
  .el-tree-node__content {
    height: auto;
    min-height: 32px;
    .el-tree-node__expand-icon {
      padding: 6px;
      color: #ccc;
    }
    .tree-node-icon {
      margin-left: -2px;
    }
  }
  // 树节点状态标签
  .tree-node-car-box,
  .tree-node-driver-box {
    .status {
      display: inline-block;
      margin-right: 8px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      border-radius: 4px;
      padding: 0 8px;
      &.green {
        color: #43b91e;
        background: #e5f0e4;
      }
      &.gray {
        color: #959aa4;
        background: #f1f1f1;
      }
      &.blue {
        color: #4682fa;
        background: #e5ecf6;
      }
      &.red {
        color: #ef6969;
        background: #ffeeee;
      }
      &.yellow {
        color: #ffbc00;
        background: rgba(255, 188, 0, 0.09);
      }
    }
  }
  // 车的树节点
  .tree-node-car-box {
    .img-box {
      width: 48px;
      height: 48px;
      background: #f1f1f1;
      border-radius: 3px;
      margin: 6px 8px 6px 0;
    }
    .info-box {
      > h5 {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3d4050;
        > .type {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: #959aa4;
          margin-top: -4px;
        }
      }
      > p {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #959aa4;
        line-height: 24px;
      }
    }
  }
  // 司机的树节点
  .tree-node-driver-box {
    margin: 8px 0;
    .driver-avatar{
      width: 28px;
      height: 28px;
    }
    .driver-name{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      color: #3D4050;
      margin: 0 18px 0 8px;
    }
  }
}

// 滚动条样式
.map-scroll-panel::-webkit-scrollbar {
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.map-scroll-panel::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
}
.map-scroll-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>