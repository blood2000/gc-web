<template>
  <div class="map-info-panel">
    <!-- 车辆信息 -->
    <div class="info-box info-car">
      <h5 class="info-box-title">车辆信息</h5>
      <div class="info-box-status" :class="selectDictColor(vehicleStatusOptions, vehicleInfo.vehicleStatus)">
        <strong class="mr8">·</strong>
        {{ selectDictLabel(vehicleStatusOptions, vehicleInfo.vehicleStatus) }}
      </div>
      <!-- content -->
      <div class="car-content ly-flex ly-flex-align-center">
        <img class="img-box" :src="require('@/assets/images/device/car_type_'+ (vehicleInfo.carrierType || 'qt') +'.png')">
        <div class="info-box ly-flex-1">
          <h5>{{ vehicleInfo.plateNumber }}</h5>
          <p class="car-name">
            <template v-if="vehicleInfo.driverName">
              {{ vehicleInfo.driverName }}
              <span style="margin: 0 10px">|</span>
            </template>
            <!-- 无数据 -->
            <template v-if="vehicleInfo.carrierTypeName">
              {{ vehicleInfo.carrierTypeName }}
            </template>
            <template v-if="vehicleInfo.orgName">
              <span style="margin: 0 10px">|</span>
              {{ vehicleInfo.orgName }}
            </template>
          </p>
          <p class="car-type">
            <span class="label">车辆类型</span>
            重型自卸货车
          </p>
        </div>
      </div>
      <p class="address g-single-row">{{ locationInfo.address ? locationInfo.address : '' }}</p>
      <p class="time">{{ locationInfo.time ? locationInfo.time : '' }}</p>
    </div>

    <!-- 调度信息 -->
    <div class="info-box info-dispatch">
      <h5 class="info-box-title">调度信息</h5>
      <div class="info-box-status"><strong class="mr8">·</strong>任务中</div>
      <!-- content -->
      <div class="address-node">
        <p class="g-single-row">
          <span class="start">起</span>
          福建省福州市台江区东滨路1号富邦总部大楼
        </p>
      </div>
      <div class="address-node">
        <p class="g-single-row">
          <span class="end">终</span>
          福建省福州市台江区东滨路1号富邦总部大楼
        </p>
      </div>
    </div>

    <!-- 设备信息 -->
    <div class="info-box info-device" :style="warnIsClose ? '' : 'height: calc(100% - 304px)'">
      <h5 class="info-box-title">设备信息</h5>
      <!-- content -->
      <div class="device-content ly-flex ly-flex-align-center">
        <div class="img-box ly-flex-pack-center ly-flex-align-center">
          <img src="~@/assets/images/device/device.png">
        </div>
        <div class="info-box ly-flex-1">
          <h5>{{ `${deviceInfo.modelName ? deviceInfo.modelName : ''} | ${deviceInfo.seriesName ? deviceInfo.seriesName : ''}` }}</h5>
          <p class="warn-text">
            今日告警
            <span class="count">5</span>
          </p>
        </div>
      </div>
      <ul class="device-list ly-flex">
        <li v-for="item in functionsInfo" :key="item.functionCode">
          <img :src="item.functionIcon">
          <p :title="item.functionName">{{ item.functionName }}</p>
        </li>
      </ul>
      <ul class="info-list ly-flex map-scroll-panel" :style="warnIsClose ? '' : 'height: calc(100% - 170px)'">
        <li class="ly-flex ly-flex-align-center" v-for="item in attributesInfo" :key="item.attributeCode">
          <div class="img-box ly-flex-align-center ly-flex-pack-center">
            <img :src="item.attributeIcon">
          </div>
          <div>
            <p class="label">{{ item.attributeLabel }}</p>
            <p class="count" :style="`color:${item.attributeColor ? item.attributeColor : '#3D4050'}`"><span>{{ item.attributeText }}</span> {{ item.attributeUnit ? item.attributeUnit : '' }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api';
import bus from './bus';
export default {
  props: {
    vehicleCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      warnIsClose: false,
      // 车辆信息
      vehicleInfo: {},
      locationInfo: {},
      deviceInfo: {},
      functionsInfo: [],
      attributesInfo: [],
      // 车辆状态字典
      vehicleStatusOptions: [
        { dictLabel: '空闲中', dictValue: 0, color: 'blue' },
        { dictLabel: '任务中', dictValue: 1, color: 'green' },
        { dictLabel: '维修中', dictValue: 2, color: 'red' },
        { dictLabel: '保养中', dictValue: 3, color: 'yellow' }
      ]
    }
  },
  watch: {
    vehicleCode: {
      handler(val) {
        if (val) {
          this.getVehicleInfo();
        }
      },
      immediate: true
    }
  },
  mounted() {
    // bus
    bus.$on('isClose', (data)=>{
      this.warnIsClose = data;
		});
  },
  methods: {
    // 获取车辆信息
    getVehicleInfo() {
      const type = 'vehicle,location,device,function,attribute'; // 获取信息类型, 可指定多个
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'getVehicleInfo',
        url_code: [this.vehicleCode, type]
      }
      http_request(obj).then(res => {
        const { vehicle, location, device, functions, attributes } = res.data; 
        this.vehicleInfo = vehicle || {};
        this.locationInfo = location || {};
        this.deviceInfo = device || {};
        this.functionsInfo = functions || [];
        this.attributesInfo = attributes || [];
        // 根据经纬度获取点位
        if (this.locationInfo && this.locationInfo.lng && this.locationInfo.lat) {
          this.$parent.getAddressBylnglat([this.locationInfo.lng, this.locationInfo.lat]).then(result => {
            this.$set(this.locationInfo, 'address', result);
          });
        }
      });
    },
    // 字典匹配颜色
    selectDictColor(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].dictValue == ('' + value)) {
          actions.push(datas[key].color);
          return true;
        }
      })
      return actions.join('');
    }
  }
}
</script>

