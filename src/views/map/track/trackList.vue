<template>
  <!-- 轨迹回放列表 -->
  <div class="map-track-list">
    <div class="time-box">
      <!-- 查询时间 -->
      <div class="label">选择时间：</div>
      <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
        <el-date-picker
          v-model="rangeTime"
          type="datetimerange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
          @change="dateChoose"
        />
      </div>
      <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
        <!-- 快捷选项 -->
        <ul class="quick-time-group ly-flex ly-flex-pack-start">
          <li v-for="item in timeGroup" :key="item.code+''" :class="{active: activeTime === item.code}" @click="chooseTimeGroup(item.code)">{{ item.label }}</li>
        </ul>
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="getJimi">查 询</el-button>
      </div>
      <!-- 播放器 -->
      <template>
        <!-- 当前时间、速度、方向 -->
        <div class="device-current-view ly-flex-pack-justify">
          <span>{{ currentTrackTime || '00:00:00 00:00:00' }}</span>
          <span v-if="currentTrackSpeed !== -1">{{ currentTrackSpeed || '-' }} km/h</span>
        </div>
        <!-- 进度条 -->
        <div class="device-slide-box">
          <el-slider v-model="slideValue" :show-tooltip="false" :disabled="!this.jmTracklist || this.jmTracklist.length === 0" @input="handleSlideChange" />
        </div>
        <!-- 播放器 -->
        <div class="device-play-box ly-flex ly-flex-pack-justify ly-flex-align-center">
          <div class="replay-button" @click="startPathSimplifier">
            <i class="el-icon-refresh-right" />
            重播
          </div>
          <div v-if="isPlay === 0" title="播放" class="play-button" @click="startPathSimplifier" />
          <div v-if="isPlay === 2" title="继续" class="play-button" @click="resumePathSimplifier" />
          <div v-if="isPlay === 1" title="暂停" class="pause-button" @click="pausePathSimplifier" />
          <el-select
            v-model="rateTime"
            class="time-select"
            style="width: 68px"
            size="mini"
            @change="changeTime"
          >
            <el-option
              v-for="dict in timeOptions"
              :key="dict"
              :label="dict + 'X'"
              :value="dict"
            />
          </el-select>
        </div>
      </template>
    </div>
  
    <div class="tab-box">
      <!-- tab -->
      <ul class="tab-left">
        <li v-for="item in tabList" :key="item.code" :class="{active: currentTab === item.code}" @click="handleTab(item.code)">{{ item.label }}</li>
      </ul>
      <div class="tab-box-content">
        <!-- 轨迹明细 -->
        <div class="track-list map-scroll-panel" v-show="currentTab === 1" v-loading="trackLoading">
          <div class="card" v-for="(item, index) in trackList" :key="index">
            <p class="date">8月15日</p>
            <div class="ly-flex ly-flex-pack-justify">
              <div class="time">13:00:00</div>
              <div class="box">
                <div class="info-box" v-for="(value, vIndex) in item.list" :key="vIndex">
                  <h5>
                    <img src="@/assets/images/device/icon_track_xs.png">
                    行驶
                    <!-- <img src="@/assets/images/device/icon_track_ds.png">
                    怠速 -->
                  </h5>
                  <div class="content">
                    <p class="address g-double-row">河南省平顶山市湛河区荆山街道润建代维公司驻点(黄河路29号北239米)</p>
                    <div class="ly-flex ly-flex-pack-justify">
                      <p class="p speed">55km/h</p>
                      <p class="p gps">GPS定位</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 停车详情 -->
        <div class="parking-list map-scroll-panel" v-show="currentTab === 2" v-loading="parkingLoading">
          <div class="card" v-for="(item, index) in parkingList" :key="index">
            <h5>闽A12345</h5>
            <div class="status">
              <img src="@/assets/images/device/icon_park.png">
              静止
            </div>
            <p class="address g-double-row">河南省平顶山市湛河区荆山街道润建代维公司驻点(黄河路29号北239米)</p>
            <p class="time"><span>开始时间</span>2021-09-17 10:00:00</p>
            <p class="time"><span>结束时间</span>2021-09-17 10:00:00</p>
            <p class="time"><span>停留时长</span>3小时35分0秒</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api';
