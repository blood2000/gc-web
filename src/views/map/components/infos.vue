<template>
  <div class="map-info-panel">
    <!-- 车辆信息 -->
    <div class="info-box info-car">
      <h5 class="info-box-title">车辆信息</h5>
      <div class="info-box-status"><strong class="mr8">·</strong>行驶中</div>
      <!-- content -->
      <div class="car-content ly-flex ly-flex-align-center">
        <img class="img-box" src="~@/assets/images/device/car_type.png">
        <div class="info-box ly-flex-1">
          <h5>{{ vehicleInfo.plateNumber }}</h5>
          <p class="car-name">
            <template v-if="vehicleInfo.driverName">
              {{ vehicleInfo.driverName }}
              <span style="margin: 0 10px">|</span>
            </template>
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
      <p class="address g-single-row">福建省福州市台江区东滨路1号富邦总部大楼</p>
      <p class="time">2021-06-01 13:13:13</p>
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
          <h5>超好运小黑盒 | 便携款</h5>
          <p class="warn-text">
            今日告警
            <span class="count">5</span>
          </p>
        </div>
      </div>
      <ul class="device-list ly-flex">
        <li>
          <img src="~@/assets/images/device/device_info_1.png">
          <p>车辆状态</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_2.png">
          <p>实时告警</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_3.png">
          <p>轨迹</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_4.png">
          <p>四重定位</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_5.png">
          <p>里程统计</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_6.png">
          <p>电子围栏</p>
        </li>
        <li>
          <img src="~@/assets/images/device/device_info_7.png">
          <p>路线规划</p>
        </li>
      </ul>
      <ul class="info-list ly-flex map-scroll-panel" :style="warnIsClose ? '' : 'height: calc(100% - 170px)'">
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_1.png">
          <div>
            <p class="label">时速</p>
            <p class="count"><span>80</span> km/h</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_2.png">
          <div>
            <p class="label">设备状态</p>
            <p class="text green">设备在线</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_3.png">
          <div>
            <p class="label">总里程</p>
            <p class="count"><span>2000</span> km</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_4.png">
          <div>
            <p class="label">日里程</p>
            <p class="count"><span>300</span> km</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_5.png">
          <div>
            <p class="label">设备电量</p>
            <p class="text red">低电量</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_6.png">
          <div>
            <p class="label">Acc状态</p>
            <p class="text">点火</p>
          </div>
        </li>
        <li class="ly-flex ly-flex-align-center">
          <img src="~@/assets/images/device/device_type_7.png">
          <div>
            <p class="label">电瓶电压</p>
            <p class="count"><span>5000</span> V</p>
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
      vehicleInfo: {}
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
      const obj = {
        moduleName: 'http_map',
        method: 'get',
        url_alias: 'getVehicleInfo',
        url_code: [this.vehicleCode]
      }
      http_request(obj).then(res => {
        this.vehicleInfo = res.data;
      });
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
      color: #43B91E;
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
          margin-bottom: 15px;
          &:last-child{
            margin-bottom: 6px;
          }
          >img{
            width: 44px;
            height: 44px;
            margin-right: 10px;
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