<style lang="scss" scoped>
.map-info-panel{
  >.info-box{
    position: relative;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 12px;
    // 标题样式
    .info-box-title{
      width: 284px;
      height: 28px;
      line-height: 28px;
      background: linear-gradient(90deg, rgba(70, 130, 250, 0.16) 0%, rgba(70, 130, 250, 0) 100%);
      border-radius: 3px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #3D4050;
      padding-left: 8px;
    }

    // 状态样式
    .info-box-status{
      position: absolute;
      top: 15px;
      right: 18px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      &.green{
        color: #43B91E;
      }
      &.blue{
        color: #4682FA;  
      }
      &.red{
        color: #EF6969;  
      }
      &.yellow{
        color: #FFBC00;  
      }
    }

    // 车辆信息
    &.info-car{
      height: 172px;
      .car-content{
        margin: 8px 0 10px 0;
        >.img-box{
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }
        >.info-box{
          >h5{
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
            margin: -2px 0 2px 0;
          }
          .car-name{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3D4050;
          }
          .car-type{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3D4050;
            .label{
              font-weight: 400;
              color: #A6A8AD;
              margin-right: 8px;
            }
          }
        }
      }
      .address{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #3D4050;
      }
      .time{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #A6A8AD;
      }
    }

    // 调度信息
    &.info-dispatch{
      height: 116px;
      .address-node{
        position: relative;
        &:not(:last-child)::after{
          content: '';
          position: absolute;
          bottom: -1px;
          left: 10px;
          width: 1px;
          height: 8px;
          background: #C7CBD2;
        }
        >p{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #3D4050;
          >.start, >.end{
            display: inline-block;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            margin: 0 8px 10px 2px;
          }
          >.start{
            margin-top: 13px;
            background: #FFBC00;
          }
          >.end{
            background: #4682FA;
          }
        }
      }
    }

    // 设备信息
    &.info-device{
      padding-right: 0;
      min-height: 300px;
      max-height: 440px;
      .device-content{
        padding: 8px 12px 0 0;
        >.img-box{
          width: 68px;
          height: 80px;
          margin-right: 16px;
          >img{
            max-width: 100%;
            max-height: 100%;
          }
        }
        >.info-box{
          padding-bottom: 15px;
          @mixin font{
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3D4050;
          }
          >h5{
            @include font;
            margin-bottom: 6px;
          }
          >.warn-text{
            @include font;
            width: 262px;
            height: 32px;
            line-height: 32px;
            background: linear-gradient(90deg, rgba(239, 105, 105, 0.16) 0%, rgba(239, 105, 105, 0) 100%);
            border-radius: 3px;
            padding-left: 12px;
            .count{
              color: #EF6969;
            }
          }
        }
      }
      .device-list{
        padding-right: 10px;
        height: 46px;
        overflow: hidden;
        >li{
          text-align: center;
          width: 14.2%;
          >img{
            width: 26px;
            height: 26px;
          }
          >p{
            font-size: 10px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3D4050;
            transform: scale(0.9);
            margin-top: -3px;
          }
        }
      }
      .info-list{
        margin-top: 12px;
        overflow-y: scroll;
        flex-wrap: wrap;
        >li{
          width: 50%;
          height: 44px;
          margin-bottom: 15px;
          &:last-child{
            margin-bottom: 6px;
          }
          >.img-box{
            width: 44px;
            height: 44px;
            margin-right: 10px;
            background: #ebeff3;
            border-radius: 6px;
            >img{
              width: 28px;
              height: 28px;
            }
          }
          .label{
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 22px;
            color: #ADB5BD;
            margin-top: -4px;
          }
          .count{
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3D4050;
            >span{
              font-size: 24px;
              font-family: Bahnschrift;
              font-weight: 600;
              vertical-align: bottom;
            }
          }
          .text{
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            &.green{
              color: #43B91E;
            }
            &.red{
              color: #EF6969;
            }
          }
        }
      }
    }
  }
}
</style>