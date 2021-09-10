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
              v-for="(item, index) in groupList"
              :key="index"
              @click="handleGroup(item)"
            >
              <div class="group-dialog-list-content-item-title">
                {{ item.name }}
              </div>
              <el-button
                type="text"
                class="group-dialog-list-content-item-del"
                @click="groupDel(item)"
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
            filter-placeholder="请输入车牌号"
            :titles="['未加入车辆', '已加入车辆']"
            v-model="searchValue"
            :props="{
              key: 'vehicleCode',
              label: 'licenseNumber',
            }"
            :data="searchData"
            @change="getObject"
          >
            <span slot-scope="{ option }">{{ option.licenseNumber }}</span>
            <!-- <pagination
              :total="no_obj.total"
              small
              class="transfer-footer"
              layout="prev, pager, next"
              slot="left-footer"
              :page.sync="no_obj.startIndex"
              :limit.sync="no_obj.pageSize"
              @pagination="no_obj_http"
            />
            <pagination
              slot="right-footer"
              small
              class="transfer-footer"
              layout="prev, pager, next"
              :total="add_obj.total"
              :page.sync="add_obj.startIndex"
              :limit.sync="add_obj.pageSize"
              @pagination="add_obj_http"
            /> -->
          </el-transfer>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
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
        console.log("this.groupOpen", this.groupOpen);
        this.requsetGroupHttp();
      }
    },
  },
  data() {
    return {
      searchValue: [], //右
      searchData: [], //左
      addGroupName: "", //新增分组名字
      addOpen: false, //新增分组弹出框
      groupList: [], //分组列表
      no_obj: {
        groupCode: null,
        licenseNumber: null,
        startIndex: 1,
        pageSize: 1000,
        total: 0,
      },
      add_obj: {
        groupCode: null,
        licenseNumber: null,
        startIndex: 1,
        pageSize: 1000,
        total: 0,
      },
    };
  },
  methods: {
    //获取分组列表
    async requsetGroupHttp() {
      console.log("我被请求了");
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "group_list",
      };
      const res = await http_request(obj);
      console.log("group_list res==>", res);
      this.groupList = res.data;
      console.log("this.groupList", this.groupList);
    },
    //新增分组
    handleAddGroup() {
      this.addOpen = true;
    },
    //数据init
    init() {
      this.searchValue = [];
      this.searchData = [];
      this.no_obj = {
        groupCode: null,
        licenseNumber: null,
        startIndex: 1,
        pageSize: 1000,
        total: 0,
      };
      this.add_obj = {
        groupCode: null,
        licenseNumber: null,
        startIndex: 1,
        pageSize: 1000,
        total: 0,
      };
    },
    //查看分组
    async handleGroup(data) {
      this.init();
      console.log("handleGroup data", data);
      this.no_obj.groupCode = data.code;
      this.add_obj.groupCode = data.code;
      this.no_obj_http();
      this.add_obj_http();
    },
    //未加入车辆列表
    async no_obj_http() {
      const me = this;
      console.log("no_obj_http", me.no_obj);
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "paging_no_add_group",
        data: me.no_obj,
      };
      const res = await http_request(obj);
      console.log("paging_no_add_group", res);
      me.searchData = res.data.rows;
      me.no_obj.total = res.data.total;
      console.log("this.searchData", me.searchData);
    },
    //已加入车辆列表
    async add_obj_http() {
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "paging_ok_add_group",
        data: this.add_obj,
      };
      const res = await http_request(obj);
      console.log("paging_ok_add_group", res);
      const tmpList = res.data.rows;
      this.searchValue = [];
      for (const item of tmpList) {
        this.searchValue.push(item.vehicleCode);
        this.searchData.push({
          vehicleCode: item.vehicleCode,
          licenseNumber: item.licenseNumber,
        });
      }
      console.log(this.searchValue, "<- value 11 data ->", this.searchData);
      this.add_obj.total = res.data.total;
    },
    //删除分组
    groupDel(data) {
      const code = data.code;
      this.$confirm("确认要删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const obj = {
            moduleName: "http_group",
            method: "delete",
            url_alias: "group_del",
            data: { code },
            query: true,
          };
          return http_request(obj);
        })
        .then((res) => {
          this.msgSuccess("删除成功");
          this.requsetGroupHttp();
        });
    },
    // 分组管理关闭
    cancel() {
      this.groupList= []
      this.init();
      this.$emit("colseGroupDialog");
    },
    // 新增分组名关闭
    addCancel() {
      this.addOpen = false;
      this.addGroupName = "";
    },
    // 新增分组名确认
    addOk() {
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "group_add",
        data: { name: this.addGroupName },
      };
      http_request(obj).then((res) => {
        console.log("addOk res", res);
        this.msgSuccess("添加成功");
        this.requsetGroupHttp();
      });

      this.addCancel();
    },
    filterMethod(query, item) {
      console.log("item", item, query);
      return item.licenseNumber.indexOf(query) > -1;
    },
    //发生变化操作
    getObject(value, direction, movedKeys) {
      console.log("sss", value, direction, movedKeys);
      console.log("选中的数据有" + this.searchValue);
      const me = this;
      const list = [];
      for (const item of movedKeys) {
        const tmp = {
          groupCode: me.add_obj.groupCode,
          vehicleCode: item,
        };
        list.push(tmp);
      }
      console.log("转移的数据", list);
      const sendHttp = {
        right: async () => {
          try {
            const obj = {
              moduleName: "http_group",
              method: "post",
              url_alias: "add_vehicle_group",
              data: { list },
            };
            const res = await http_request(obj);
            console.log("res", res);
          } catch (error) {
            console.log("error", error);
            me.handleGroup();
          }
        },
        left: async () => {
          try {
            const obj = {
              moduleName: "http_group",
              method: "post",
              url_alias: "del_from_group",
              data: { list },
            };
            const res = await http_request(obj);
            console.log("res", res);
          } catch (error) {
            console.log("error", error);
            me.handleGroup();
          }
        },
      };
      sendHttp[direction]();
    },
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
      padding-left: 20px;
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
        cursor:pointer;
        &-title {
          flex: 1;
          height: 100;
          padding-left: 20px;
          font-size: 16px;
        }
        &-del {
          width: 40px;
          text-align: center;
          color: red;
        }
      }
      &-item:hover{
        background: #409EFF;
        color: #ffffff;
      }
    }
  }
}
.group-dialog-transfer /deep/ .el-transfer__buttons {
  padding: 0 4px !important;
}
</style>