<template>
  <div class="pages-info" v-loading="loading">
    <div id="routeplanning-map-container" />
    <div class="left-side">
      <div class="title">路径查询</div>
      <div class="form-container routeplanning">
        <div class="form-item">
          <span class="item-prefix start"></span>
          <place-auto-complete-input :place-info="startPosition" :search-place="searchPlace" @select-place="startPositionSelect">
            <span slot="prepend" style="color: #FFBC00; font-weight: bold">起</span>
          </place-auto-complete-input>
          <span class="item-suffix"></span>
        </div>
        <div class="form-item" v-for="item in midPositionList">
          <span class="item-prefix line"></span>
          <place-auto-complete-input :place-info="item" :search-place="searchPlace" @select-place="midPositionSelect">
            <span slot="prepend" style="color: #3D4050; font-weight: bold">经</span>
          </place-auto-complete-input>
          <span class="item-suffix">
            <span @click="removeMidPosition(item)" class="sf-button remove"></span>
          </span>
        </div>
        <div class="form-item">
          <span class="item-prefix line end"></span>
          <place-auto-complete-input :place-info="endPosition" :search-place="searchPlace" @select-place="endPositionSelect">
            <span slot="prepend" style="color: #4682FA; font-weight: bold">终</span>
          </place-auto-complete-input>
          <span class="item-suffix">
            <span @click="addMidPosition" class="sf-button add"></span>
          </span>
        </div>
        <div style="margin-top: 20px; text-align: center">
          <el-button :loading="isSearchDriving" type="primary" @click="searchPath">查询</el-button>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div class="title">路径信息</div>
      <el-form ref="routeInfoElForm" label-position="top" size="small" :model="routeInfoForm">
        <el-form-item label="路径名称" :rules="[{required: true, message: '必填'}]" prop="name">
          <el-input style="width: 240px;" v-model="routeInfoForm.name" placeholder="请输入路径名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="报警时段" required>
          <div style="display: flex; align-items: center">
            <div>
              <div style="margin-bottom: 15px"><el-time-picker style="width: 240px;" v-model="routeInfoForm.warningStartTime" :picker-options="{format: 'HH:mm'}" value-format="HH:mm" placeholder="请输入报警开始时间"/></div>
              <div><el-time-picker style="width: 240px;" v-model="routeInfoForm.warningEndTime" :picker-options="{format: 'HH:mm'}" value-format="HH:mm" placeholder="请输入报警结束时间"/></div>
            </div>
            <div style="width: 40px; flex: none; margin-left: 10px;">
              <span @click="switchWarningTime" class="exchange-time-button"></span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="路径偏离距离上限(米)" prop="offPathDistance" :rules="[{required: true, message: '必填'}]">
          <el-select style="width: 240px;" v-model="routeInfoForm.offPathDistance">
            <el-option :value="0"></el-option>
            <el-option :value="50"></el-option>
            <el-option :value="100"></el-option>
            <el-option :value="150"></el-option>
            <el-option :value="200"></el-option>
            <el-option :value="250"></el-option>
            <el-option :value="300"></el-option>
            <el-option :value="350"></el-option>
            <el-option :value="400"></el-option>
            <el-option :value="450"></el-option>
            <el-option :value="500"></el-option>
            <el-option :value="600"></el-option>
            <el-option :value="700"></el-option>
            <el-option :value="800"></el-option>
            <el-option :value="900"></el-option>
            <el-option :value="1000"></el-option>
            <span slot="prepend">米</span>
          </el-select>
          <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="font-size: 18px; margin-left: 10px">
            <img src="../../../../assets/images/stealingcoal/question.png" alt="question"/>
          </el-tooltip>
        </el-form-item>
