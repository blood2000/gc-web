<template>
  <div class="pages-info">
    <div class="pages-info-left">
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
          :expand-on-click-node="false"
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
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :vehicle-status-list="vehicleStatusList"
        :groupList="groupList"
        :enabled-list="enabledList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <!-- 操作栏 -->
        <el-row :gutter="10" class="toolsbar">
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
          <!-- <el-col :span="1.5">
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
              </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleGroup"
              >车辆分组管理</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5" class="loadTemplate"
                ><a> 下载导入模板</a>
              </el-col> -->
          <!-- <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="searchQuery"
        /> -->
        </el-row>
        <!-- 表格 -->
        <RefactorTable
          is-show-index
          :loading="loading"
          :data="vehicleList"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          @selection-change="handleSelectionChange"
          :border="false"
          :stripe="true"
        >
          <template #authStatus="{ row }">
            <img
              :src="require(`../../../assets/images/dialog/${getAuthStatusListConfigOption(row.authStatus).img}.png`)"
              alt=""
            />
            <span
              :style="{
                color: getAuthStatusListConfigOption(row.authStatus).color,
              }"
            >
              {{ getAuthStatusListConfigOption(row.authStatus).label }}
            </span>
          </template>
          <template #vehicleStatus="{ row }">
            <span
              :style="{
                color: getVehicleStatusConfigOption(row.vehicleStatus).color,
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
          <template #licenseNumber="{ row }">
            {{
              row.vehicleAlias
                ? `(${row.vehicleAlias})  ${row.licenseNumber}`
                : row.licenseNumber
            }}
          </template>
          <template #driver="{ row }">
            {{
              (row.name === null ? "" : row.name) +
              "  " +
              (row.telphone === null ? "" : row.telphone)
            }}
          </template>
          <template #seriesModelName="{ row }">
            {{ !row.seriesModelName ? "未绑定" : row.seriesModelName }}
          </template>
          <template #factoryOnlyCode="{ row }">
            {{ !row.factoryOnlyCode ? "-" : row.factoryOnlyCode }}
          </template>

          <template #edit="{ row }" width="200">
            <el-button size="mini" type="text" @click="handleUpdate(row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              style="color: red"
              @click="handleDelete(row)"
              >删除</el-button
            >
            <el-button size="mini" type="text" @click="handlePosition(row)"
              >定位</el-button
            >
            <el-button size="mini" type="text" @click="handleDetail(row)"
              >详情</el-button
            >
            <el-button size="mini" type="text" @click="handleDevice(row)"
              >绑定设备</el-button
            >
          </template>
        </RefactorTable>
      </div>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="vehicleHttpReq"
      />
    </div>
    <Detail
      :code="currCode"
      :detailDrawer="detailDrawer"
      :options="{ title: '车辆信息' }"
      @colseDetailDrawer="colseDetailDrawer"
    />
    <VehicleDialog
      :options="{
        editType: editType,
        code: vehicleCode,
        defaultDriverList: defaultDriverList,
        orgCode: queryParams.orgCode,
        authStatusValue: authStatusValue,
        currAuthStatus: currAuthStatus,
      }"
      :open="open"
      :title="title"
      @colseDialog="colseDialog"
    ></VehicleDialog>
    <GroupDialog
      :group-open="groupOpen"
      @colseGroupDialog="colseGroupDialog"
    ></GroupDialog>
    <DeviceDialog
      :open="deviceOpen"
      :options="deviceOptions"
      @colseDeviceDialog="colseDeviceDialog"
    />
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
import Detail from "./detail.vue";

