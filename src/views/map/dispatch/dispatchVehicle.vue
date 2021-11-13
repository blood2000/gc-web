<!-- 派车 -->
<template>
  <div>
    <el-dialog
      class="DispathcVehicle"
      :visible.sync="showDispatchVehicle"
      width="780px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="colse"
    >
      <template slot="title">
        <div>
          <span class="title-label">派车</span>
        </div>
      </template>
      <div class="content-title">
        <titleSideBlueTip title="运单信息" />
      </div>
      <div class="content-info">
        <el-row>
          <el-col :span="8">
            <div class="content-info-label">用车企业：</div>
            <div class="content-info-value">{{ pageObj.companyName }}</div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">调度单来源：</div>
            <div class="content-info-value">
              {{ sourceConfig[pageObj.source] }}
            </div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">货物类型：</div>
            <div class="content-info-value">{{ pageObj.goodsTypeName }}</div>
          </el-col>
        </el-row>
        <div class="addr">
          <div class="addr-box">
            <div class="addr-icon start">起</div>
            <div>{{ pageObj.loadFormattedAddress }}</div>
          </div>
          <div class="addr-box">
            <div class="addr-icon end">终</div>
            <div>{{ pageObj.unloadFormattedAddress }}</div>
          </div>
        </div>
      </div>
      <div class="content-title">
        <titleSideBlueTip title="承运车辆" />
      </div>
      <!-- <div slot="footer">
        <el-button @click="colse"> 取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">确定</el-button>
      </div> -->
      <CarMany
        v-if="isdetailData && isMany"
        :pageData="detailData"
        :dispatchOrderCode="pageObj.dispatchOrderCode"
        :carDrawer="showDispatchVehicle"
        :isZj="isZj"
        @handleClose="colse"
      />
      <CarSingle
        v-if="isdetailData && !isMany"
        :pageData="detailData"
        :dispatchOrderCode="pageObj.dispatchOrderCode"
        :carDrawer="showDispatchVehicle"
        :isZj="isZj"
        @handleClose="colse"
      />
    </el-dialog>
  </div>
</template>

<script>
import { http_request } from "@/api";
import config from "./config";
import CarMany from "../../dispatch/order/components/carMany.vue";
import CarSingle from "../../dispatch/order/components/carSingle.vue";
export default {
  name: "DispathcVehicle",
  data() {
    return {
      sourceConfig: {},
      pageObj: {
        companyName: "",
        source: "",
        goodsTypeName: "",
        loadFormattedAddress: "",
        unloadFormattedAddress: "",
        vehicleCode: null,
        driverCode: null,
        dispatchOrderCode: null,
      },
      detailData: {},
    };
  },

  components: { CarMany, CarSingle },

  computed: {
    isdetailData() {
      console.log("this.detailData", this.detailData);
      if (JSON.stringify(this.detailData) === "{}") return false;
      return true;
    },
    showDispatchVehicle() {
      console.log(
        "this.$store.getters.showDispatchVehicle",
        this.$store.getters.showDispatchVehicle
      );
      if (this.$store.getters.showDispatchVehicle) {
        this.renderPageObj();
      }
      return this.$store.getters.showDispatchVehicle;
    },
    isZj() {
      console.log("this.pageObj.source", this.pageObj.source);
      return this.pageObj.source === "chy" ? false : true;
    },
    isMany() {
      console.log("this.$store.getters.isMany", this.$store.getters.isMany);
      return this.$store.getters.isMany;
    },
  },

  mounted() {
    console.log("派车");
    this.sourceConfig = config.sourceConfig;
  },

  methods: {
    async getDetail(code) {
      console.log("1111", code);
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_dispatch",
        url_code: [code],
      };
      const res = await http_request(obj);
      this.detailData = res.data;
      if (this.isZj) {
        this.detailData.freight = this.detailData.expenseInfoVO.freight;
        this.detailData.settlementWay =
          this.detailData.expenseInfoVO.settlementWay;
      }
    },
    colse() {
      //重置
      this.$store.commit("set_dispatchVehicle", false);
    },
    renderPageObj() {
      this.pageObj = this.$store.getters.dispatchInfo;
      this.pageObj.dispatchOrderCode =
        this.$store.getters.dispatchInfo.dispatchOrderCode;
      const pageObj = this.pageObj;
      console.log("pageObj", pageObj, this.$store.getters.dispatchInfo);
      this.getDetail(pageObj.dispatchOrderCode);
    },
  },
};
</script>
<style lang='scss' scoped>
.title-label {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #3d4050;
}

.DispathcVehicle /deep/ .el-dialog__header {
  padding: 20px 20px 0 20px !important;
  border-bottom: none !important;
  background-image: none !important;
}
.content-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  line-height: 40px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}
.content-info {
  padding: 20px;
}
.content-info-label {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #a1a1a1;
}
.content-info-value {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #3d4050;
}
.info-header {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.addr {
  padding-top: 20px;
}

.addr-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .addr-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    border-radius: 3px;
    text-align: center;
    line-height: 18px;
    color: #fff;
    font-size: 12px;
  }
  .start {
    position: relative;
    background: #ffbc00;
  }
  .start::after {
    content: "";
    position: absolute;
    top: 19px;
    left: 8px;
    width: 0px;
    height: 14px;
    border: 1px solid #c7cbd2;
  }
  .end {
    background: #4682fa;
  }
}
.vehicleDrivers-content {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
}
.edit-icon {
  padding-left: 20px;
  .edicon {
    position: relative;
    top: 45px;
  }
}
.edit-icon i {
  padding-right: 20px;
}
.title-item {
  font-size: 18px;
  font-weight: 700;
  margin: 10px;
}
</style>