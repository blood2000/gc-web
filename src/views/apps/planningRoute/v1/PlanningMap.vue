<template>
  <div class="pages-info" v-loading="loading">
    <div class="pages-info-right">
      <div style="padding: 0 20px 10px 20px; display: flex;">
        <div style="font-weight: bold; font-size: 14px; line-height: 32px; flex: 1">{{type === 'add' ? '添加' : '编辑'}}规划路线
          <span style="font-size: 12px; color: #959AA4; font-weight: 400; margin-left: 10px;"><i class="el-icon-warning-outline"></i> 温馨提示：起终点可拖动更换位置哦！</span>
        </div>
        <div style="width: 80px; text-align: right">
          <el-button size="mini" type="primary" @click="goBack">返回</el-button>
        </div>
      </div>
      <div class="divier"></div>
      <div class="" style="height: calc(100% - 44px); padding: 20px 20px 0 20px; background-color: white; display: flex">
        <div class="map-container-box"><div id="routeplanning-map-container" /></div>
        <div class="operator-layout" style="flex:none;width: 400px; padding: 0 0 0 20px; position: relative">
          <el-tabs v-model="showTabIndex">
            <el-tab-pane label="路径信息" name="1"></el-tab-pane>
            <el-tab-pane label="监控信息" name="2"></el-tab-pane>
          </el-tabs>
          <div class="right-side" v-show="showTabIndex === '2'" style="height: calc(100% - 100px); overflow-y: auto">
            <el-form ref="routeInfoElForm" label-position="top" size="small" :model="routeInfoForm">
              <el-form-item label="路径偏离距离上限(米)" prop="offPathDistance" :rules="[{required: true, message: '必填'}]">
                <el-select style="width: 340px;" v-model="routeInfoForm.offPathDistance">
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
                </el-select>
                <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="font-size: 18px; margin-left: 10px">
                  <img src="../../../../assets/images/stealingcoal/question.png" alt="question"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="路径偏离时长上限(分钟)" prop="offPathTime" :rules="[{required: true, message: '必填'}]">
                <el-select style="width: 340px;" v-model="routeInfoForm.offPathTime">
                  <el-option :value="1"></el-option>
                  <el-option :value="2"></el-option>
                  <el-option :value="3"></el-option>
                  <el-option :value="4"></el-option>
                  <el-option :value="5"></el-option>
                  <el-option :value="10"></el-option>
                  <el-option :value="20"></el-option>
                  <el-option :value="30"></el-option>
                  <el-option :value="60"></el-option>
                </el-select>
                <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="font-size: 18px;margin-left: 10px">
                  <img src="../../../../assets/images/stealingcoal/question.png"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="监控时段" required>
                <div v-for="(timeRange,indx) in routeInfoForm.warningTimeList" style="display: flex; margin-bottom: 10px;">
                  <el-time-picker v-model="routeInfoForm.warningTimeList[indx]" is-range :picker-options="{format: 'HH:mm'}"
                                  start-placeholder="请选择开始时间"
                                  end-placeholder="请选择结束时间"
                                  style="width: 340px;"
                                  range-separator="至"
                                  value-format="HH:mm" placeholder="请输入报警时间">
                  </el-time-picker>
                  <span class="item-suffix">
                    <span @click="handleWarninTime(indx)" class="sf-button" :class="{'remove': indx !== routeInfoForm.warningTimeList.length - 1}"></span>
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="left-side" v-show="showTabIndex === '1'" style="height: calc(100% - 100px); overflow-y: auto">
            <el-form ref="routeInfoElForm" label-position="top" size="small" :model="routeInfoForm">
              <el-form-item label="路径名称" style="width: 350px" :rules="[{required: true, message: '必填'}]" prop="name">
                <el-input v-model="routeInfoForm.name" placeholder="请输入路径名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="车辆类型" :rules="[{required: true, message: '必填'}]" prop="routeType">
                <el-radio-group v-model="routeInfoForm.routeType">
                  <el-radio :label="1">汽车</el-radio>
                  <el-radio :label="2">货车</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="路线规划">
                <div class="form-container">
                  <div class="form-item">
                    <span class="item-prefix start"></span>
                    <place-auto-complete-input style="width: 249px;" class="path-start-input" :place-info="startPosition" :search-place="searchPlace" @select-place="startPositionSelect">
                      <span slot="prepend" style="color: #FFBC00; font-weight: bold">起</span>
                    </place-auto-complete-input>
                    <el-input v-model="startPosition.radius" class="pointer-radius-input">
                      <template slot="suffix">
                        <el-tooltip content="起点范围。单位米" placement="top" style="padding: 8px 3px 0 0;">
                          <img src="../../../../assets/images/stealingcoal/question.png" alt="question"/>
                        </el-tooltip>
                      </template>
                    </el-input>
                    <span class="item-suffix"></span>
                  </div>
                  <div class="form-item" v-for="item in midPositionList">
                    <span class="item-prefix line"></span>
                    <place-auto-complete-input style="width:320px" :place-info="item" :search-place="searchPlace" @select-place="midPositionSelect">
                      <span slot="prepend" style="color: #3D4050; font-weight: bold">经</span>
                    </place-auto-complete-input>
                    <span class="item-suffix">
                      <span @click="removeMidPosition(item)" class="sf-button remove"></span>
                    </span>
                  </div>
                  <div class="form-item">
                    <span class="item-prefix line end"></span>
                    <place-auto-complete-input style="width: 249px;" class="path-end-input" :place-info="endPosition" :search-place="searchPlace" @select-place="endPositionSelect">
                      <span slot="prepend" style="color: #4682FA; font-weight: bold">终</span>
                    </place-auto-complete-input>
                    <el-input v-model="endPosition.radius" class="pointer-radius-input">
                      <template slot="suffix">
                        <el-tooltip content="终点范围。单位米" placement="top" style="padding: 8px 3px 0 0;">
                          <img src="../../../../assets/images/stealingcoal/question.png" alt="question"/>
                        </el-tooltip>
                      </template>
                    </el-input>
                    <span class="item-suffix">
                      <span @click="addMidPosition" class="sf-button add"></span>
                    </span>
                  </div>
                  <!--              <div style="margin-top: 20px; text-align: center">-->
                  <!--                <el-button :loading="isSearchDriving" :disabled="isSearchDriving" type="primary" @click="searchPath">查询</el-button>-->
                  <!--              </div>-->
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div style="position: absolute; bottom: 0; text-align: right; width: 100%; padding: 0 20px;">
            <el-button type="text" size="mini" @click="goBack">取消</el-button>
            <span style="width: 20px; height: 2px; display: inline-block"></span>
            <el-button :loading="isSaving" :disabled="isSaving" type="primary" size="mini" @click="saveAction">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {http_request} from "../../../../api";
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
      showTabIndex: "1",
      isSaving: false,
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
        radius: 100,
        circleMarker: null,
      },
      endPosition: {
        name: null,
        position: null,
        marker: null,
        radius: 100,
        circleMarker: null,
      },
      routeInfoForm: {
        name: null,
        warningTimeList: [['00:00', '23:59']],
        warningTime: null,
        // warningEndTime: null,
        offPathDistance: 0,
        offPathTime: 0,
        routeType: 1,
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
        this.startPosition.circleMarker && this.map.remove(this.startPosition.circleMarker)
        this.driving && this.driving.clear()
        this.truckDriving && this.truckDriving.clear()
      }
    },
    'endPosition.name': function (newVal) {
      if (!newVal) {
        this.endPosition.position = null
        if (this.endPosition.marker) this.map.remove(this.endPosition.marker)
        this.endPosition.circleMarker && this.map.remove(this.endPosition.circleMarker)
        this.driving && this.driving.clear()
        this.truckDriving && this.truckDriving.clear()
      } else {
        // this.searchPlace(newVal, this.endPosition)
      }
    },
    'routeInfoForm.routeType': function (newVal) {
      this.trySearchDriving()
    },
    'startPosition.radius': function (newVal) {
      if (this.startPosition.circleMarker && newVal) {
        this.startPosition.circleMarker.setRadius(newVal)
      }
    },
    'endPosition.radius': function (newVal) {
      if (this.endPosition.circleMarker && newVal) {
        this.endPosition.circleMarker.setRadius(newVal)
      }
    }
  },
  mounted() {
    if (this.$parent.routeCode) {
      this.code = this.$parent.routeCode
      this.type = 'edit'
    } else {
      this.type = 'add'
    }
    console.log('code', this.code)
    // let {type, code} = this.$route.query
    // this.type = type
    // this.code = code
    this.clearMap()
    setTimeout(() => {
      this.initMap()
    }, 1000)
  },
  methods: {
    handleWarninTime (index) {
      if (index === this.routeInfoForm.warningTimeList.length - 1) { // 添加
        this.routeInfoForm.warningTimeList.push(['00:00', '23:59'])
      } else { // 删除
        this.routeInfoForm.warningTimeList.splice(index, 1)
      }
    },
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
              address: item.district + (typeof item.address === 'string' ? item.address : ''),
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
      // this.routeInfoForm.warningStartTime = detail.effective_time
      // this.routeInfoForm.warningEndTime = detail.expires_time
      this.routeInfoForm.offPathDistance = detail.route_deviate_radius
      this.routeInfoForm.offPathTime = detail.route_deviate_time || 0
      this.routeInfoForm.routeType = detail.route_type || 1
      this.loading = false

      let start = detail.points[0]
      this.startPosition.name = start.point_name
      this.startPosition.radius = start.radius || 100
      this.makeFromPosition(start.lng, start.lat, start.point_name)

      let end = detail.points[detail.points.length - 1]
      this.endPosition.name = end.point_name
      this.endPosition.radius = end.radius || 100
      this.makeEndPosition(end.lng, end.lat, end.point_name)

      detail.points.splice(0, 1)
      detail.points.splice(detail.points.length - 1, 1)
      this.midPositionList = []
      detail.points.forEach(point => {
        this.createMidMarkerPosition(point.lng, point.lat, point.point_name)
      })
      this.routeInfoForm.warningTimeList = []
      detail.monitor && detail.monitor.forEach(item => {
        this.routeInfoForm.warningTimeList.push([item.effectiveTime, item.expiresTime])
      })
      if (this.routeInfoForm.warningTimeList.length === 0) {
        this.routeInfoForm.warningTimeList.push(['', ''])
      }
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
    saveAction () {
      this.isSaving = true
      this.save().finally(() => {
        this.isSaving = false
      })
    },
    async goBack() {
      this.$parent.goBack()
      // await this.$store.dispatch('tagsView/delVisitedView', {path: '/apps/planningroute/v1/map'})
      // const latestView = this.$store.state.tagsView.visitedViews.slice(-1)[0];
      // if (latestView) {
      //   this.$router.push(latestView.fullPath);
      // } else {
      //   this.$router.push('/')
      // }
    },
    async save() {
      if (!this.drivingPathResult) {
        this.msgError('还未生成路径')
        return
      }
      await this.$refs.routeInfoElForm.validate()
      if (this.routeInfoForm.warningTimeList.length === 0) {
        this.msgError('请输入监控时段')
        return
      }
      let waypoints = []
      let pointIndex = 0
      waypoints.push({
        pointName: this.startPosition.name,
        lng: this.drivingPathResult.start.location.lng,
        lat: this.drivingPathResult.start.location.lat,
        radius: this.startPosition.radius,
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
        radius: this.endPosition.radius,
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

      let monitor = []
      let monitorIndex = 0
      this.routeInfoForm.warningTimeList.forEach(item => {
        monitor.push({
          effectiveTime: item[0],
          expiresTime: item[1],
          sort: monitorIndex++
        })
      })

      let postData = {
        routeCode: this.code,
        routeName: this.routeInfoForm.name,
        routeCoordinates: path.join(';'),
        routeDeviateRadius: this.routeInfoForm.offPathDistance,
        routeDeviateTime: this.routeInfoForm.offPathTime,
        // effectiveTime: this.routeInfoForm.warningStartTime,
        // expiresTime: this.routeInfoForm.warningEndTime,
        routeType: this.routeInfoForm.routeType,
        monitor: monitor,
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
      this.goBack()
      // await this.$store.dispatch('tagsView/delVisitedView', {path: '/apps/planningroute/v1/map'})
      // const latestView = this.$store.state.tagsView.visitedViews.slice(-1)[0];
      // if (latestView) {
      //   this.$router.push(latestView.fullPath);
      // } else {
      //   this.$router.push('/')
      // }
    },
    searchPath () {
      console.log('searchPath')
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
      if (this.routeInfoForm.routeType === 1) {
        vm.drivingSearch().then(result => {
          vm.drivingPathResult = result
          vm.isSearchDriving = false
        }, error => {
          vm.isSearchDriving = false
          vm.msgError(`线路规划失败:${error}`)
        })
      } else {
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
      }
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
            let pios = result.regeocode.pois
            let aois = result.regeocode.aois
            let positionName = aois && aois.length > 0 && aois[0].name
            positionName = positionName || pios && pios.length > 0 && pios[0].name
            positionName = positionName || result.regeocode.formattedAddress
            // console.log('positionName=', positionName)
            resolve(positionName)
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
      if (this.startPosition.circleMarker) {
        this.map.remove(this.startPosition.circleMarker)
      }
      let pointStartImage = require('../../../../assets/images/stealingcoal/point-start.png')
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        draggable: true,
        icon: pointStartImage,
        offset: new AMap.Pixel(-45, -45)
      })
      let circle = new AMap.Circle({
        center: position,
        radius: this.startPosition.radius,
        strokeColor: '#FFBB00',
        fillColor: '#FFB301',
        fillOpacity: 0.1,
        strokeWeight: 2, // 描边宽度
      })
      this.map.add(circle)
      this.startPosition.circleMarker = circle
      let vm = this
      marker.on('dragend', function (event) {
        let position = marker.getPosition()
        vm.startPosition.position = position
        circle.setCenter(position)
        vm.getAddressByPosition(position.lng, position.lat).then(name => {
          vm.startPosition.name = name
        })
        vm.trySearchDriving()
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
      if (this.endPosition.circleMarker) {
        this.map.remove(this.endPosition.circleMarker)
      }
      let pointEndImage = require('../../../../assets/images/stealingcoal/point-end.png')
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        icon: pointEndImage,
        draggable: true,
        offset: new AMap.Pixel(-45, -45)
      })
      let circle = new AMap.Circle({
        center: position,
        radius: this.endPosition.radius,
        strokeColor: '#4682FA',
        fillColor: '#4682FA',
        fillOpacity: 0.1,
        strokeWeight: 2, // 描边宽度
      })
      this.map.add(circle)
      this.endPosition.circleMarker = circle
      let vm = this
      marker.on('dragend', function (event) {
        let position = marker.getPosition()
        circle.setCenter(position)
        vm.endPosition.position = position
        vm.getAddressByPosition(position.lng, position.lat).then(name => {
          vm.endPosition.name = name
        })
        vm.trySearchDriving()
      })
      this.map.setCenter(position)
      this.map.add(marker)
      this.endPosition.position = position
      this.endPosition.marker = marker
    },
    trySearchDriving() {
      console.log('trySearchDriving')
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
        this.getAddressByPosition(lng, lat).then(name => {
          midPositionInfo.name = name
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
        vm.getAddressByPosition(positionInfo.position.lng, positionInfo.position.lat).then(name => {
          positionInfo.name = name
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
      this.map.plugin(['AMap.Geolocation', "AMap.Geocoder", "AMap.Autocomplete", 'AMap.Driving', 'AMap.TruckDriving', 'AMap.Circle'], function () {
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
        vm.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all",
        })
        vm.driving = new AMap.Driving({
          map: vm.map,
          // panel: "panel",
          showTraffic: false,
          autoFitView: true,
          extensions: 'all',
          hideMarkers: true,
          outlineColor: '#4682FA'
        })
        vm.mapAutoComplete = new AMap.Autocomplete({
          city: '全国'
        })
        if (vm.type === 'edit') {
          vm.loadRouteDetail(vm.code)
        } else {
          geolocation.getCurrentPosition()
        }
      })
      this.map.on('click', function (event) {
        if (!vm.startPosition.position) {
          vm.getAddressByPosition(event.lnglat.lng, event.lnglat.lat).then(name => {
            vm.startPosition.name = name
            vm.makeFromPosition(event.lnglat.lng, event.lnglat.lat, vm.startPosition.name)
            vm.trySearchDriving()
          })
          return
        }
        if (!vm.endPosition.position) {
          vm.getAddressByPosition(event.lnglat.lng, event.lnglat.lat).then(name => {
            vm.endPosition.name = name
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
    line-height: 16px;
    padding: 5px 0;
    //min-height: 20px;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
}
.left-side .form-container .form-item .el-autocomplete .el-input-group__prepend {
  padding: 0 10px;
}
.left-side .form-container .form-item .el-autocomplete .el-input__suffix {
  right: 0;
}
.left-side .form-container .form-item .path-start-input input,
.left-side .form-container .form-item .path-end-input input{
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.left-side .form-container .form-item .pointer-radius-input .el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 20px 0 10px;
  border-left: none;
  //width: 60px;
  //text-align: center;
}
.operator-layout .el-tabs__nav-wrap::after{
  background: transparent;

}
</style>

<style scoped lang="scss">
.exchange-time-button {
  background: url("../../../../assets/images/stealingcoal/exchange.png") no-repeat;
  width: 30px;
  height: 30px;
  display: block;
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
.left-side {
  overflow-y: auto;
  //margin: 0 0 15px;
  //padding: 20px;
  //background: #fff;
  //box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  //border-radius: 3px;
  //position: absolute;
  //left: 50px;
  //top: 40px;
  //width: 320px;
  //opacity: .8;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .form-container {
    //padding-top: 15px;
    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      .pointer-radius-input {
        flex: none;
        width: 70px;
      }
      .item-prefix {
        flex: none;
        width: 25px;
        vertical-align: middle;
      }
      .item-prefix.line::before {
        content: '';
        width: 2px;
        height: 20px;
        border-left: dotted #D6D8DB 2px;
        position: absolute;
        left: 4px;
        top: -14px;
      }
      .item-prefix::after {
        content: '';
        background-color: white;
        display: inline-block;
        border: solid #D6D8DB 3px;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        vertical-align: middle;
      }
      .item-prefix.start::after {
        border: solid #FFBC00 3px;
      }
      .item-prefix.end::after {
        border: solid #4682FA 3px;
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
  //padding: 20px 20px 0 20px;
  //background: #fff;
  //box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  //border-radius: 3px;
  //position: absolute;
  //right: 50px;
  //top: 40px;
  //width: 320px;
  //opacity: .8;
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

.map-container-box {
  position: relative;
  flex: 1;
  overflow: hidden;
}
#routeplanning-map-container {
  // width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 1388px;
  height: 100%;
}
</style>