// import { mapState, mapMutations } from "vuex";
export default {
  name: "vehicle", // 车辆管理
  components: { QueryForm, VehicleDialog, GroupDialog, DeviceDialog, Detail },
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
        enabled: null, //是否启用
        orgCode: null,
      },
      vehicleCode: "",
      vehicleStatusList: [], //车辆状态
      authStatusList: [],
      vehicleStatusOptions: {},
      enabledList: [], //是否启用列表
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
      deviceOptions: {
        title: "",
      },
      authStatusValue: null,
      currAuthStatus: null,
      currCode: null,
      detailDrawer: false,
    };
  },
  created() {},
  mounted() {
    this.getConfigData();
    this.getDictData();
    this.getOrgHttp();
    this.requsetGroupHttp();
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    async requsetGroupHttp() {
      console.log("我被请求了");
      const obj = {
        moduleName: "http_group",
        method: "post",
        url_alias: "group_list",
        data: { pageNum: 1, pageSize: 1000 },
      };
      const res = await http_request(obj);
      console.log("group_list res==>", res);
      this.groupList = res.data.rows;
      console.log("this.groupList", this.groupList);
    },
    async getDefaultDriver() {
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "paging_de_driver",
        data: {
          pageNum: 1,
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
      this.authStatusList = vehicleConfig.authStatusList;
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
    getAuthStatusListConfigOption(item) {
      return vehicleConfig.authStatusList.filter((el) => el.value == item)[0];
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
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.queryParams.orgCode);
      });
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
    formToPaging() {
      console.log("this.queryParams.dateRange", this.queryParams.dateRange);
      const tmp = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        licenseNumber: this.queryParams.licenseNumber || null, //车牌号
        vehicleStatus: this.queryParams.vehicleStatus || null, //车辆状态
        groupName: this.queryParams.groupName || null, //分组
        enabled: this.queryParams.enabled || null, //是否启用
        createBeginTime:
          (this.queryParams.dateRange &&
            this.queryParams.dateRange.length > 0 &&
            this.queryParams.dateRange[0]) ||
          null,
        createEndTime:
          (this.queryParams.dateRange &&
            this.queryParams.dateRange.length > 0 &&
            this.queryParams.dateRange[1]) ||
          null,
        orgCode: this.queryParams.orgCode,
      };
      for (const item in tmp) {
        if (!tmp[item]) {
          delete tmp[item];
        }
      }
      console.log("tmp.createBeginTime", tmp.createBeginTime);
      if (tmp.createBeginTime) {
        tmp.createBeginTime = tmp.createBeginTime + " " + "00:00:00";
      }
      if (tmp.createEndTime) {
        tmp.createEndTime = tmp.createEndTime + " " + "23:59:59";
      }

      return tmp;
    },
    //请求分页数据
    async vehicleHttpReq() {
      this.loading = true;
      console.log("vehicleHttpReq", this.queryParams);

      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "vehicle_list_page",
        data: this.formToPaging(),
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      console.log("请求分页数据 page res ===>", res.data.rows);
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
      console.log("selection", selection);
      this.ids = selection.map((item) => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //删除
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      const ids = obj.code ? [obj.code] : this.ids;
      console.log("this.ids", ids, this.ids, obj.code);
      this.$confirm("删除操作不可恢复，确认要删除该车辆吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("进来请求了");
          //checkDelete
          const checkTmp = {
            moduleName: "http_vehicle",
            method: "post",
            url_alias: "checkDelete",
            data: { list: ids },
          };
          return http_request(checkTmp);
        })
        .then((el) => {
          if (el.data.type === 0) {
            this.$confirm(el.data.msg, "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              console.log("开始删了");
              //删除
              const tmp = {
                moduleName: "http_vehicle",
                method: "post",
                url_alias: "vehicle_del",
                data: { list: ids },
              };
              http_request(tmp).then((res) => {
                console.log("看看数据", res);
                if (res && res.code == "200") {
                  this.msgSuccess("删除成功");
                }
                this.searchQuery();
              });
            });
          } else {
            //删除
            const tmp = {
              moduleName: "http_vehicle",
              method: "post",
              url_alias: "vehicle_del",
              data: { list: ids },
            };
            http_request(tmp).then((res) => {
              console.log("看看数据", res);
              if (res && res.code == "200") {
                this.msgSuccess("删除成功");
              }
              this.searchQuery();
            });
          }
        });

      // //删除
      // const tmp = {
      //   moduleName: "http_vehicle",
      //   method: "post",
      //   url_alias: "vehicle_del",
      //   data: { list: ids },
      // };
      // http_request(tmp);

      // .then((res) => {
      //   console.log("看看数据", res);
      //   if (res && res.code == "200") {
      //     this.msgSuccess("删除成功");
      //   }
      //   this.searchQuery();
      // });
    },
    handleUpdate(obj) {
      console.log("修改车辆弹窗", obj);
      this.title = "修改车辆弹窗";
      this.editType = "update";
      this.open = true;
      this.vehicleCode = obj.code;
      this.authStatusValue = obj.authStatusValue;
      this.currAuthStatus = obj.authStatus;
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
      this.currCode = obj.code;
      this.detailDrawer = true;
      console.log("ckc code", this.currCode);
      // this.$router.push("detail?code=" + code);
    },
    handleDevice(obj) {
      console.log("ckc obj", obj, obj.deviceCode);

      this.deviceOptions = {
        title: obj.deviceCode ? "更换设备" : "绑定设备",
        vehicleCode: obj.code,
        isbang: obj.deviceCode ? true : false,
      };
      console.log("deviceOptions", this.deviceOptions);
      this.deviceOpen = true;
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
      this.vehicleHttpReq();
    },
    colseDetailDrawer() {
      this.detailDrawer = false;
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
