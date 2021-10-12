<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="80px"
      size="small"
       class="ddc-queryParams"
    label-position="top"
    >
      <div class="ddc-queryParams-left">
      <div class="up">
      <el-form-item label="开户姓名" prop="bankUserName">
        <el-input
          v-model="queryParams.bankUserName"
          placeholder="请输入开户姓名"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="银行预留手机" prop="bankUserPhone" label-width="120px">
        <el-input
          v-model="queryParams.bankUserPhone"
          placeholder="请输入银行预留手机"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="开户银行" prop="bankName">
        <el-select
          v-model="queryParams.bankName"
          clearable
          filterable
          style="width: 185px"
          placeholder="请选择开户银行"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in bankNameList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankNumber">
          <el-input
          v-model="queryParams.bankNumber"
          placeholder="请输入银行卡号"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
        </div>
      <div class="down" v-show="isShow">
      <el-form-item label="提现日期">
        <el-date-picker
          v-model="queryParams.dateRange"
          unlink-panels
          :picker-options="pickerOptions"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder=" 请选择"
          end-placeholder=" 请选择"
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
  </div>
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
    bankNameList:{
      type:Array,
      default:()=>[]
    },
    bankNumberList:{
       type:Array,
      default:()=>[]
    }
    
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
  mounted() {},

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

<style scoped>
</style>