<!--        <el-form-item label="路径偏离时长上限(分钟)" prop="offPathTime" :rules="[{required: true, message: '必填'}]">-->
<!--          <el-select style="width: 240px;" v-model="routeInfoForm.offPathTime">-->
<!--            &lt;!&ndash;              0、1、2、3、4、5、10、20、30、60&ndash;&gt;-->
<!--            <el-option :value="0"></el-option>-->
<!--            <el-option :value="1"></el-option>-->
<!--            <el-option :value="2"></el-option>-->
<!--            <el-option :value="3"></el-option>-->
<!--            <el-option :value="4"></el-option>-->
<!--            <el-option :value="5"></el-option>-->
<!--            <el-option :value="10"></el-option>-->
<!--            <el-option :value="20"></el-option>-->
<!--            <el-option :value="30"></el-option>-->
<!--            <el-option :value="60"></el-option>-->
<!--            <span slot="suffix">分钟</span>-->
<!--          </el-select>-->
<!--          <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="font-size: 18px;margin-left: 10px">-->
<!--            <img src="../../../../assets/images/stealingcoal/question.png"/>-->
<!--          </el-tooltip>-->
<!--        </el-form-item>-->
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {http_request} from "../../../../api";
import {debounce} from "../../../../utils";
import PlaceAutoCompleteInput from "./PlaceAutoCompleteInput";

