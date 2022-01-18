<template>
  <div class="map-container">
    <div id="routeplanning-map-container" />
    <div id="panel"></div>
    <div class="left-side">
      <el-row style="position: relative">
        <div style="top: 50%; position: absolute; left: 0;margin-top: -25px;">
          <el-button @click="reversePath" type="text" icon="el-icon-sort" style="font-size: 18px;"></el-button>
        </div>
        <el-col style="width: 100%; padding: 0 0 0 30px;">
          <el-form label-position="right">
            <el-form-item style="margin-bottom: 8px;">
              <el-input id="fromPositionInput" v-model="startPosition.name" clearable placeholder="起始位置" style="width: calc(100% - 60px)">
                <template slot="prefix">起</template>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 8px;" v-for="item in midPositionList">
              <el-input :id="item.id" v-model="item.name" placeholder="请输入途径点" clearable style="width: calc(100% - 60px)">
                <span slot="prefix">经</span>
              </el-input>
              <a href="#" @click="removeMidPosition(item)" style="font-size: 20px; margin-left: 5px; padding: 0 10px;"><i class="el-icon-remove-outline"></i></a>
            </el-form-item>
            <el-form-item style="margin-bottom: 8px;">
              <el-input id="toPositionInput" v-model="endPosition.name" clearable placeholder="终点位置" style="width: calc(100% - 60px)">
                <span slot="prefix">终</span>
              </el-input>
              <a href="#" @click="addMidPosition" style="font-size: 20px; margin-left: 5px; padding: 0 10px;"><i class="el-icon-circle-plus-outline"></i></a>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-button size="small" :loading="isSearchDriving" icon="el-icon-search" type="primary" @click="searchPath">搜索</el-button>
        <el-button size="small" type="primary" @click="clearPath">清除</el-button>
      </el-row>
      <div style="padding: 20px 0">
        <el-form label-width="80px" style="margin-right: 30px;">
          <el-form-item label="路径名称" :rules="[{required: true, message: '必填'}]">
            <el-input v-model="routeInfoForm.name" placeholder="请输入路径名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="报警时段" required>
            <el-row>
              <el-time-picker v-model="routeInfoForm.warningStartTime" value-format="HH:mm:ss" placeholder="请输入报警开始时间" style="width: 190px;"/>
              <el-tooltip content="仅在报警时段内，路径才会响应路径偏离算法的计算。" placement="top" style="position: absolute; right: -25px; top: 8px; font-size: 18px;">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-row>
            <div style="text-align: center">
              <a href="#" @click="switchWarningTime" style="font-size: 16px; padding: 0 10px"><i class="el-icon-sort"></i></a>
            </div>
            <el-row>
              <el-time-picker v-model="routeInfoForm.warningEndTime" value-format="HH:mm:ss" placeholder="请输入报警结束时间" style="width: 190px;"/>
            </el-row>
          </el-form-item>
          <el-form-item label-width="140px" label="路径偏离距离上限" :rules="[{required: true, message: '必填'}]">
            <el-select v-model="routeInfoForm.offPathDistance">
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
              <span slot="suffix">米</span>
            </el-select>
            <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="position: absolute; right: -25px; top: 8px; font-size: 18px;">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label-width="140px" label="路径偏离时长上限" :rules="[{required: true, message: '必填'}]">
            <el-select v-model="routeInfoForm.offPathTime">
<!--              0、1、2、3、4、5、10、20、30、60-->
              <el-option :value="0"></el-option>
              <el-option :value="1"></el-option>
              <el-option :value="2"></el-option>
              <el-option :value="3"></el-option>
              <el-option :value="4"></el-option>
              <el-option :value="5"></el-option>
              <el-option :value="10"></el-option>
              <el-option :value="20"></el-option>
              <el-option :value="30"></el-option>
              <el-option :value="60"></el-option>
              <span slot="suffix">分钟</span>
            </el-select>
            <el-tooltip content="该值将决定车辆允许偏离路径的最大值。同时也是报警开关中的范围的取值。" placement="top" style="position: absolute; right: -25px; top: 8px; font-size: 18px;">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row style="padding-top: 10px;">
        <el-input type="textarea" v-model="saveData">
          <span slot="prefix">ttt</span>
        </el-input>
      </el-row>
      <el-row style="padding-top: 10px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="recoverDriving">设置</el-button>
        <el-button type="primary" @click="showPath">路径</el-button>
      </el-row>
    </div>
    <div class="right-side">
      <el-form label-width="80px">
        <el-form-item label="车型大小">
          <el-select v-model="truckDrivingInfoForm.size">
            <el-option label="微型车" :value="1"/>
            <el-option label="轻型车" :value="2"/>
            <el-option label="中型车" :value="3"/>
            <el-option label="重型车" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="宽/高(米)">
          <el-row>
            <el-col :span="9">
              <el-input v-model="truckDrivingInfoForm.width"></el-input>
            </el-col>
            <el-col :span="1" style="width: 40px; text-align: center">-</el-col>
            <el-col :span="9">
              <el-input v-model="truckDrivingInfoForm.height"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="车重">
          <el-input v-model="truckDrivingInfoForm.weight">
            <span slot="append">吨</span>
          </el-input>
        </el-form-item>
        <el-form-item label="载重">
          <el-input v-model="truckDrivingInfoForm.load">
            <span slot="append">吨</span>
          </el-input>
        </el-form-item>
        <el-form-item label="车轴(数)">
          <el-input v-model="truckDrivingInfoForm.axlesNum"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
