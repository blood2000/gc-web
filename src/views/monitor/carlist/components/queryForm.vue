<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
    class="ddc-monitor-queryParams"
    label-position="top"
  >
    <div class="ddc-monitor-queryParams-left">
      <div class="up">
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input
            v-model="queryParams.plateNumber"
            placeholder=" 请输入车牌号"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="司机" prop="driverName">
          <el-input
            v-model="queryParams.driverName"
            placeholder=" 请输入司机姓名"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="车辆状态" prop="vehicleStatus">
          <el-select
            v-model="queryParams.vehicleStatus"
            clearable
            filterable
            style="width: 150px"
            placeholder="请选择车辆状态"
            @change="$emit('handleQuery')"
          >
            <el-option
              v-for="(item, index) in vehicleStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="设备号" prop="sn">
          <el-input
            v-model="queryParams.sn"
            placeholder="请输入设备编号"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
      </div>
    </div>
    <div class="ddc-monitor-queryParams-right" >
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('handleQuery')"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          class="ddc-queryParams-right-reset"
          plain
          icon="el-icon-refresh"
          style="margin-left:16px"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { onlineStatusList, vehicleStatusList } from "../config";
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    snList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      vehicleStatusList,
      onlineStatusList,
      isShow: false,
    };
  },
  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  mounted() {
    // this.vehicleStatusList =
  },
  methods: {
    reset() {
      this.queryParams.pageNum = 1;
      // this.resetForm('queryForm');
      console.log("qqq", this.$refs["queryForm"]);
      this.$refs["queryForm"].resetFields();
      this.queryParams.vehicleStatus = null;
      this.$emit("handleQuery");
    },
    hanleIsShow() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="scss" scoped>
.ddc-monitor-queryParams {
  display: flex;
  padding: 0 28px;
  .ddc-monitor-queryParams-left {
    flex: 1;
    .down{
      margin-bottom: 16px;
    }
    // background: brown;
  }
  .ddc-monitor-queryParams-right {
    width: 310px;
    box-sizing: border-box;
    padding-top:30px;
    padding-bottom:7px;
    display: flex;
    justify-content: flex-end;
    & > div {
      cursor: pointer;
      color: #409eff;
      font-size: 14px;
       margin-right:20px;
      line-height: 30px;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }
    &-reset{
      background-color: transparent !important;
    }
    &-reset:hover{
      background-color: #409eff !important;
      
    }
    &-reset:focus , &-reset:active{
      background-color: transparent !important;
      color: #1890ff;
    }
  }
 
}
</style>