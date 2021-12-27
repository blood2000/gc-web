<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    class="ddc-queryParams"
    size="small"
    label-position="top"
  >
    <div class="ddc-queryParams-left">
      <div class="up">
        <el-form-item label="设备系列：" prop="seriesName">
          <el-select
            v-model="queryParams.seriesName"
            clearable
            filterable
            style="width: 185px"
            placeholder="请选择车辆状态"
            @change="$emit('handleQuery')"
          >
            <el-option
              v-for="(item, index) in seriesNameList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号：" prop="modelName">
          <el-select
            v-model="queryParams.modelName"
            clearable
            filterable
            style="width: 185px"
            placeholder="请选择车辆状态"
            @change="$emit('handleQuery')"
          >
            <el-option
              v-for="(item, index) in modelNameList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="激活状态：" prop="activationFlag">
          <el-select
            v-model="queryParams.activationFlag"
            clearable
            filterable
            style="width: 185px"
            placeholder="请选择车辆状态"
            @change="$emit('handleQuery')"
          >
            <el-option
              v-for="(item, index) in activationFlagList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态：" prop="status">
          <el-select
            v-model="queryParams.status"
            clearable
            filterable
            style="width: 185px"
            placeholder="请选择车辆状态"
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
        <el-form-item label="绑定车辆：" prop="licenseNumber">
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
      </div>
    </div>
    <div class="ddc-queryParams-right">
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
          plain
          icon="el-icon-refresh"
          @click="reset"
          class="ddc-queryParams-right-reset"
        >
          重置
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { statusList, activationFlagList } from "../config";

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelNameList: {
      type: Array,
      default: [],
    },
    seriesNameList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      statusList,
      activationFlagList,
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

<style lang="scss" scoped>
</style>