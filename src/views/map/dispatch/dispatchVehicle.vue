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
        <titleSideBlueTip />
        <span>运单信息</span>
      </div>
      <div class="content-info">
        <el-row>
          <el-col :span="8">
            <div class="content-info-label">用车企业：</div>
            <div class="content-info-value">建平县融信矿业有限公司</div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">调度单来源：</div>
            <div class="content-info-value">超好运</div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">货物类型：</div>
            <div class="content-info-value">金属矿石</div>
          </el-col>
        </el-row>
        <div>
            <div class="addr-box">
        <div class="addr-icon start"></div>
        <div>{{ 111 }}</div>
      </div>
      <div class="addr-box">
        <div class="addr-icon end"></div>
        <div>{{222 }}</div>
      </div>
        </div>
      </div>
      <div class="content-title">
        <titleSideBlueTip />
        <span>承运车辆</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DispathcVehicle",
  data() {
    return {};
  },

  components: {},

  computed: {
    showDispatchVehicle() {
      return this.$store.getters.showDispatchVehicle;
    },
  },

  mounted() {
    console.log("派车");
  },

  methods: {
    colse() {
      this.$store.commit("set_dispatchVehicle", false);
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
  padding: 20px ;
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
.info-header{
  padding-left: 0 !important;
  padding-right: 0 !important;
}

  .addr-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
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
      height: 8px;
      border: 1px solid #c7cbd2;
    }
    .end {
      background: #4682fa;
    }
  }
</style>