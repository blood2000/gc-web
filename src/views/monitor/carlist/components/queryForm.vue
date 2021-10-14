<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
    class="ddc-queryParams"
    label-position="top"
  >
    <div class="ddc-queryParams-left">
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
        <!-- <el-form-item label="设备类型" prop="status">
      <el-select
        v-model="queryParams.status"
        clearable
        filterable
        style="width: 150px"
        placeholder="全部"
        @change="$emit('handleQuery')"
      >
        <el-option
          v-for="(item, index) in snList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item> -->
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

        <!-- <el-form-item label="在线状态" prop="onlineStatus">
      <el-select
        v-model="queryParams.onlineStatus"
        clearable
        filterable
        style="width: 150px"
        placeholder="请选择车辆状态"
        @change="$emit('handleQuery')"
      >
        <el-option
          v-for="(item, index) in onlineStatusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item> -->

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
    <div class="ddc-queryParams-right">
      <!-- <div @click="hanleIsShow">
        <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        <span>{{ isShow ? "收起" : "展开" }}</span>
      </div> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('handleQuery')"
        >
          搜索
        </el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="reset">
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

<style></style>