function objectDiff(obj1, obj2) {
  for (const obj1Key in obj1) {
    if (obj1[obj1Key] !== obj2[obj1Key]) {
      return true
    }
  }
  return false
}
export default {
  name: "index",
  data () {
    return {
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
      isSearchDriving: false
    }
  },
  watch: {
    'startPosition.name': function (newVal) {
      if (!newVal) {
        this.startPosition.position = null
        if (this.startPosition.marker) this.map.remove(this.startPosition.marker)
        this.driving.clear()
        if (this.truckDriving) this.truckDriving.clear()
      }
    },
    'endPosition.name': function (newVal) {
      if (!newVal) {
        this.endPosition.position = null
        if (this.endPosition.marker) this.map.remove(this.endPosition.marker)
        this.driving.clear()
        if (this.truckDriving) this.truckDriving.clear()
      }
    }
  },
  mounted() {
    this.clearMap()
    setTimeout(() => {
      this.initMap()
    }, 1000)
  },
  methods: {
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
      this.driving.clear()
      if (this.truckDriving) this.truckDriving.clear()
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
    save() {
      if (!this.drivingPathResult) return
      let waypoints = this.midPositionList.map(item => {
        return {'lng':item.position.lng, 'lat':item.position.lat, name: item.name}
      })
      let path = []
      this.drivingPathResult.routes[0].steps.forEach(step => {
        step.path.forEach(p => {
          path.push({lat: p.lat, lng: p.lng})
        })
      })
      let result = {
        start: {
          lng: this.drivingPathResult.start.location.lng,
          lat: this.drivingPathResult.start.location.lat,
          name: this.startPosition.name
        },
        end: {
          lng: this.drivingPathResult.end.location.lng,
          lat: this.drivingPathResult.end.location.lat,
          name: this.endPosition.name
        },
        waypoints,
        path,
        truckInfo: this.truckDrivingInfoForm,
        ...this.routeInfoForm
      }
      this.saveData = JSON.stringify(result)
      console.log(result)
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
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        icon: '//webapi.amap.com/theme/v1.3/markers/n/start.png'
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
      let marker = new AMap.Marker({
        position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: name,
        icon: '//webapi.amap.com/theme/v1.3/markers/n/end.png'
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
      let vm = this
      setTimeout(() => {
        let autocomplete = new AMap.Autocomplete({
          input: midPositionInfo.id
        })
        autocomplete.on('select', function (event) {
          if (!event.poi.location) return
          midPositionInfo.name = event.poi.name
          vm.createMidMarker(event.poi.location.lng, event.poi.location.lat, midPositionInfo)
          vm.trySearchDriving()
        })
      }, 1000)
      this.createMidMarker(lng, lat, midPositionInfo)
    },
    createMidMarker (lng, lat, positionInfo) {
      if (positionInfo.marker) this.map.remove(positionInfo.marker)
      let position = new AMap.LngLat(lng, lat)
      let vm = this
      const midHtmlContent = '<div class="amap-icon" style="position: absolute; overflow: hidden; width: 36px; height: 36px; opacity: 1;"><img src="https://webapi.amap.com/theme/v1.3/markers/n/mid.png" style="width: 19px; height: 31px; top: 0px; left: 0px;"></div>'
      const midDelHtmlContent = '<div title="删除此途经点" style="width: 14px; height: 14px; position: absolute; left: 20px; top: 16px; z-index: 2; background: url(https://webapi.amap.com/images/close.gif) 0px 0px no-repeat;"></div>'
      let marker = new AMap.Marker({
        position: position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        // icon: '//webapi.amap.com/theme/v1.3/markers/n/mid.png',
        draggable: true,
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
          hideMarkers: true
        })
        vm.mapFromAutocomplete = new AMap.Autocomplete({
          input: 'fromPositionInput'
        })
        vm.mapToAutocomplete = new AMap.Autocomplete({
          input: 'toPositionInput'
        })
        vm.mapFromAutocomplete.on('select', function (event) {
          if (!event.poi.location) return
          vm.makeFromPosition(event.poi.location.lng, event.poi.location.lat, event.poi.name)
          vm.trySearchDriving()
        })
        vm.mapToAutocomplete.on('select', function (event) {
          if (!event.poi.location) return
          vm.makeEndPosition(event.poi.location.lng, event.poi.location.lat, event.poi.name)
          vm.trySearchDriving()
        })
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

<style scoped lang="scss">
.left-side {
  position: fixed;
  left: 0;
  top: 0;
  width: 320px;
  height: 100%;
  padding: 20px 10px;
  background: white;
  overflow-y: auto;
  //opacity: .7;
}
.right-side {
  position: fixed;
  right: 0;
  top: 0;
  width: 320px;
  height: 100%;
  padding: 20px 10px;
  background: white;
}
.map-container {
  margin: 0;
  height: 100%;
}
#routeplanning-map-container {
  width: 100%;
  height: 100%;
}
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
</style>