function objectDiff(obj1, obj2) {
  for (const obj1Key in obj1) {
    if (obj1[obj1Key] !== obj2[obj1Key]) {
      return true
    }
  }
  return false
}
export default {
  name: "PlaningMap",
  components: {PlaceAutoCompleteInput},
  data () {
    return {
      loading: false,
      type: null,
      code: null,
      map: null,
      geocoder: null,
      saveData: null,
      midPositionList: [],
      startPosition: {
        name: null,
        position: null,
        marker: null,
      },
      endPosition: {
        name: null,
        position: null,
        marker: null
      },
      routeInfoForm: {
        name: null,
        warningStartTime: null,
        warningEndTime: null,
        offPathDistance: 0,
        offPathTime: 0,
      },
      truckDrivingInfoForm: {
        size: 4,
        width: 2.5,
        height: 1.6,
        load: 0.9,
        weight: 10,
        axlesNum: 2,
      },
      currentTruckDrivingSetting: null,
      driving: null,
      truckDriving: null,
      drivingPathResult: null,
      isSearchDriving: false,
      mapAutoComplete: null,
    }
  },
  watch: {
    'startPosition.name': function (newVal) {
      if (!newVal) {
        this.startPosition.position = null
        if (this.startPosition.marker) this.map.remove(this.startPosition.marker)
        this.driving && this.driving.clear()
        this.truckDriving && this.truckDriving.clear()
      }
    },
    'endPosition.name': function (newVal) {
      if (!newVal) {
        this.endPosition.position = null
        if (this.endPosition.marker) this.map.remove(this.endPosition.marker)
        this.driving && this.driving.clear()
        this.truckDriving && this.truckDriving.clear()
      } else {
        // this.searchPlace(newVal, this.endPosition)
      }
    }
  },
  mounted() {
    let {type, code} = this.$route.query
    this.type = type
    this.code = code
    this.clearMap()
    setTimeout(() => {
      this.initMap()
    }, 1000)
  },
  methods: {
    midPositionSelect (info, item) {
      if (!item.location) return
      this.createMidMarker(item.location.lng, item.location.lat, info)
      this.trySearchDriving()
    },
    startPositionSelect (info, item) {
      if (!item.location) return
      this.makeFromPosition(item.location.lng, item.location.lat, item.value)
      this.trySearchDriving()
      console.log(arguments)
    },
    endPositionSelect (info, item) {
      if (!item.location) return
      this.makeEndPosition(item.location.lng, item.location.lat, item.value)
      this.trySearchDriving()
    },
    searchPlace (keyword, cb) {
      if (!keyword) {
        cb([])
        return
      }
      this.mapAutoComplete.search(keyword, function (status, res) {
        console.log('search', status, res)
        if (status === 'complete') {
          const list = res.tips.filter(item => !!item.location).map(item => {
            return {
              value: item.name,
              address: typeof item.address === 'string' ? item.address : item.district,
              location: item.location
            }
          })
          cb(list)
        } else {
          cb([])
        }
      })
    },
    async loadRouteDetail (code) {
      this.loading = true
      let res = await http_request({
        moduleName: "http_planRoute",
        method: "get",
        url_alias: "planRouteDetail",
        url_code: [code],
      })
      this.clearPath()
      let detail = res.data
      // let saveJson = JSON.parse(this.saveData)
      this.routeInfoForm.name = detail.route_name
      this.routeInfoForm.warningStartTime = detail.effective_time
      this.routeInfoForm.warningEndTime = detail.expires_time
      this.routeInfoForm.offPathDistance = detail.route_deviate_radius
      this.loading = false

      let start = detail.points[0]
      this.startPosition.name = start.point_name
      this.makeFromPosition(start.lng, start.lat, start.point_name)

      let end = detail.points[detail.points.length - 1]
      this.endPosition.name = end.point_name
      this.makeEndPosition(end.lng, end.lat, end.point_name)

      detail.points.splice(0, 1)
      detail.points.splice(detail.points.length - 1, 1)
      this.midPositionList = []
      detail.points.forEach(point => {
        this.createMidMarkerPosition(point.lng, point.lat, point.point_name)
      })
      this.searchPath()
    },
    switchWarningTime () {
      let _endTime = this.routeInfoForm.warningStartTime
      this.routeInfoForm.warningStartTime = this.routeInfoForm.warningEndTime
      this.routeInfoForm.warningEndTime = _endTime
    },
    clearMap () {
      // 这里是用来解决地图偶尔加载失败的问题
      localStorage.removeItem("_AMap_vectorlayer");
      localStorage.removeItem("_AMap_wgl");
      localStorage.removeItem("_AMap_sync");
      localStorage.removeItem("_AMap_raster");
      localStorage.removeItem("_AMap_overlay");
      localStorage.removeItem("_AMap_mouse");
      localStorage.removeItem("_AMap_AMap.ToolBar");
      localStorage.removeItem("_AMap_AMap.Scale");
      localStorage.removeItem("_AMap_AMap.RangingTool");
      localStorage.removeItem("_AMap_AMap.PolyEditor");
      localStorage.removeItem("_AMap_AMap.PlaceSearch");
      localStorage.removeItem("_AMap_AMap.OverView");
      localStorage.removeItem("_AMap_AMap.MouseTool");
      localStorage.removeItem("_AMap_AMap.MarkerClusterer");
      localStorage.removeItem("_AMap_AMap.MapType");
      localStorage.removeItem("_AMap_AMap.Geolocation");
      localStorage.removeItem("_AMap_AMap.CitySearch");
      localStorage.removeItem("_AMap_AMap.CircleEditor");
      localStorage.removeItem("_AMap_AMap.Autocomplete");
      localStorage.removeItem("_AMap_AMap.IndoorMap3D");
      localStorage.removeItem("_AMap_Map3D");
      localStorage.removeItem("_AMap_labelcanvas");
      localStorage.removeItem("_AMap_labelDir");
      localStorage.removeItem("_AMap_data.tileKeys");
      localStorage.removeItem("_AMap_AMap.CustomLayer");
      localStorage.removeItem("_AMap_AMap.Geocoder");
      localStorage.removeItem("_AMap_AMap.CustomLayer");
      localStorage.removeItem("_AMap_AMap.IndoorMap");
      localStorage.removeItem("_AMap_anole");
      localStorage.removeItem("_AMap_cmng");
      localStorage.removeItem("_AMap_cvector");
    },
    reversePath () {
      let _end = Object.assign({}, this.startPosition)
      Object.assign(this.startPosition, this.endPosition)
      Object.assign(this.endPosition, _end)
      this.midPositionList.reverse()
      this.startPosition.marker.setIcon('//webapi.amap.com/theme/v1.3/markers/n/start.png')
      this.endPosition.marker.setIcon('//webapi.amap.com/theme/v1.3/markers/n/end.png')
      this.trySearchDriving()
    },
    clearPath () {
      if (this.startPosition.marker) this.map.remove(this.startPosition.marker)
      if (this.endPosition.marker) this.map.remove(this.endPosition.marker)
      Object.assign(this.startPosition, {
        position: null,
        name: null,
        marker: null
      })
      Object.assign(this.endPosition, {
        position: null,
        name: null,
        marker: null
      })
      this.midPositionList.forEach(item => item.marker && this.map.remove(item.marker))
      this.midPositionList = []
      this.driving && this.driving.clear()
      this.truckDriving && this.truckDriving.clear()
    },
    addMidPosition () {
      let id = `addMidPosition${new Date().getTime()}`
      let midPosInfo = {
        marker: null,
        position: null,
        name: null,
        id,
      }
      let vm = this
      setTimeout(() => {
        let autocomplete = new AMap.Autocomplete({
          input: id
        })
        autocomplete.on('select', function (event) {
          if (!event.poi.location) return
          midPosInfo.name = event.poi.name
          vm.createMidMarker(event.poi.location.lng, event.poi.location.lat, midPosInfo)
          vm.trySearchDriving()
        })
      }, 1000)
      this.midPositionList.push(midPosInfo)
    },
    removeMidPosition (midPosition) {
      let idx = this.midPositionList.findIndex(item => item === midPosition)
      this.midPositionList.splice(idx, 1)
      if (midPosition.marker) this.map.remove(midPosition.marker)
      this.trySearchDriving()
    },
    showPath () {
      let saveJson = JSON.parse(this.saveData)
      let path = saveJson.path.map(item => [item.lng, item.lat])
      this.pathSimplifierIns.setData([
        {
          name: 'test',
          path: path
        }
      ])
      this.pathSimplifierIns.clearPath()
    },
    recoverDriving () {
      this.clearPath()
      let saveJson = JSON.parse(this.saveData)
      this.startPosition.name = saveJson.start.name
      this.endPosition.name = saveJson.end.name
      this.midPositionList = []
      saveJson.waypoints.forEach(point => {
        this.createMidMarkerPosition(point.lng, point.lat, point.name)
      })
      this.makeFromPosition(saveJson.start.lng, saveJson.start.lat, saveJson.start.name)
      this.makeEndPosition(saveJson.end.lng, saveJson.end.lat, saveJson.end.name)
      this.searchPath()
    },
    async save() {
      if (!this.drivingPathResult) {
        this.msgError('还未生成路径')
        return
      }
      await this.$refs.routeInfoElForm.validate()
      if (!this.routeInfoForm.warningStartTime) {
        this.msgError('请输入报警开始时间')
        return
      }
      if (!this.routeInfoForm.warningEndTime) {
        this.msgError('请输入报警结束时间')
        return
      }
      let waypoints = []
      let pointIndex = 0
      waypoints.push({
        pointName: this.startPosition.name,
        lng: this.drivingPathResult.start.location.lng,
        lat: this.drivingPathResult.start.location.lat,
        pointSort: pointIndex++,
      })
      let midWayPoints = this.midPositionList.map(item => {
        return {'lng':item.position.lng, 'lat':item.position.lat, pointName: item.name, pointSort: pointIndex++}
      })
      waypoints.push(...midWayPoints)
      waypoints.push({
        lng: this.drivingPathResult.end.location.lng,
        lat: this.drivingPathResult.end.location.lat,
        pointName: this.endPosition.name,
        pointSort: pointIndex++,
      })
      let path = []
      path.push(`${this.drivingPathResult.start.location.lng},${this.drivingPathResult.start.location.lat}`)
      this.drivingPathResult.routes[0].steps.forEach(step => {
        step.path.forEach(p => {
          path.push(`${p.lng},${p.lat}`)
        })
      })
      path.push(`${this.drivingPathResult.end.location.lng},${this.drivingPathResult.end.location.lat}`)
      let postData = {
        routeCode: this.code,
        routeName: this.routeInfoForm.name,
        routeCoordinates: path.join(';'),
        routeDeviateRadius: this.routeInfoForm.offPathDistance,
        effectiveTime: this.routeInfoForm.warningStartTime,
        expiresTime: this.routeInfoForm.warningEndTime,
        points: waypoints
      }
      let res = await http_request({
        moduleName: "http_planRoute",
        method: this.type === 'edit' ? "put" : "post",
        url_alias: this.type === 'edit' ? "planRouteUpdate" : "planRouteAdd",
        data: postData,
      })
      console.log(res)
      this.msgSuccess('保存成功')
      await this.$store.dispatch('tagsView/delVisitedView', {path: '/apps/planningroute/v1/map'})
      const latestView = this.$store.state.tagsView.visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        this.$router.push('/')
      }
    },
    searchPath () {
      if (!this.startPosition.position) {
        this.msgError('请输入起始位置')
        return
      }
      if (!this.endPosition.position) {
        this.msgError('请输入终点位置')
        return;
      }
      if (!this.checkMidPosition()) {
        this.msgError('途径点位置未选择')
        return;
      }
      this.driving.clear()
      if (this.truckDriving) this.truckDriving.clear()
      this.isSearchDriving = true
      let vm = this
      this.truckDrivingSearch().then(result => {
        vm.drivingPathResult = result
        vm.isSearchDriving = false
      }, error => {
        vm.msgError(`货车路线规划失败`)
        vm.drivingSearch().then(result => {
          vm.drivingPathResult = result
          vm.isSearchDriving = false
        }, error2 => {
          vm.isSearchDriving = false
          vm.msgError(`线路规划失败:${error2}`)
        })
      })
    },
    checkMidPosition () {
      for (let i = 0; i < this.midPositionList.length; i++) {
        let midInfo = this.midPositionList[i]
        if (!midInfo.position) {
          return false
        }
      }
      return true
    },
    drivingSearch () {
      return new Promise((resolve, reject) => {
        let waypoints = this.midPositionList.map(item => item.position)
        this.driving.search(this.startPosition.position, this.endPosition.position, { waypoints }, function(status, result) {
          if (status === 'complete') {
            resolve(result)
          } else {
            reject(status)
          }
        })
      })
    },
    truckDrivingSearch () {
      return new Promise((resolve, reject) => {
        if (!this.truckDriving || objectDiff(this.currentTruckDrivingSetting, this.truckDrivingInfoForm)) {
          this.currentTruckDrivingSetting = Object.assign({}, this.truckDrivingInfoForm)
          this.truckDriving = new AMap.TruckDriving(Object.assign({
            hideMarkers: true,
            showTraffic: false,
            outlineColor: '#4682FA',
            map: this.map
          }, this.currentTruckDrivingSetting))
        }
        let path = []
        path.push({lnglat: [this.startPosition.position.lng, this.startPosition.position.lat]})
        this.midPositionList.forEach(item => {
          path.push({lnglat: [item.position.lng, item.position.lat]})
        })
        path.push({lnglat: [this.endPosition.position.lng, this.endPosition.position.lat]})
        this.truckDriving.search(path, function (status, result) {
          if (status === 'complete') {
            resolve(result)
          } else {
            console.log('truckDriving fail!', status, result)
            reject(status)
          }
        })
      })
    },
    getAddressByPosition (lng, lat) {
      return new Promise(((resolve, reject) => {
        this.geocoder.getAddress([lng, lat], function(status, result) {
          console.log(status, result)
          if (status === 'complete' && result.info === 'OK') {
            resolve(result)
          } else {
            reject(status)
          }
        })
      }))
    },
    makeFromPosition (lng, lat, name) {
      let position = new AMap.LngLat(lng, lat)
      if (this.startPosition.marker) {
        this.map.remove(this.startPosition.marker)
      }
      let pointStartImage = require('../../../../assets/images/stealingcoal/point-start.png')
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        icon: pointStartImage,
        offset: new AMap.Pixel(-45, -45)
      })
      this.map.setCenter(position)
      this.map.add(marker)
      this.startPosition.position = position
      this.startPosition.marker = marker
    },
    makeEndPosition (lng, lat, name) {
      let position = new AMap.LngLat(lng, lat)
      if (this.endPosition.marker) {
        this.map.remove(this.endPosition.marker)
      }
      let pointEndImage = require('../../../../assets/images/stealingcoal/point-end.png')
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        icon: pointEndImage,
        offset: new AMap.Pixel(-45, -45)
      })
      this.map.setCenter(position)
      this.map.add(marker)
      this.endPosition.position = position
      this.endPosition.marker = marker
    },
    trySearchDriving() {
      if (!this.startPosition.position) {
        return
      }
      if (!this.endPosition.position) {
        return;
      }
      if (!this.checkMidPosition()) {
        return;
      }
      this.searchPath()
    },
    createMidMarkerPosition(lng, lat, name) {
      let midPositionInfo = {
        position: null,
        marker: null,
        name: name,
        id: `midPosition${new Date().getTime()}`
      }
      this.midPositionList.push(midPositionInfo)
      if (!name) {
        this.getAddressByPosition(lng, lat).then(res => {
          midPositionInfo.name = res.regeocode.formattedAddress
        })
      }
      this.createMidMarker(lng, lat, midPositionInfo)
    },
    createMidMarker (lng, lat, positionInfo) {
      if (positionInfo.marker) this.map.remove(positionInfo.marker)
      let position = new AMap.LngLat(lng, lat)
      let vm = this
      let midImg = require('../../../../assets/images/stealingcoal/point-mid.png')
      const midHtmlContent = `
<div class="amap-icon" style="position: absolute; left: 0; bottom: 0; width: 50px; height: 50px; opacity: 1;">
    <img src="${midImg}" style="width: 50px; height: 50px; top: 0px; left: 0px;">
</div>
<span style="position:absolute; left: 18px; bottom: -7px;display: block;background-color: white; border: solid #4682FA 5px; border-radius: 50%; width: 15px; height: 15px;"></span>
`
      const midDelHtmlContent = '<div title="删除此途经点" style="width: 14px; height: 14px; position: absolute; left: 50px; top: 30px; z-index: 2; background: url(https://webapi.amap.com/images/close.gif) 0px 0px no-repeat;"></div>'
      let marker = new AMap.Marker({
        position: position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        // icon: '//webapi.amap.com/theme/v1.3/markers/n/mid.png',
        draggable: true,
        offset: new AMap.Pixel(-25, -55),
        content: midHtmlContent
      })
      marker.on('click', function (event) {
        if (event.originEvent.target.title === '删除此途经点') {
          // console.log('marker', event, event.lnglat.lng, event.lnglat.lat)
          let idx = vm.midPositionList.findIndex(item => item === positionInfo)
          vm.midPositionList.splice(idx, 1)
          vm.map.remove(marker)
          vm.trySearchDriving()
        }
      })
      marker.on('mouseover', function (event) {
        marker.setContent(midHtmlContent + midDelHtmlContent)
      })
      marker.on('mouseout', function (event) {
        marker.setContent(midHtmlContent)
      })
      marker.on('dragend', function (event) {
        positionInfo.position = marker.getPosition()
        vm.getAddressByPosition(positionInfo.position.lng, positionInfo.position.lat).then(res => {
          positionInfo.name = res.regeocode.formattedAddress
        })
        vm.trySearchDriving()
      })
      positionInfo.position = position
      positionInfo.marker = marker
      vm.map.add(marker)
    },
    initMap () {
      let vm = this
      this.map = new AMap.Map("routeplanning-map-container", {
        mapStyle: "amap://styles/2fe468ae95b55caa76404a537353e63a", //设置地图的显示样式
        resizeEnable: true,
        autoFitView: true,
        // center: [116.303843, 39.983412],
        center: [116.407535, 39.915822],
        zoom: 11,
      })
      console.log("ckc init");
      this.map.plugin(['AMap.Geolocation', "AMap.Geocoder", "AMap.Autocomplete", 'AMap.Driving', 'AMap.TruckDriving'], function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false,        //显示定位按钮，默认：true
          buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(360, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        })
        vm.map.addControl(geolocation);
        geolocation.getCurrentPosition()
        vm.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all",
        })
        vm.driving = new AMap.Driving({
          map: vm.map,
          // panel: "panel",
          showTraffic: false,
          autoFitView: false,
          extensions: 'all',
          hideMarkers: true,
          outlineColor: '#4682FA'
        })
        vm.mapAutoComplete = new AMap.Autocomplete({
          city: '全国'
        })
        if (vm.type === 'edit') {
          vm.loadRouteDetail(vm.code)
        }
      })
      this.map.on('click', function (event) {
        if (!vm.startPosition.position) {
          vm.getAddressByPosition(event.lnglat.lng, event.lnglat.lat).then(res => {
            vm.startPosition.name = res.regeocode.formattedAddress
            vm.makeFromPosition(event.lnglat.lng, event.lnglat.lat, vm.startPosition.name)
            vm.trySearchDriving()
          })
          return
        }
        if (!vm.endPosition.position) {
          vm.getAddressByPosition(event.lnglat.lng, event.lnglat.lat).then(res => {
            vm.endPosition.name = res.regeocode.formattedAddress
            vm.makeEndPosition(event.lnglat.lng, event.lnglat.lat, vm.endPosition.name)
            vm.trySearchDriving()
          })
          return;
        }
        vm.createMidMarkerPosition(event.lnglat.lng, event.lnglat.lat)
        vm.searchPath()
      })
      // https://lbs.amap.com/api/amap-ui/reference-amap-ui/mass-data/pathsimplifier/#render
      AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
        vm.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: vm.map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            //返回鼠标悬停时显示的信息
            if (pointIndex >= 0) {
              //鼠标悬停在某个轨迹节点上
              return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
            }
            //鼠标悬停在节点之间的连线上
            return pathData.name + '，点数量' + pathData.path.length;
          },
          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'red',
              lineWidth: 6,
              dirArrowStyle: true
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.routeplanning {
  .form-item {
    .item-input {
      .el-input-group__prepend {
        padding: 0 10px;
      }
    }
  }
}
.route-planning-address-popper.el-autocomplete-suggestion li {
  padding: 5px 10px;
  .name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    line-height: 15px;
  }
  .address {
    font-size: 12px;
    color: #b4b4b4;
    line-height: 20px;
    min-height: 20px;
  }
}
</style>

