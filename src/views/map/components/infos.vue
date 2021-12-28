<template>
  <div class="map-info-panel">
    <!-- 车辆信息 -->
    <div class="info-box info-car">
      <h5 class="info-box-title">车辆信息</h5>
      <div
        class="info-box-status"
        :style="{
          color:selectDictColor(vehicleInfo.vehicleStatus)
        }"
      >
        <strong class="mr8">·</strong>
        {{ vehicleInfo.vehicleStatusName }}
      </div>
      <!-- content -->
      <div class="car-content ly-flex ly-flex-align-center">
        <img
          class="img-box"
          :src="
            require('@/assets/images/device/car_type_' +
              (vehicleInfo.carrierType || 'qt') +
              '.png')
          "
        />
        <div class="info-box ly-flex-1">
          <h5>{{ vehicleInfo.plateNumber }}</h5>
          <p class="car-name g-single-row">
            {{ vehicleInfo.driverName ? vehicleInfo.driverName : "暂无" }}
            <span style="margin: 0 10px">|</span>
            <!-- 无数据 -->
            {{
              vehicleInfo.carrierTypeName ? vehicleInfo.carrierTypeName : "其他"
            }}
            <span style="margin: 0 10px">|</span>
            {{ vehicleInfo.orgName ? vehicleInfo.orgName : "暂无" }}
          </p>
          <p class="car-type">
            <span class="label">车辆类型</span>
            {{
              vehicleInfo.classificationName
                ? vehicleInfo.classificationName
                : "其他"
            }}
          </p>
        </div>
      </div>
      <p class="address g-single-row">
        {{ locationInfo.address ? locationInfo.address : "" }}
      </p>
      <p class="time">{{ locationInfo.time ? locationInfo.time : "" }}</p>
    </div>

    <!-- 调度信息 -->
    <div
      class="info-box info-dispatch"
      v-if="dispatchInfo.unloadFormattedAddress"
    >
      <h5 class="info-box-title">运输信息</h5>
      <div
        class="info-box-status green"
        v-if="dispatchInfo.loadFormattedAddress"
      >
        <strong class="mr8">·</strong>运输中
      </div>
      <!-- content -->
      <div class="address-node">
        <p class="g-single-row">
          <span class="start">起</span>
          {{
            dispatchInfo.loadFormattedAddress
              ? dispatchInfo.loadFormattedAddress +
                dispatchInfo.loadAddressAlias
              : "暂无"
          }}
        </p>
      </div>
      <div class="address-node">
        <p class="g-single-row">
          <span class="end">终</span>
          {{
            dispatchInfo.unloadFormattedAddress
              ? dispatchInfo.unloadFormattedAddress +
                dispatchInfo.unloadAddressAlias
              : "暂无"
          }}
        </p>
      </div>
    </div>

    <!-- 设备信息   -->
    <div class="info-box info-device" :style="warnIsClose ? 'height:620px' : 'height: 428px'">
      <h5 class="info-box-title">设备信息</h5>
      <!-- content -->
      <div class="device-content ly-flex ly-flex-align-center">
        <div class="img-box ly-flex-pack-center ly-flex-align-center">
          <img
            v-if="deviceInfo.modelImageUrl"
            :src="deviceInfo.modelImageUrl.replace(/\{tag\}/g, 'icon')"
          />
        </div>
        <div class="info-box ly-flex-1">
          <h5 class="g-single-row">
            {{
              `${deviceInfo.modelName ? deviceInfo.modelName : ""} | ${
                deviceInfo.seriesName ? deviceInfo.seriesName : ""
              }`
            }}
          </h5>
          <p class="warn-text">
            今日告警
            <span class="count">{{ warnCount }}</span>
          </p>
        </div>
      </div>
      <ul class="device-list ly-flex">
        <li v-for="item in functionsInfo" :key="item.functionCode">
          <img :src="item.functionIcon" />
          <p :title="item.functionName">{{ item.functionName }}</p>
        </li>
      </ul>
      <!--  :style="warnIsClose ? '' : 'height: calc(100% - 170px)'" -->
      <ul class="info-list ly-flex map-scroll-panel">
        <li
          class="ly-flex ly-flex-align-center"
          v-for="item in attributesInfo"
          :key="item.attributeCode"
        >
          <div class="img-box ly-flex-align-center ly-flex-pack-center">
            <img :src="item.attributeIcon" />
          </div>
          <div>
            <p class="label">{{ item.attributeLabel }}</p>
            <p
              :class="item.attributeUnit ? 'count' : 'text'"
              :style="`color:${
                item.attributeColor ? item.attributeColor : '#3D4050'
              }`"
            >
              <span>{{ item.attributeText }}</span>
              {{ item.attributeUnit ? item.attributeUnit : "" }}
            </p>
          </div>
        </li>
      </ul>
      <!-- 视频 -->
      <ul class="video-content">
        <li
          class="video-content-item"
          :key="index"
          v-for="(item, index) in channelNumList"
          @click="handlePlay(`${index + 1}`)"
        >
          <img
            width="100%"
            height="100%"
            src="../../../utils/RVC/img/video-img.png"
            alt=""
          />
          <div class="video-content-item-top">
            <span> 通道 {{ index + 1 }}</span>
          </div>
          <div class="video-content-item-middle" v-show="videoShow">
            <img src="../../../assets/images/detail/play-back-play.png" />
          </div>
          <!-- <div
            @click.stop="handleMagnify(item.type)"
            class="video-content-item-bottom"
          >
            <img src="../../../assets/images/detail/video-bottom-right.png" />
          </div> -->
        </li>
      </ul>
    </div>
    <!-- showVideoDialog = false;videoShow = true -->
    <videoDialog
      @colseVideoDialog="colseVideoDialog"
      :show="showVideoDialog"
      :userId="videoUserId"
      :options="videoOptions"
    />
  </div>
</template>

<script>
import { http_request } from "@/api";
import bus from "./bus";
import videoDialog from "./infoVideo.vue";

export default {
  props: {
    vehicleCode: {
      type: String,
      default: null,
    },
    licenseNumber: {
      type: String,
      default: null,
    },
  },
  components: { videoDialog },
  data() {
    return {
      videoShow: true,
      channelNumList: [],
      // 车辆信息
      vehicleInfo: {},
      locationInfo: {},
      deviceInfo: {},
      functionsInfo: [],
      attributesInfo: [],
      fieldsInfo: {},
      dispatchInfo: {},
      warnCount: 0,
      showVideoDialog: false,
      videoUserId: "1",
      // videoList: [
      //   {
      //     typeName: "车前摄像头",
      //     VEHICLEID: "0", ////车辆ID
      //     CHANNEL: "1", //通道号
      //     VEHICLELICENSE: "91750", //车牌号
      //     DEVICENO: "015800091750", //设备编码
      //     PLATECOLOR: "2", //车牌颜色
      //     STREAMTYPE: "1", //主/子码流
      //   },
      // ],
      videoOptions: {},
      // 车辆状态字典
      vehicleStatusOptions: [
        { dictLabel: "空闲中", dictValue: 0, color: "blue" },
        { dictLabel: "任务中", dictValue: 1, color: "green" },
        { dictLabel: "维修中", dictValue: 2, color: "red" },
        { dictLabel: "保养中", dictValue: 3, color: "yellow" },
      ],
    };
  },
  watch: {
    vehicleCode: {
      handler(val) {
        if (val) {
          this.getVehicleInfo();
          this.getDispatchInfo();
          this.getWarnCount();
        }
      },
      immediate: true,
    },
  },
  computed: {
    warnIsClose() {
      console.log("this.$sotre.getters.isClose", this.$store.getters.isClose);
      return this.$store.getters.isClose;
    },
  },
  mounted() {
    // bus
    // bus.$on("isClose", (data) => {
    //   console.log("data", data);
    //   this.warnIsClose = data;
    // });
  },
  methods: {
    // 播放
    handlePlay(indexStr) {
      console.log("indexStr");
      this.videoOptions = {
        typeName: `通道 ${indexStr}`,
        VEHICLEID: "0",
        CHANNEL: indexStr,
        VEHICLELICENSE: this.licenseNumber,
        DEVICENO: this.deviceInfo.deviceSN,
        PLATECOLOR: "2",
        STREAMTYPE: "1",
      };
      this.showVideoDialog = true;
    },
    // 获取车辆信息
    getVehicleInfo() {
      const type = "vehicle,location,device,function,attribute,field"; // 获取信息类型, 可指定多个
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getVehicleInfo",
        url_code: [this.vehicleCode, type],
      };
      http_request(obj).then((res) => {
        // console.log("res,,,,", res.data);
        const { vehicle, location, device, functions, attributes, fields } =
          res.data;
        this.vehicleInfo = vehicle || {};
        this.locationInfo = location || {};
        this.deviceInfo = device || {};
        this.functionsInfo = functions || [];
        this.attributesInfo = attributes || [];
        this.fieldsInfo = fields || {};
        this.channelNumList = [];
        if(!fields || !fields.channelNum)
        for (let i = 0; i < Number(fields.channelNum); i++) {
          this.channelNumList.push(i);
        }
        // 根据经纬度获取点位
        if (
          this.locationInfo &&
          this.locationInfo.lng &&
          this.locationInfo.lat
        ) {
          this.$parent
            .getAddressBylnglat([this.locationInfo.lng, this.locationInfo.lat])
            .then((result) => {
              this.$set(this.locationInfo, "address", result);
            });
        }
      });
    },
    // 获取调度信息
    getDispatchInfo() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getAppointCarOrderIng",
        url_code: [this.vehicleCode],
      };
      http_request(obj).then((res) => {
        if (res.data) {
          const { addressInfo } = res.data;
          this.dispatchInfo = addressInfo || {};
        } else {
          this.dispatchInfo = {};
        }
      });
    },
    // 获取告警条数
    getWarnCount() {
      const obj = {
        moduleName: "http_map",
        method: "get",
        url_alias: "getWarnCount",
        data: {
          vehicleCode: this.vehicleCode,
        },
      };
      http_request(obj).then((res) => {
        this.warnCount = res.data || 0;
      });
    },
    // 字典匹配颜色
    selectDictColor( value) {
      // var actions = [];
      // Object.keys(datas).some((key) => {
      //   if (datas[key].dictValue == "" + value) {
      //     actions.push(datas[key].color);
      //     return true;
      //   }
      // });
      // return actions.join("");
      const obj ={
        3:'rgba(229, 94, 80, 1)',
        0:'rgba(196, 196, 196, 1)',
        1:'rgba(29, 185, 99, 1)',
        2:'rgba(255, 183, 57, 1)'
      }
      return obj[value]
    },
    colseVideoDialog() {
      this.showVideoDialog = false;
      this.videoShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.map-info-panel {
  > .info-box {
    position: relative;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 12px;
    // 标题样式
    .info-box-title {
      width: 284px;
      height: 28px;
      line-height: 28px;
      background: linear-gradient(
        90deg,
        rgba(70, 130, 250, 0.16) 0%,
        rgba(70, 130, 250, 0) 100%
      );
      border-radius: 3px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #3d4050;
      padding-left: 8px;
    }

    // 状态样式
    .info-box-status {
      position: absolute;
      top: 15px;
      right: 18px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      &.green {
        color: #43b91e;
      }
      &.blue {
        color: #4682fa;
      }
      &.red {
        color: #ef6969;
      }
      &.yellow {
        color: #ffbc00;
      }
    }

    // 车辆信息
    &.info-car {
      .car-content {
        margin: 8px 0 10px 0;
        > .img-box {
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }
        > .info-box {
          > h5 {
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3d4050;
            margin: -2px 0 2px 0;
          }
          .car-name {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3d4050;
            width: 285px;
          }
          .car-type {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #3d4050;
            .label {
              font-weight: 400;
              color: #a6a8ad;
              margin-right: 8px;
            }
          }
        }
      }
      .address {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #3d4050;
      }
      .time {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #a6a8ad;
      }
    }

    // 调度信息
    &.info-dispatch {
      height: 116px;
      .address-node {
        position: relative;
        &:not(:last-child)::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 10px;
          width: 1px;
          height: 8px;
          background: #c7cbd2;
        }
        > p {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #3d4050;
          > .start,
          > .end {
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
          > .start {
            margin-top: 13px;
            background: #ffbc00;
          }
          > .end {
            background: #4682fa;
          }
        }
      }
    }

    // 设备信息
    &.info-device {
      padding-right: 0;
      // height: ;
      overflow: scroll;
      .device-content {
        padding: 8px 12px 0 0;
        > .img-box {
          width: 68px;
          height: 80px;
          margin-right: 16px;
          > img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        > .info-box {
          padding-bottom: 15px;
          width: 270px;
          @mixin font {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
          }
          > h5 {
            @include font;
            margin-bottom: 6px;
          }
          > .warn-text {
            @include font;
            width: 262px;
            height: 32px;
            line-height: 32px;
            background: linear-gradient(
              90deg,
              rgba(239, 105, 105, 0.16) 0%,
              rgba(239, 105, 105, 0) 100%
            );
            border-radius: 3px;
            padding-left: 12px;
            .count {
              color: #ef6969;
            }
          }
        }
      }
      .device-list {
        padding-right: 10px;
        height: 46px;
        overflow: hidden;
        > li {
          text-align: center;
          width: 14.2%;
          > img {
            width: 26px;
            height: 26px;
          }
          > p {
            font-size: 10px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: #3d4050;
            transform: scale(0.9);
            margin-top: -3px;
          }
        }
      }
      .info-list {
        margin-top: 12px;
        overflow: scroll;
        flex-wrap: wrap;
        > li {
          width: 50%;
          height: 44px;
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 6px;
          }
          > .img-box {
            width: 44px;
            height: 44px;
            margin-right: 10px;
            background: #ebeff3;
            border-radius: 6px;
            > img {
              width: 28px;
              height: 28px;
            }
          }
          .label {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 22px;
            color: #adb5bd;
            margin-top: -4px;
          }
          .count {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
            > span {
              font-size: 24px;
              font-family: Bahnschrift;
              font-weight: 600;
              vertical-align: bottom;
            }
          }
          .text {
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            &.green {
              color: #43b91e;
            }
            &.red {
              color: #ef6969;
            }
          }
        }
      }
      .video-content {
        display: flex;
        flex-wrap: wrap;
        &-item {
          margin-right: 10px;
          margin-bottom: 8px;
          height: 93px;
          width: 170px;
          border-radius: 2px;
          background: #3d4050;
          position: relative;
          video {
            position: absolute;
            z-index: 199;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 142px;
            height: 80px;
          }
          &-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            padding-left: 10px;
            display: flex;
            align-items: center;
            z-index: 200;
            background: rgba(15, 15, 15, 0.53);
            opacity: 1;
            border-radius: 2px 2px 0px 0px;
            & > span {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: bold;
              color: #ffffff;
            }
          }
          &-middle {
            height: 30px;
            width: 30px;
            position: absolute;
            z-index: 200;
            top: calc(50% - 15px);
            left: calc(50% - 15px);
            & > img {
              height: 30px;
              width: 30px;
            }
          }
          &-bottom {
            z-index: 200;
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 17px;
            height: 17px;
          }
        }
        &-item:nth-child(2n) {
          margin-right: 0;
          margin-bottom: 8px;
        }
      }
    }
  }
}
video {
  background: -webkit-linear-gradient(left, #092040, #0a0009);
  background: -o-linear-gradient(right, #092040, #0a0009);
  background: -moz-linear-gradient(right, #092040, #0a0009);
  background: linear-gradient(to right, #092040, #0a0009);
  object-fit: fill;
}
</style>