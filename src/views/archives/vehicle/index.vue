<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="5" :lg="6" :md="8" :sm="9" :xs="24">
        <div class="device-info-left">
          <div class="head-container">
            <el-input
              v-model="orgName"
              placeholder="请输入组织名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="head-container el-tree-scroll-container">
            <el-tree
              ref="tree"
              :data="orgTreeData"
              :props="defaultTreeProps"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              :indent="0"
              :highlight-current="true"
              node-key="code"
              :current-node-key="queryParams.orgCode"
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <i class="tree-node-icon" :class="data.icon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xl="19" :lg="18" :md="16" :sm="15" :xs="24">
        <div class="device-info-right">
          <div class="device-info-right-top" v-show="showSearch">
            <!-- 上：搜索 -->
            <QueryForm
              v-model="queryParams"
              :vehicle-status-list="vehicleStatusList"
              :group-List="groupList"
              :enabled-list="enabledList"
              @handleQuery="searchQuery"
            />
          </div>
          <!-- 下 -->
          <div class="device-info-right-bottom">
            <!-- 操作栏 -->
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleAdd"
                  >新增</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  >删除</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleImport"
                  >导入</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  size="mini"
                  :loading="exportLoading"
                  @click="handleExport"
                  >导出</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleGroup"
                  >车辆分组管理</el-button
                >
              </el-col>
              <el-col :span="1.5" class="loadTemplate"
                ><a> 下载导入模板</a>
              </el-col>
              <right-toolbar
                :show-search.sync="showSearch"
                @queryTable="searchQuery"
              />
            </el-row>
            <!-- 表格 -->
            <RefactorTable
              is-show-index
              :loading="loading"
              :data="vehicleList"
              row-key="id"
              :table-columns-config="tableColumnsConfig"
              @selection-change="handleSelectionChange"
            >
              <template #vehicleStatus="{ row }">
                <span
                  :style="{
                    color: getVehicleStatusConfigOption(row.vehicleStatus)
                      .color,
                  }"
                >
                  {{ getVehicleStatusConfigOption(row.vehicleStatus).label }}
                </span>
              </template>
              <template #enabled="{ row }">
                <el-switch
                  v-model="row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(row)"
                />
              </template>
              <template #deviceInf="{ row }">
                <div
                  class="deviceInf-cion"
                  v-for="item in row.deviceInf"
                  :key="item.img"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top"
                  >
                    <img :src="item.img" alt="" />
                  </el-tooltip>
                </div>
              </template>

              <template #edit="{ row }" width="200">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(row)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  style="color: red"
                  @click="handleDelete(row)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-position"
                  @click="handlePosition(row)"
                  >定位</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  @click="handleDetail(row)"
                  >详情</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  @click="handleDevice(row)"
                  >绑定设备</el-button
                >
              </template>
            </RefactorTable>
            <!-- 分页 -->
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="vehicleHttpReq"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <VehicleDialog
      :options="{
        editType: editType,
        code: vehicleCode,
        defaultDriverList: defaultDriverList,
      }"
      :open="open"
      :title="title"
      @colseDialog="colseDialog"
    ></VehicleDialog>
    <GroupDialog
      :group-open="groupOpen"
      @colseGroupDialog="colseGroupDialog"
    ></GroupDialog>
    <DeviceDialog :open="deviceOpen"
    :options="deviceOptions"
     @colseDeviceDialog="colseDeviceDialog" />
  </div>
</template>

