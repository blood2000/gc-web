<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="100px"
      size="small"
      class="ddc-queryParams"
      label-position="top"
    >
      <div class="ddc-queryParams-left">
        <div class="up">
          <el-form-item label="开户姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入名称"
              clearable
              style="width: 185px"
              @keyup.enter.native="$emit('handleQuery')"
            />
          </el-form-item>
          <el-form-item label="银行预留手机" prop="mobile" label-width="120px">
            <el-input
              v-model="queryParams.mobile"
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
          <el-form-item label="银行卡号" prop="account">
            <el-input
              v-model="queryParams.account"
              placeholder="请输入银行卡号"
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
          <el-button type="primary" class="ddc-queryParams-right-reset"  plain icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    bankNameList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
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
  },
};
</script>

<style scoped>
</style>
