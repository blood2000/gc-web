<template>
  <div class="app-container">
    <el-dialog
      title="分组管理"
      :visible.sync="groupOpen"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="group-dialog">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入车辆"
          v-model="searchValue"
          :data="searchData"
        >
        </el-transfer>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "group",
  props: {
    groupOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue:[],
      searchData:[],
    };
  },
  methods: {
    async submitForm() {
      console.log("queren");
      this.$emit("colseGroupDialog");
    },
    cancel() {
      this.$emit("colseGroupDialog");
    },
    filterMethod(){

    }
  },
};
</script>

<style lang="scss" scoped>
.group-dialog {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>