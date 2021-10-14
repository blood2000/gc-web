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
  </div>
   <div class="down" v-show="isShow">
    <el-form-item label="货物类型：" prop="goodsType">
      <el-select
        v-model="queryParams.goodsType"
        clearable
        filterable
        style="width: 185px"
        placeholder="请选择"
        @change="$emit('handleQuery')"
      >
        <el-option
          v-for="(item, index) in goodsTypeList"
          :key="index"
          :label="item.dictLabel"
          :value="item.dictValue"
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
      />
    </el-form-item>
    <el-form-item label="调度单状态" prop="dispatchOrderStatus">
      <el-select
        v-model="queryParams.dispatchOrderStatus"
        clearable
        filterable
        style="width: 185px"
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
   </div>
    </div>
    
 <div class="ddc-queryParams-right">
      <div @click="hanleIsShow">
        <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        <span>{{ isShow ? "收起" : "展开" }}</span>
      </div>
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
    goodsTypeList: {
      type: Array,
      default: [],
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
      this.queryParams.dateRange = [];
      this.$emit("handleQuery");
    },
     hanleIsShow() {
      this.isShow = !this.isShow;
    },
  },
  
};
</script>

<style></style>
