<template>
  <!-- 轨迹回放列表 -->
  <div class="map-warning-table ly-flex-pack-justify">
    <div class="time-box">
      <!-- 查询时间 -->
      <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
        快捷选项：
        <el-radio-group v-model="radio" style="width: 228px" @change="changeRadio">
          <el-radio :label="1">1天</el-radio>
          <el-radio :label="3">3天</el-radio>
          <el-radio :label="7">7天</el-radio>
        </el-radio-group>
      </div>
      <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
        开始时间：
        <el-date-picker
          v-model="jimiQueryParams.beginTime"
          clearable
          size="small"
          type="datetime"
          style="width: 228px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择开始时间"
        />
      </div>
      <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
        结束时间：
        <el-date-picker
          v-model="jimiQueryParams.endTime"
          clearable
          size="small"
          type="datetime"
          style="width: 228px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择结束时间"
        />
      </div>
      <div class="form-item" style="text-align: right;">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="getJimi">查 询</el-button>
      </div>

      <!-- 播放器 -->
      <template v-if="jmTracklist && jmTracklist.length > 0">
        <!-- 当前时间、速度、方向 -->
        <div v-if="jmTracklist && jmTracklist.length > 0" class="device-current-view ly-flex-pack-justify">
          <span>{{ currentTrackTime || '-' }}</span>
          <span v-if="currentTrackSpeed !== -1">{{ currentTrackSpeed || '-' }} km/h</span>
        </div>
        <!-- 进度条 -->
        <div class="device-slide-box">
          <el-slider v-model="slideValue" :show-tooltip="false" @input="handleSlideChange" />
        </div>
        <!-- 播放器 -->
        <div class="device-play-box ly-flex ly-flex-pack-justify ly-flex-align-center">
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
          <div v-if="isPlay === 0" title="播放" class="play-button" @click="$emit('startPathSimplifier')" />
          <div v-if="isPlay === 2" title="继续" class="play-button" @click="$emit('resumePathSimplifier')" />
          <div v-if="isPlay === 1" title="暂停" class="pause-button" @click="$emit('pausePathSimplifier')" />
          <div class="replay-button" @click="$emit('startPathSimplifier')">
            <i class="el-icon-refresh-right" />
            重播
          </div>
        </div>
      </template>
    </div>
  
    <div class="tab-box">
      <!-- tab -->
      <ul class="tab-left">
        <li v-for="item in tabList" :key="item.code" :class="{active: currentTab === item.code}" @click="handleTab(item.code)">{{ item.label }}</li>
      </ul>
      <!-- 轨迹明细 -->
      <el-table v-show="currentTab === 1" v-loading="trackLoading" height="100%" highlight-current-row border :data="trackList">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="状态" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="速度(km/h)" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="定位时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="定位方式" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="定位位置" align="center" prop="name" :show-overflow-tooltip="true" />
      </el-table>
      <!-- 轨迹明细 -->
      <el-table v-show="currentTab === 2" v-loading="parkingLoading" height="100%" highlight-current-row border :data="parkingList">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="车辆" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="开始时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停留时长" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="停留位置" align="center" prop="name" :show-overflow-tooltip="true" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api';
import { jmTrackInfolist, jmTracklist } from './trackList.js';
export default {
  name: 'TrackList',
  data() {
    return {
      // 快捷事件选项
      radio: 1,
      // jimi查询参数
      jimiQueryParams: {
        beginTime: '', // 2021-07-31 00:00:00
        endTime: '', // 2021-08-02 17:00:00
        imeis: '', // 868120274644936
        mapType: 'GOOGLE' // GOOGOLE或BAIDU
      },
      buttonLoading: false,
      jmTrackInfolist: [],
      jmTracklist: [],
      // 当前轨迹点时间速度
      currentTrackTime: null,
      currentTrackSpeed: null,
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

  },
  methods: {
    /** 快捷选择事件 */
    changeRadio(value) {
      console.log(value)
    },
    /** 获取硬件轨迹 */
    getJimi() {
      this.jmTrackInfolist = jmTrackInfolist;
      this.jmTracklist = jmTracklist;
      this.$emit('clearPathSimplifierIns'); // 绘制前先清除
      this.setCurrentTrackTimeAndSpeed(0);
      this.$emit('initPathSimplifier');
      // const _this = this;
      // this.buttonLoading = true;
      // this.jimiQueryParams.imeis = this.factoryOnlyCode;
      // jimiTrackLocation(this.jimiQueryParams).then(response => {
      //   if (response.data) {
      //     this.buttonLoading = false;
      //     this.jmTracklist = [];
      //     this.jmTrackInfolist = response.data;
      //     for (var i = 0; i < response.data.length; i++) {
      //       var dataItem = response.data[i];
      //       var item = [];
      //       item.push(dataItem.lng);
      //       item.push(dataItem.lat);
      //       _this.jmTracklist[i] = item;
      //     }
      //     this.$emit('clearPathSimplifierIns'); // 绘制前先清除
      //     if (this.jmTracklist.length > 0) {
      //       // 设置当前轨迹点时间、速度
      //       this.setCurrentTrackTimeAndSpeed(0);
      //       // 创建巡航
      //       this.$emit('initPathSimplifier');
      //     } else {
      //       this.msgInfo('暂无轨迹信息');
      //     }
      //   }
      // }).catch(() => {
      //   this.buttonLoading = false;
      // });
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
    /** 设置进度条值 */
    setSlideValue(value) {
      this.slideValue = value;
    },
    /** 设置播放器状态 */
    setPlayStatus(value) {
      this.isPlay = value;
    },
    /** 切换tab */
    handleTab(code) {
      if (this.currentTab === code) return;
      this.currentTab = code;
    },
  }
}
</script>

<style lang="scss" scoped>
.map-warning-table{
  height: 400px;
  background: #fff;
  .time-box{
    width: 334px;
    padding: 10px;
    .form-item{
      margin-bottom: 15px;
    }
    // 进度条样式
    .device-slide-box{
      padding: 0 16px;
      ::v-deep.el-slider{
        ::v-deep.el-slider__button{
          width: 16px;
          height: 8px;
          border: none;
          box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.19);
        }
      }
    }
    // 播放器样式
    .device-play-box{
      padding: 0 15px 8px;
      .time-select ::v-deep.el-input__inner{
        border-radius: 16px;
        color: #ADB5BD;
      }
      .play-button{
        width: 34px;
        height: 34px;
        background: url('~@/assets/images/device/icon_play.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .pause-button{
        width: 34px;
        height: 34px;
        background: url('~@/assets/images/device/icon_pause.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .replay-button{
        width: 68px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #DCDFE6;
        opacity: 1;
        border-radius: 16px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ADB5BD;
        text-align: center;
        cursor: pointer;
        >i{
          font-size: 14px;
        }
      }
    }
    // 当前时间、速度、方向
    .device-current-view{
      padding: 15px 18px 0px 15px;
      margin-bottom: -10px;
      color: #ADB5BD;
      font-size: 13px;
    }
  }

  .tab-box{
    width: calc(100% - 334px);
    height: 100%;
    position: relative;
    padding-left: 40px;
    // tab
    .tab-left{
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 40px;
      cursor: pointer;
      >li{
        height: 50%;
        background: #fff;
        border: 1px solid #fff;
        padding: 12px;
        &.active{
          background: #ccc;
        }
      }
    }
  }
}
</style>