<script>
import vehicleConfig from "./vehicle_config";
import QueryForm from "./components/queryForm.vue";
import VehicleDialog from "./components/vehicle_dialog.vue";
import GroupDialog from "./components/group_dialog.vue";
import DeviceDialog from "./components/device_dialog.vue";
import { http_request } from "@/api";
import store from "@/store";
// import { mapState, mapMutations } from "vuex";
export default {
  name: "vehicle", // 车辆管理
  components: { QueryForm, VehicleDialog, GroupDialog, DeviceDialog },
  data() {
    return {
      showSearch: true, //搜索显隐
      loading: false, //表格load
      exportLoading: false, //到处load
      total: 0, //总条数
      multiple: true, //是否激活多选删除按钮
      editType: "add", //打开弹窗 执行的操作
      open: false, //dialog show
      groupOpen: false, //分组弹窗
      title: "", //dialog titile
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        licenseNumber: null, //车牌号
        vehicleStatus: null, //车辆状态
        groupName: null, //分组
        dateRange: [], //日期范围
        enabled: null, //是否停用
        orgCode: null,
      },
      vehicleCode: "",
      vehicleStatusList: [], //车辆状态
      vehicleStatusOptions: {},
      enabledList: [], //是否停用列表
      groupList: [], //分组列表
      tableColumnsConfig: [], //配置表头数据
      vehicleList: [], //表格数据
      selection: [], // 被勾选表格数据
      codes: [], //删除选择的codes
      orgName: "", //组织查询
      defaultDriverList: [],
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      deviceOpen: false,
      deviceOptions:{
        title:''
      }
    };
  },
  created() {},
  mounted() {
    this.getConfigData();
    this.getDictData();
    this.getOrgHttp();
    setTimeout(() => {
      console.log("store", store);
    }, 2000);
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    async getDefaultDriver() {
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "paging_de_driver",
        data: {
          startIndex: 1,
          pageSize: 10000,
          orgCode: this.queryParams.orgCode,
        },
      };
      const res = await http_request(obj);
      if (res.code == "200") {
        this.defaultDriverList = res.data.rows;
      }
      console.log("paging_de_driver", res);
    },
    getConfigData() {
      this.vehicleStatusList = vehicleConfig.vehicleStatusList;
      this.enabledList = vehicleConfig.enabledList;
      this.tableColumnsConfig = vehicleConfig.tableColumnsConfig;
    },
    getDictData() {
      this.getDicts("energyTypes").then((response) => {
        store.commit("SET_vehicleEnergyTypeList", response.data);
      });
      this.getDicts("vehicleClassification").then((response) => {
        store.commit("set_vehicleTypeCodeList", response.data);
      });
      this.getDicts("vehicle-carrier-type").then((response) => {
        store.commit("set_carrierTypeList", response.data);
      });
      this.getDicts("licenseColor").then((response) => {
        store.commit("set_vehicleLicenseColorCodeList", response.data);
      });
    },
    getVehicleStatusConfigOption(item) {
      let result = null;
      vehicleConfig.vehicleStatusList.forEach((el) => {
        if (item == el.value) {
          result = el;
        }
      });
      return result;
    },
    //停用状态修改
    handleStatusChange(row) {
      const text = row.enabled === 1 ? "启用" : "停用";
      this.$confirm("确认要" + text + "吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          console.log("row", row);
          const obj = {
            moduleName: "http_vehicle",
            method: "put",
            url_alias: "vehicle_enabled",
            data: {
              vehicleCode: row.code,
              enabled: row.enabled,
            },
          };
          return http_request(obj);
        })
        .then((res) => {
          console.log("res", res);
          this.msgSuccess(text + "成功");
          this.searchQuery();
        })
        .catch(function () {
          row.enabled = row.enabled === 1 ? 0 : 1;
        });
    },
    //请求组织树数据
    async getOrgHttp() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      if (this.orgName) obj.data = { orgName: this.orgName };
      const orgRes = await http_request(obj);
      console.log("orgRes res", orgRes);
      this.orgTreeData = orgRes.data.length > 0 ? orgRes.data : [];
      this.queryParams.orgCode = this.orgTreeData[0].code;
      console.log("当前code", this.queryParams.orgCode);
      this.getDefaultDriver();
      this.searchQuery();
    },
    //过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    //点击组织树节点
    handleNodeClick(data) {
      console.log("data", data);
      this.queryParams.orgCode = data.code;
      this.queryParams.pageNum = 1;
      this.vehicleHttpReq();
    },
    //初始页数请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.vehicleHttpReq();
    },
    //请求分页数据
    async vehicleHttpReq() {
      this.loading = true;
      console.log("vehicleHttpReq", this.queryParams);
      const tmp = {
        startIndex: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        licenseNumber: this.queryParams.licenseNumber || null, //车牌号
        vehicleStatus: this.queryParams.vehicleStatus || null, //车辆状态
        groupName: this.queryParams.groupName || null, //分组
        enabled: this.queryParams.enabled || null, //是否停用
        createBeginTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[0]) || null,
        createEndTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[1]) || null,
        orgCode: this.queryParams.orgCode,
      };
      if (tmp.createBeginTime)
        tmp.createBeginTime = tmp.createBeginTime + " " + "00:00:00";
      if (tmp.createEndTime)
        tmp.createEndTime = tmp.createEndTime + " " + "23:59:59";
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "vehicle_list_page",
        data: tmp,
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      console.log("page res", res);
      if (res.code == "200") {
        this.vehicleList = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
      } else {
        console.log("error", res);
        this.loading = false;
      }
    },
    //新增
    handleAdd() {
      this.title = "新增车辆弹窗";
      this.editType = "add";
      this.open = true;
    },
    //导入
    handleImport() {},
    //导出
    handleExport() {
      //  this.exportLoading = true;
      // const params = Object.assign({}, this.queryParams);
      // params.pageSize = undefined;
      // params.pageNum = undefined;
      // this.download('/fmsweb/basic/vehicle/v1/export', params, `车辆信息`);
      // this.exportLoading = false;
    },
    //分组管理
    handleGroup() {
      this.groupOpen = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //删除
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      const ids = [obj.code] || this.ids;
      console.log("this.ids", ids);
      this.$confirm("是否确认删除此项数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const tmp = {
            moduleName: "http_vehicle",
            method: "post",
            url_alias: "vehicle_del",
            data: { list: ids },
          };
          http_request(tmp);
        })
        .then(() => {
          this.vehicleHttpReq();
          this.msgSuccess("删除成功");
        });
    },
    handleUpdate(obj) {
      this.title = "修改车辆弹窗";
      this.editType = "update";
      this.open = true;
      this.vehicleCode = obj.code;
    },
    handlePosition(obj) {
        console.log("obj", obj);
         const vehicleCode = obj.code;
      const trackType = 1;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    handleDetail(obj) {
      const code = obj.code;
      console.log(" index code", code);
      this.$router.push("detail?code=" + code);
    },
    handleDevice(obj) {
      console.log("ckc obj", obj);
      
      this.deviceOptions = {
        title:obj.seriesCode?'更换设备':'绑定设备',
        vehicleCode:obj.code,
        isbang:obj.seriesCode?true:false
      }
      this.deviceOpen = true 

    },
    colseDialog(e) {
      console.log("关闭。。。", e);
      this.open = false;
      if (e == "ok") this.searchQuery();
    },
    colseGroupDialog() {
      console.log("group关闭。。。");
      this.groupOpen = false;
    },
    colseDeviceDialog() {
      console.log("device关闭。。。");
      this.deviceOpen = false;
      this.vehicleHttpReq()
    },
  },
};
</script>

<style lang="scss" scoped>
.device-info {
  margin: 0 15px;
  @mixin box-shadow {
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left {
    @include box-shadow;
    min-height: calc(100vh - 146px);
  }

  .device-info-right {
    .device-info-right-top {
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom {
      @include box-shadow;
    }
  }
}
.deviceInf-cion {
  display: flex;
  flex-direction: row;
  width: 20xp;
  height: 20px;
}
.loadTemplate {
  padding-left: 15px;
  padding-right: 5px;
  padding-top: 3px !important;
  color: #409eff;
  font-size: 14px;
}
</style>
