<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
  >
    <el-form-item label="下单客户" prop="shipmentNameOrCompanyName">
      <el-input
        v-model="queryParams.shipmentNameOrCompanyName"
        placeholder="用车企业名称/下单客户姓名/下单客户电话"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>
    <el-form-item label="出发地信息" prop="loadFormattedAddress">
      <el-input
        v-model="queryParams.loadFormattedAddress"
        placeholder="出发地/联系人姓名/联系电话"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>
    <el-form-item label="目的地信息" prop="unloadFormattedAddress">
      <el-input
        v-model="queryParams.unloadFormattedAddress"
        placeholder="目的地/联系人姓名/联系电话"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>
    <el-form-item label="调度单号：" prop="dispatchOrderNo">
      <el-input
        v-model="queryParams.dispatchOrderNo"
        placeholder="请输入调度单号"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item label="货物类型：" prop="goodsType">
         <el-select
        v-model="queryParams.goodsType"
        clearable
        filterable
        style="width: 150px"
        placeholder="请选择"
        @change="$emit('handleQuery')"
      >
        <el-option
          v-for="(item, index) in goodsTypeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="调度单来源" prop="source">
         <el-input
        v-model="queryParams.source"
        placeholder=" 请输入调度单来源"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      /> </el-form-item>

    <el-form-item label="创建时间">
      <el-date-picker
        v-model="queryParams.dateRange"
        unlink-panels
        :picker-options="pickerOptions"
        size="small"
        style="width: 240px"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-form-item>
    <el-form-item label="调度单状态" prop="dispatchOrderStatus">
      <el-select
        v-model="queryParams.dispatchOrderStatus"
        clearable
        filterable
        style="width: 150px"
        placeholder="全部"
        @change="$emit('handleQuery')"
      >
        <el-option
          v-for="(item, index) in dispatchOrderStatusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="货源备注：" prop="remark"> 
        <el-input
        v-model="queryParams.remark"
        placeholder="请输入手机号码"
        clearable
        style="width: 185px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

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
    dispatchOrderStatusList: {
      type: Array,
      default: [],
    },
    goodsTypeList:{
        type:Array,
        default:[]
    }
  },
  data() {
    return {
      pickerOptions,
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
      this.queryParams.dateRange = [];
      this.$emit("handleQuery");
    },
  },
};
</script>

<style></style>
