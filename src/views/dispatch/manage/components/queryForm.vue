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
      <el-form-item label="派车记录编号" prop="appointCarRecordNo">
        <el-input
          v-model="queryParams.appointCarRecordNo"
          placeholder=" 请输入调度单号"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="派车单号" prop="appointCarOrderNo">
        <el-input
          v-model="queryParams.appointCarOrderNo"
          placeholder=" 请输入派车单号"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="下单客户" prop="shipmentName">
        <el-input
          v-model="queryParams.shipmentName"
          placeholder=" 请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="用车企业" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder=" 请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="出发地" prop="loadAddress">
        <el-input
          v-model="queryParams.loadAddress"
          placeholder=" 请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="目的地" prop="unloadAddress">
        <el-input
          v-model="queryParams.unloadAddress"
          placeholder="请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="承运车辆" prop="vehicleNumber">
        <el-input
          v-model="queryParams.vehicleNumber"
          placeholder="请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="调度单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          filterable
          style="width: 150px"
          placeholder="全部"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接单时间:" prop="receiveTime">
        <el-date-picker
          v-model="queryParams.receiveTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出车时间:" prop="loadTime">
        <el-date-picker
          v-model="queryParams.loadTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="回车时间:" prop="unloadTime">
        <el-date-picker
          v-model="queryParams.unloadTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
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
        <el-button
          type="primary"
          class="ddc-queryParams-right-reset"
          plain
          icon="el-icon-refresh"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { pickerOptions } from "@/utils/dateRange";

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    statusList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      pickerOptions,
      isShow: false,
      // 'projectList': []
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
  created() {},
  methods: {
    reset() {
      this.queryParams.pageNum = 1;
      // this.resetForm('queryForm');
      console.log("qqq", this.$refs["queryForm"]);
      this.$refs["queryForm"].resetFields();
      this.queryParams.receiveTime = [];
      this.queryParams.loadTime = [];
      this.queryParams.unloadTime = [];
      this.$emit("handleQuery");
    },
    hanleIsShow() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style></style>
