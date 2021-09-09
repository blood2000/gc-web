<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
  >
      <el-form-item label="用户名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名称"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="手机号码:" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
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
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="停用状态" prop="stopStatus">
        <el-select
          v-model="queryParams.stopStatus"
          clearable
          filterable
          style="width: 150px"
          placeholder="全部"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in stopStatusList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机状态" prop="driverStatus">
        <el-select
          v-model="queryParams.driverStatus"
          clearable
          filterable
         style="width: 150px"
          placeholder="全部"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in driverStatusList"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="realStatus">
        <el-select
          v-model="queryParams.realStatus"
          clearable
          filterable
          style="width: 150px"
          placeholder="全部"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in realStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
     
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
        >
          重置
        </el-button>
      </el-form-item>
  </el-form>
</template>

<script>
import { pickerOptions } from '@/utils/dateRange';

export default {
  props: {
    value: {
      type: Object,
      default: () => { return {}; }
    },
    stopStatusList: {
      type: Array,
      default: () => []
    },
    driverStatusList: {
      type: Array,
      default: () => []
    },
    realStatusList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions
      // 'projectList': []
    };
  },
  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  created() {
  },
  methods: {
      reset(){
        this.queryParams.pageNum = 1;
        // this.resetForm('queryForm'); 
        console.log('qqq',this.$refs['queryForm'])
        this.$refs['queryForm'].resetFields();
         this.queryParams.dateRange = []
        this.$emit('handleQuery');
        
      }
  }
};
</script>

<style></style>