<style scoped lang="scss">
.exchange-time-button {
  background: url("../../../../assets/images/stealingcoal/exchange.png") no-repeat;
  width: 30px;
  height: 30px;
  display: block;
}
.left-side {
  //margin: 0 0 15px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  border-radius: 3px;
  position: absolute;
  left: 50px;
  top: 40px;
  width: 320px;
  opacity: .8;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .form-container {
    padding-top: 15px;
    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      .item-prefix {
        flex: none;
        width: 30px;
        vertical-align: middle;
      }
      .item-prefix.line::before {
        content: '';
        width: 2px;
        height: 20px;
        border-left: dotted #D6D8DB 2px;
        position: absolute;
        left: 6px;
        top: -14px;
      }
      .item-prefix::after {
        content: '';
        background-color: white;
        display: inline-block;
        border: solid #D6D8DB 4px;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
      .item-prefix.start::after {
        border: solid #FFBC00 4px;
      }
      .item-prefix.end::after {
        border: solid #4682FA 4px;
      }
      .item-input.input-suffix-start {
        vertical-align: middle;
      }
      .item-suffix {
        flex: none;
        width: 30px;
        .sf-button {
          background: url("../../../../assets/images/stealingcoal/map-add.png") no-repeat;
          background-size: 100%;
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-left: 10px;
          vertical-align: middle;
        }
        .sf-button.remove {
          background: url("../../../../assets/images/stealingcoal/map-remove.png") no-repeat;
          background-size: 100%;
        }
      }
    }
  }
}
.right-side {
  padding: 20px 20px 0 20px;
  background: #fff;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  border-radius: 3px;
  position: absolute;
  right: 50px;
  top: 40px;
  width: 320px;
  opacity: .8;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.map-container {
  margin: 0;
  height: 100%;
}
#routeplanning-map-container {
  width: 100%;
  height: 100%;
}
</style>
