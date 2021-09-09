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
        <div class="group-dialog-list">
          <div class="group-dialog-list-header">分组列表</div>
          <ul class="group-dialog-list-content">
            <li
              class="group-dialog-list-content-item"
              v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
              :key="index"
            >
              <div class="group-dialog-list-content-item-title">{{ item }}</div>
              <el-button type="text" class="group-dialog-list-content-item-del"
                >删除</el-button
              >
            </li>
          </ul>
          <div class="group-dialog-list-footer">
            <el-button type="text" @click="handleAddGroup">新增分组</el-button>
          </div>
        </div>
        <div class="group-dialog-transfer">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入车辆"
            v-model="searchValue"
            :data="searchData"
          >
          </el-transfer>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增分组"
      :visible.sync="addOpen"
      width="400px"
      :close-on-click-modal="false"
      :before-close="addCancel"
    >
      <el-input v-model="addGroupName" placeholder="请输入分组名"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOk">确 定</el-button>
        <el-button @click="addCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http_request } from "@/api";

export default {
  name: "group",
  props: {
    groupOpen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    groupOpen() {
      if (this.groupOpen) {
        this.requsetGroupHttp();
      }
    },
  },
  data() {
    return {
      searchValue: [],
      searchData: [],
      addGroupName: "",
      addOpen: false,
    };
  },
  methods: {
    //获取分组列表
    async requsetGroupHttp() {
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "group_list",
      };
      const res = await http_request(obj);
      console.log("group_list res==>", res);
    },
    //新增分组
    handleAddGroup() {
      this.addOpen = true;
    },
    // 分组管理确认
    async submitForm() {
      console.log("queren");
      this.$emit("colseGroupDialog");
    },
    // 分组管理关闭
    cancel() {
      this.$emit("colseGroupDialog");
    },
    // 新增分组名关闭
    addCancel() {
      this.addOpen = false;
      this.addGroupName = "";
    },
    // 新增分组名确认
    addOk() {
      this.addCancel();
    },
    filterMethod() {},
  },
};
</script>

<style lang="scss" scoped>
.group-dialog {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  .group-dialog-transfer {
    width: 550px;
  }
  .group-dialog-list {
    border: 1px solid #e6ebf5;
    border-radius: 4px;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    width: 200px;
    height: 303px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    margin-right: 10px;
    .group-dialog-list-header {
      height: 40px;
      line-height: 40px;
      background: #f5f7fa;
      margin: 0;
      padding-right: 15px;
      border-bottom: 1px solid #e6ebf5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      display: flex;
      flex-direction: row-reverse;
    }
    .group-dialog-list-footer {
      border-top: 1px solid #e6ebf5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      // text-align: center;
      padding-left: 30px;
    }
    .group-dialog-list-content {
      flex: 1;
      overflow: auto;
      &-item {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 40px;
        &-title {
          flex: 1;
          height: 100;
          padding-left: 30px;
          font-size: 16px;
        }
        &-del {
          width: 40px;
          text-align: center;
          color: red;
        }
      }
    }
  }
}
.group-dialog-transfer /deep/ .el-transfer__buttons {
  padding: 0 4px !important;
}
</style>