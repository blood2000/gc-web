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
  <!-- addressAlias addressName -->
    <div class="ddc-queryParams-left">
      <div class="up">
        <el-form-item label="地址:" prop="formattedAddress">
          <el-input
            v-model="queryParams.formattedAddress"
            placeholder="  请输入关键字"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
          <el-form-item label="地址别名:" prop="addressAlias">
          <el-input
            v-model="queryParams.addressAlias"
            placeholder="  请输入关键字"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="联系人姓名:" prop="contact">
          <el-input
            v-model="queryParams.contact"
            placeholder="  请输入关键字"
            clearable
            style="width: 185px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
         <el-form-item label="联系人电话:" prop="contactPhone">
          <el-input
            v-model="queryParams.contactPhone"
            placeholder="  请输入关键字"
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
          class="ddc-queryParams-right-reset"
          type="primary"
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
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
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
  methods: {
    reset() {
      this.queryParams.pageNum = 1;
      // this.resetForm('queryForm');
      console.log("qqq", this.$refs["queryForm"]);
      this.$refs["queryForm"].resetFields();
      this.$emit("handleQuery");
    },
  },
};
</script>
<style lang="scss" scoped>
</style>