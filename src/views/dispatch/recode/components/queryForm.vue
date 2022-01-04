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
        <el-form-item label="调度单号" prop="dispatchOrderNo">
          <el-input
            v-model="queryParams.dispatchOrderNo"
            placeholder="请输入调度单号"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="出发地" prop="loadAddress">
          <el-input
            v-model="queryParams.loadAddress"
            placeholder="请输入出发地"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="目的地" prop="unloadAddress">
          <el-input
            v-model="queryParams.unloadAddress"
            placeholder=" 请输入目的地"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="司机" prop="driverNameOrPhone">
          <el-input
            v-model="queryParams.driverNameOrPhone"
            placeholder="司机姓名/司机电话"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
      </div>
      <div class="down" v-show="isShow">
        <el-form-item label="车牌号" prop="vehicleNumber">
          <el-input
            v-model="queryParams.vehicleNumber"
            placeholder=" 请输入车牌号"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="货物类型：" prop="goodsType">
          <el-cascader
            clearable
            filterable
            v-model="queryParams.goodsCode"
            @change="cascaderChange"
            :options="goodsTypeList"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="派车日期" prop="appointCarDate">
          <el-date-picker
            v-model="queryParams.appointCarDate"
            unlink-panels
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择派车日期"
          >
          </el-date-picker>
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
        <el-button type="primary" class="ddc-queryParams-right-reset" plain icon="el-icon-refresh" @click="reset">
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
  created() {
    console.log("goodsTypeList", this.goodsTypeList);
  },
  methods: {
    cascaderChange(){
        this.queryParams.goodsType = this.queryParams.goodsType[1];
      this.$emit("handleQuery");
    },
    reset() {
      this.queryParams.pageNum = 1;
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
