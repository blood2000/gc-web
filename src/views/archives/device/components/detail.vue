<template>
  <el-drawer
    title="设备详情"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    size="55%"
    :before-close="handleClose"
    :append-to-body="true"
  >
  <!-- colseDetailDrawer -->
    <div class="device-box">
      <el-tag class="tag-info" type="danger" v-if="detailObj.expireFlagValue">
        <img src="../../../../assets/images/dialog/icon-error.png" alt="" />
        该设备已到期，请及时续费！</el-tag
      >
      <div class="device-detail">
        <div class="device-detail-left">
          <div class="device-detail-left-border">
            <img src="../../../../assets/images/device/demo.png" alt="" />
          </div>
          <div class="device-detail-left-card" v-if="isShow">
            <div class="device-detail-left-card-title">绑定车辆</div>
            <div class="device-detail-left-card-number">
              {{ detailObj.vehicleInfo.vehicleAlias }} |
              {{ detailObj.vehicleInfo.licenseNumber }}
            </div>
            <div class="device-detail-left-card-date">
              <div class="date-time-label">绑定时间</div>
              <div class="date-time-content">
                {{ detailObj.vehicleInfo.bindTime }}
              </div>
            </div>
            <el-button class="card-btn" @click="unbind" round>解绑</el-button>
          </div>
        </div>
        <div class="device-detail-right">
          <div style="margin-bottom: 24px">
            <el-row class="device-detail-right-row">
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">产品系列</span>
                <span class="title">{{ detailObj.seriesName }}</span>
              </el-col>
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">设备型号</span>
                <span class="title">{{ detailObj.modelName }}</span>
              </el-col>
            </el-row>
            <el-row class="device-detail-right-row">
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">设备状态</span>
                <span class="title">{{ detailObj.statusValue }}</span>
              </el-col>
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">设备编号</span>
                <span class="title">{{ detailObj.factoryOnlyCode }}</span>
              </el-col>
            </el-row>
            <el-row class="device-detail-right-row">
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">激活状态</span>
                <span class="title">{{ detailObj.activationFlagValue }}</span>
              </el-col>
              <el-col v-if="isShow" :span="12" class="device-detail-right-row-col">
                <span class="labels">激活时间</span>
                <span class="title">{{ detailObj.expireFlagValue }}</span>
              </el-col>
            </el-row>
            <el-row v-if="isShow" class="device-detail-right-row">
              <el-col :span="12" class="device-detail-right-row-col">
                <span class="labels">到期时间</span>
                <span class="title">{{ detailObj.expireDate }}</span>
              </el-col>
            </el-row>
          </div>
          <div>
            <div class="device-manage">
              <div class="device-manage-header">
                <img
                  src="../../../../assets/images/device/device-more.png"
                  style="width: 3px; height: 13px"
                />
                <div class="device-manage-header-title">设备功能</div>
              </div>
              <div class="device-manage-content">
                <div
                  class="device-manage-content-item"
                  v-for="item in detailObj.icons"
                  :key="item.icon + item.name"
                >
                  <img :src="item.icon" style="width: 32px; height: 32px" />
                  <div class="device-manage-content-item-text">
                    {{ item.modelName }}
                  </div>
                </div>
              </div>
            </div>
            <div class="device-manage">
              <div class="device-manage-header" style="margin-bottom: 24px">
                <img
                  src="../../../../assets/images/device/device-more.png"
                  style="width: 3px; height: 13px"
                />
                <div class="device-manage-header-title">关联设备</div>
              </div>
              <div class="device-relevance-list">
                <div
                  class="device-relevance-list-item"
                  v-for="item in detailObj.associatedEquipments"
                  :key="item.deviceSnNo"
                >
                  <div class="device-relevance-list-item-img">
                    <img :src="item.deviceUrl" v-if="item.deviceUrl" />
                  </div>
                  <div class="device-relevance-list-item-content">
                    <div class="device-relevance-list-item-content-top">
                      {{ item.deviceName }}
                    </div>
                    <div class="device-relevance-list-item-content-middle">
                      设备编号
                    </div>

                    <div class="device-relevance-list-item-content-bottom">
                      {{ item.deviceSnNo }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from '../../../../api';
export default {
  props: {
    detailDrawer: {
      type: Boolean,
      default: false,
    },
    detailObj: {
      type: Object,
      default: {},
    },
  },
  computed: {
    isShow() {
      const result =
        this.detailObj.activationFlag &&
        this.detailObj.vehicleInfo &&
        this.detailObj.vehicleInfo.vehicleCode
          ? true
          : false;
      console.log("result", result);
      return result;
    },
  },
  methods: {
     handleClose() {
      this.$emit("colseDetailDrawer");
    },
    unbind(){
       this.$confirm(
        `确认将设备与车辆【${
          this.detailObj.vehicleInfo && this.detailObj.vehicleInfo.licenseNumber
        }】解绑？`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const tmp = {
            moduleName: "http_vehicle",
            method: "put",
            url_alias: "untieTheVehicle",
            data: {
              vehicleCode: this.detailObj.vehicleInfo.vehicleCode,
              factoryOnlyCode: this.detailObj.factoryOnlyCode,
              deviceCode: this.detailObj.deviceCode,
            },
          };
          http_request(tmp).then(() => {
            this.$emit('searchQuery');
            this.handleClose()
            this.msgSuccess("解绑成功");
          });
        })
        .catch((res) => {
          console.log("res error", res);
          this.msgError("解绑失败");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.device-box {
  padding: 16px 32px;
}
.device-detail {
  box-sizing: border-box;
  display: flex;
  &-left {
    width: 277px;
    margin-right: 48px;
    &-border {
      width: 279px;
      height: 279px;
      border: 1px solid #dddddd;
      margin-bottom: 15px;
      & > img {
        width: 277px;
        height: 277px;
      }
    }
    &-card {
      width: 279px;
      height: 136px;
      background: linear-gradient(89deg, #8ba2d0 0%, #b1c3e6 100%);
      border-radius: 6px;
      box-sizing: border-box;
      padding: 12px;
      &-title {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        opacity: 0.8;
        margin-bottom: 2px;
      }
      &-number {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 2px;
      }
      &-date {
        display: flex;
        margin-bottom: 15px;
      }
    }
  }
  &-right {
    flex: 1;
    min-width: 0;
    font-family: PingFang SC;
    padding-top: 4px;
    &-row {
      margin-bottom: 12px;
      &-col {
        .labels {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #b3b3b3;
          margin-right: 14px;
        }
        .title {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #3d4050;
        }
      }
    }
    .device-manage {
      &-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        &-title {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #3d4050;
          margin-left: 5px;
        }
      }
      &-content {
        display: flex;
        margin-bottom: 24px;
        &-item {
          width: 64px;
          height: 64px;
          background: #ffffff;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 24px;
          margin-bottom: 28px;
          &-text {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #3d4050;
          }
        }
      }
    }
    .device-relevance-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &-item {
        width: 287px;
        height: 84px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-right: 27px;
        margin-bottom: 20px;
        padding: 8px;
        display: flex;
        &-img {
          width: 68px;
          height: 68px;
          background: #ffffff;
          border-radius: 5px;
          margin-right: 8px;
          & > img {
            width: 100%;
            height: 100%;
          }
        }
        &-content {
          flex: 1;
          &-top {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #3d4050;
            margin-bottom: 9px;
          }
          &-middle {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #b3b3b3;
          }
          &-bottom {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #3d4050;
          }
        }
      }
    }
  }
}
.tag-info {
  width: 100%;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  margin-bottom: 18px;
  & > img {
    width: 16px;
    height: 16px;
    vertical-align: text-top;
    margin-right: 8px;
  }
}
.date-time-label {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
  margin-right: 8px;
}
.date-time-content {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
}
.card-btn {
  width: 80px;
  height: 28px;
  background: #ffffff;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #4682fa;
  line-height: 0;
}
</style>