export default {
  name: 'TrackList',
  props: {
    orgOrVehicleCode: {
      type: String,
      default: null
    },
    isShowVehicleInfo: Boolean
  },
  data() {
    return {
      // 快捷选项时间
      activeTime: 0,
      timeGroup: [
        { code: 0, label: '今日' },
        { code: 1, label: '昨日' },
        { code: 2, label: '前日' }
      ],
      // jimi查询参数
      rangeTime: [],
      jimiQueryParams: {
        startTime: '',
        endTime: '',
        vehicleCode: ''
      },
      buttonLoading: false,
      jmTrackInfolist: [],
      jmTracklist: [],
      // 当前轨迹点时间速度
      currentTrackTime: null,
      currentTrackSpeed: null,
      // 当前轨迹总里程
      currentTrackAllMileage: null,
      // 当前轨迹总时间
      currentTrackAllTime: null,
      // 播放进度条
      slideValue: 0,
      rateTime: 1,
      timeOptions: [1, 2, 3],
      isPlay: 0, // 0播放 1暂停 2继续
      // tab
      currentTab: 1,
      tabList: [
        {code: 1, label: '轨迹明细'},
        {code: 2, label: '停车详情'}
      ],
      // 轨迹明细列表
      trackLoading: false,
      trackList: [],
      // 停车详情列表
      parkingLoading: false,
      parkingList: []
    }
  },
  mounted() {
    // 时间默认选中当天
    const startTime = this.parseTime(new Date(), '{y}-{m}-{d} 00:00:00');
    const endTime = this.parseTime(new Date());
    this.setTimeValue(startTime, endTime);
    // 假数据
    this.trackList = [{list: [{},{},{},{}]}, {list: [{},{}]}, {list: [{}]}];
    this.parkingList = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
  },
  methods: {
    /** 快捷时间选中 */
    chooseTimeGroup(code) {
      this.activeTime = code;
      let startTime, endTime;
      switch (code) {
        case 0:
          // 今日
          startTime = this.parseTime(new Date(), '{y}-{m}-{d} 00:00:00');
          endTime = this.parseTime(new Date());
          break;
        case 1:
          // 昨日
          startTime = this.parseTime(new Date().getTime() - 3600 * 1000 * 24 * 1, '{y}-{m}-{d} 00:00:00');
          endTime = this.parseTime(new Date().getTime() - 3600 * 1000 * 24 * 1, '{y}-{m}-{d} 23:59:59');
          break;
        case 2:
          // 前日
          startTime = this.parseTime(new Date().getTime() - 3600 * 1000 * 24 * 2, '{y}-{m}-{d} 00:00:00');
          endTime = this.parseTime(new Date().getTime() - 3600 * 1000 * 24 * 2, '{y}-{m}-{d} 23:59:59');
          break;
        default:
          break;
      };
      this.setTimeValue(startTime, endTime);
    },
    /** 时间赋值 */
    setTimeValue(startTime, endTime) {
      this.rangeTime = [startTime, endTime];
      this.jimiQueryParams.startTime = startTime;
      this.jimiQueryParams.endTime = endTime;
    },
    /** 选择日期 */
    dateChoose(date) {
      if (date) {
        this.jimiQueryParams.startTime = this.parseTime(date[0]);
        this.jimiQueryParams.endTime = this.parseTime(date[1]);
        // this.getJimi();
      } else {
        this.jimiQueryParams.startTime = null;
        this.jimiQueryParams.endTime = null;
      }
    },
    /** 获取硬件轨迹 */
    getJimi() {
      // this.jmTrackInfolist = jmTrackInfolist;
      // this.jmTracklist = jmTracklist;
      // this.$emit('clearPathSimplifierIns'); // 绘制前先清除
      // this.setCurrentTrackTimeAndSpeed(0);
      // this.$emit('initPathSimplifier');
      // return;
      
      const _this = this;
      // 参数不能为空
      if (!this.isShowVehicleInfo || !this.orgOrVehicleCode || this.orgOrVehicleCode === '') {
        this.msgWarning('请选择车辆');
        return;
      }
      if (!this.jimiQueryParams.startTime || this.jimiQueryParams.startTime === '') {
        this.msgWarning('开始时间不能为空');
        return;
      }
      if (!this.jimiQueryParams.endTime || this.jimiQueryParams.endTime === '') {
        this.msgWarning('结束时间不能为空');
        return;
      }
      this.buttonLoading = true;
      this.jimiQueryParams.vehicleCode = this.orgOrVehicleCode;
      const obj = {
        moduleName: 'http_map',
        method: 'post',
        url_alias: 'getVehicleTrack',
        data: this.jimiQueryParams
      }
      http_request(obj).then(response => {
        this.buttonLoading = false;
        if (response.data) {
          this.buttonLoading = false;
          this.jmTracklist = [];
          this.jmTrackInfolist = response.data.map(el => {
            // el "119.27744340468621|25.43044766673091|7|94|0.0|2021-09-13 08:14:16"
            // el {经度}|{纬度}|{时速}|{方向}|{里程}|{时间}
            const arr = el.split('|');
            return {
              lng: arr[0],
              lat: arr[1],
              gpsSpeed: arr[2],
              direction: arr[3],
              mileage: arr[4],
              gpsTime: arr[5]
            }
          })
          for (var i = 0; i < this.jmTrackInfolist.length; i++) {
            var dataItem = _this.jmTrackInfolist[i];
            var item = [];
            item.push(dataItem.lng);
            item.push(dataItem.lat);
            _this.jmTracklist[i] = item;
          }
          this.$emit('clearPathSimplifierIns'); // 绘制前先清除
          if (this.jmTracklist.length > 0) {
            // 设置当前轨迹点时间、速度
            this.setCurrentTrackTimeAndSpeed(0);
            // 创建巡航
            this.$emit('initPathSimplifier');
          } else {
            this.msgInfo('暂无轨迹信息');
          }
          // 设置当前轨迹总时间、总里程
          if (this.jmTracklist.length >= 2) {
            const startTime = this.jmTrackInfolist[0].gpsTime;
            const endTime = this.jmTrackInfolist[this.jmTrackInfolist.length - 1].gpsTime;
            const startMileage = Number(this.jmTrackInfolist[0].mileage || 0);
            const endMileage = Number(this.jmTrackInfolist[this.jmTrackInfolist.length - 1].mileage || 0);
            this.setCurrentTrackAllTimeAndMileage(this.getRemainderTime(startTime, endTime), endMileage - startMileage);
          } else {
            this.setCurrentTrackAllTimeAndMileage(0, 0);
          }
        }
      }).catch(() => {
        this.buttonLoading = false;
      });;
    },
    /** 进度条滑块触发 */
    handleSlideChange(value) {
      this.$emit('handleSlideChange', value);
    },
    /** 切换倍速 */
    changeTime(val) {
      this.rateTime = val;
    },
    /** 设置当前轨迹点时间、速度 */
    setCurrentTrackTimeAndSpeed(index) {
      this.currentTrackTime = this.jmTrackInfolist[index].gpsTime;
      this.currentTrackSpeed = this.jmTrackInfolist[index].gpsSpeed;
    },
    /** 设置当前轨迹总时间、总里程 */
    setCurrentTrackAllTimeAndMileage(time, mileage) {
      this.currentTrackAllTime = time;
      this.currentTrackAllMileage = mileage;
    },
    /** 设置进度条值 */
    setSlideValue(value) {
      this.slideValue = value;
    },
    /** 设置播放器状态 */
    setPlayStatus(value) {
      this.isPlay = value;
    },
    /** 播放 */
    startPathSimplifier() {
      if (!this.jmTracklist || this.jmTracklist.length === 0) return;
      this.$emit('startPathSimplifier');
    },
    /** 继续 */
    resumePathSimplifier() {
      if (!this.jmTracklist || this.jmTracklist.length === 0) return;
      this.$emit('resumePathSimplifier');
    },
    /** 暂停 */
    pausePathSimplifier() {
      if (!this.jmTracklist || this.jmTracklist.length === 0) return;
      this.$emit('pausePathSimplifier');
    },
    /** 切换tab */
    handleTab(code) {
      if (this.currentTab === code) return;
      this.currentTab = code;
    },
    /** 获取相隔时间 */
    getRemainderTime (s1, s2){
      s1 = new Date(s1).getTime();
      s2 = new Date(s2).getTime();
      let runTime = parseInt((s2 - s1) / 1000);
      const year = Math.floor(runTime / 86400 / 365);
      runTime = runTime % (86400 * 365);
      const month = Math.floor(runTime / 86400 / 30);
      runTime = runTime % (86400 * 30);
      const day = Math.floor(runTime / 86400);
      runTime = runTime % 86400;
      const hour = Math.floor(runTime / 3600);
      runTime = runTime % 3600;
      const minute = Math.floor(runTime / 60);
      runTime = runTime % 60;
      const second = runTime;
      let result = '';
      if (year) result += (year + '年');
      if (month) result += (month + '月');
      if (day) result += (day + '天');
      if (hour) result += (hour + '小时');
      if (minute) result += (minute + '分钟');
      if (second) result += (second + '秒');
    　return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.map-track-list{
  width: 380px;
  height: 100%;
  .time-box{
    width: 100%;
    width: 380px;
    height: 236px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 20px 16px 10px;
    margin-bottom: 10px;
    .label{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      color: #8592AD;
      margin-bottom: 5px;
    }
    .form-item{
      margin-bottom: 12px;
    }
    // 快捷选项
    .quick-time-group{
      >li{
        cursor: pointer;
        // width: 88px;
        width: 70px;
        height: 28px;
        border: 1px solid #E4ECF4;
        border-radius: 4px;
        margin-right: 12px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 26px;
        color: #3D4050;
        text-align: center;
        &.active{
          background: #4682FA;
          border: 1px solid #4682FA;
          color: #fff;
        }
      }
    }
    // 进度条样式
    .device-slide-box{
      padding: 0 2px;
      ::v-deep.el-slider__bar{
        background: #4682FA;
      }
    }
    // 播放器样式
    .device-play-box{
      padding: 0 2px 8px;
      .time-select ::v-deep.el-input__inner{
        border-radius: 16px;
        color: #3d4050;
        border-color: #C9CFDB;
      }
      .play-button{
        width: 36px;
        height: 36px;
        background: url('~@/assets/images/device/icon_play.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .pause-button{
        width: 36px;
        height: 36px;
        background: url('~@/assets/images/device/icon_pause.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .replay-button{
        width: 68px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #C9CFDB;
        opacity: 1;
        border-radius: 16px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #3d4050;
        text-align: center;
        cursor: pointer;
        >i{
          font-size: 14px;
        }
      }
    }
    // 当前时间、速度、方向
    .device-current-view{
      padding-top: 2px;
      margin-bottom: -10px;
      color: #ADB5BD;
      font-size: 13px;
    }
  }

  .tab-box{
    width: 100%;
    height: calc(100% - 246px);
    position: relative;
    // tab
    .tab-left{
      position: absolute;
      left: -40px;
      top: 0;
      bottom: 0;
      width: 40px;
      cursor: pointer;
      z-index: 0;
      >li{
        float: right;
        width: 36px;
        height: 108px;
        background: #fff;
        padding: 13px 10px;
        margin-bottom: 12px;
        border-radius: 6px 0 0 6px;
        background: #E3E7F0;
        box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.16);
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 20px;
        color: #8592AD;
        transition: width 0.3s;
        &.active{
          width: 40px;
          height: 130px;
          padding: 24px 12px;
          background: rgba(255, 255, 255, 0.85);
          color: #3D4050;
        }
      }
    }
    // tab content
    .tab-box-content{
      height: 100%;
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
      border-radius: 0 6px 6px 6px;
      padding: 4px 0;
      // 轨迹明细
      .track-list{
        height: 100%;
        padding: 0 0 0 20px;
        overflow-y: scroll;
        >.card{
          &:first-child{
            padding-top: 14px;
          }
          &:not(:first-child){
            margin-top: -22px;
          }
          .date{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3D4050;
            margin-bottom: 2px;
          }
          .time{
            width: 72px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
          }
          .box{
            width: calc(100% - 72px);
          }
          .info-box{
            width: 100%;
            padding-right: 16px;
            >h5{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: bold;
              line-height: 18px;
              color: #3D4050;
              margin-bottom: 4px;
              >img{
                width: 18px;
                height: 18px;
                vertical-align: bottom;
                margin-right: 6px;
              }
            }
            >.content{
              padding: 4px 0 10px 18px;
              border-left: 1px dashed #C9CFDB;
              margin-left: 8px;
              margin-bottom: 6px;
              .address{
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 20px;
                color: #3D4050;
                margin-bottom: 8px;
              }
              .p{
                width: 50%;
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 20px;
                color: #A1A1A1;
                padding-left: 22px;
              }
              .speed{
                background: url('~@/assets/images/device/icon_track_speed.png') no-repeat 0px 0px;
                background-size: 18px 18px;
              }
              .gps{
                background: url('~@/assets/images/device/icon_track_gps.png') no-repeat 0px 0px;
                background-size: 18px 18px;
              }
            }
          }
        }
      }
      // 停车详情
      .parking-list{
        height: 100%;
        padding: 0 0 0 24px;
        overflow-y: scroll;
        >.card{
          position: relative;
          margin-right: 20px;
          padding: 20px 0;
          &:not(:last-child){
            border-bottom: 1px solid #E4ECF4;
          }
          >h5{
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
          }
          >.status{
            position: absolute;
            top: 18px;
            right: 0;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 18px;
            color: #3D4050;
            >img{
              vertical-align: bottom;
              margin-right: 4px;
            }
          }
          >.address{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3D4050;
            margin: 12px 0;
          }
          >.time{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
            margin-top: 4px;
            >span{
              color: #A1A1A1;
              margin-right: 16px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.map-track-list{
  .time-box{
    .el-range-editor.el-input__inner{
      padding: 3px 0 3px 10px;
    }
    .el-date-editor .el-range-input{
      width: 40%;
    }
    .el-range-separator{
      padding: 0;
    }

    // 进度条样式
    .device-slide-box{
      .el-slider__runway{
        background: #ECEFF6;
      }
      .el-slider__button{
        width: 26px;
        height: 18px;
        border: none;
        background: url('~@/assets/images/device/slide_icon.png') no-repeat;
        background-size: 26px 18px;
      }
    }
  }
}
</style>