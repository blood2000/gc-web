<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
  >
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
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
          style="width: 185px"
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
      <el-form-item label="分组" prop="groupName">
        <el-select
          v-model="queryParams.groupName"
          clearable
          filterable
          style="width: 185px"
          placeholder="请选择车辆所属组织"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in groupList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否停运" prop="enabled">
        <el-select
          v-model="queryParams.enabled"
          clearable
          filterable
          style="width: 185px"
          placeholder="请选择是否停用"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in enabledList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    vehicleStatusList: {
      type: Array,
      default: () => []
    },
    groupList: {
      type: Array,
      default: () => []
    },
    enabledList: {
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
    // disabledDate: (time) => {
    //   return time.getTime() > new Date(new Date().getTime()) || time.getTime() < new Date('2010-06-01').getTime();
    // }
  }
};
</script>

<style></style>
