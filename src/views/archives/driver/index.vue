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
              node-key="code"
              :current-node-key="queryParams.orgCode"
              :highlight-current="true"
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
              :enabled-list="driverConfig.enabledConfigArr"
              :driver-status-list="driverStatusList"
              :real-status-list="driverConfig.realStatusConfigArr"
              @handleQuery="searchQuery"
            />
          </div>
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
              <right-toolbar
                :show-search.sync="showSearch"
                @queryTable="searchQuery"
              />
            </el-row>
            <!-- 表格 -->
            <RefactorTable
              is-show-index
              :loading="loading"
              :data="driverList"
              row-key="id"
              :table-columns-config="tableColumnsConfig"
              @selection-change="handleSelectionChange"
            >
              <template #driverStatus="{ row }">
                <span
                  :style="{
                    color: driverStatusDeal(row.driverStatus, 'color'),
                  }"
                >
                  {{ driverStatusDeal(row.driverStatus, "text") }}
                </span>
              </template>
              <template #realStatus="{ row }">
                <span
                  :style="{
                    color: realStatusDeal(row.realStatus, 'color'),
                  }"
                >
                  {{ realStatusDeal(row.realStatus, "text") }}
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
              <template #edit="{ row }">
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
                  @click="handleReset(row)"
                  >密码重置</el-button
                >
                <!-- <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-position"
                  @click="handlePermission(row)"
                >
                  数据权限</el-button
                > -->
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  @click="handleDetail(row)"
                  >详情</el-button
                >
              </template>
            </RefactorTable>
            <!-- 分页 -->
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.startIndex"
              :limit.sync="queryParams.pageSize"
              @pagination="driverHttpReq"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <DriverDialog
      :options="{ editType: editType, code: dialogCode }"
      :open="open"
      :title="title"
      :orgList="orgList"
      @colseDialog="colseDialog"
    ></DriverDialog>
    <ResetPwdDialog
      ref="resetPwdDialog"
      :open.sync="resetPwdOpen"
      :title="pwdTitle"
      @refresh="searchQuery"
    />
  </div>
</template>

<script>
import { http_request } from "@/api";
import driverConfig from "./driver_config";
import DriverDialog from "./components/driver_dialog.vue";
import QueryForm from "./components/queryForm.vue";
import ResetPwdDialog from "./components/resetPwdDialog.vue";
export default {
  components: { QueryForm, DriverDialog, ResetPwdDialog },
  data() {
    return {
      showSearch: true, //搜索显隐
      loading: false, //表格load
      exportLoading: false, //到处load
      total: 0, //总条数
      open: false,
      editType: "",
      title: "",
      resetPwdOpen: false,
      pwdTitle: "",
      multiple: true, //是否激活多选删除按钮
      ids: [],
      driverList: [], //表格数据
      queryParams: {
        startIndex: 1,
        pageSize: 10,
        name: null,
        telphone: null,
        enabled: null, //停用状态
        driverStatus: null, //司机状态
        realStatus: null, //实名状态
        dateRange: [], //日期范围
        orgCode: null,
      },
      orgName: "", //组织查询
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      selection: [], // 被勾选表格数据
      codes: [], //删除选择的codes
      enabledList: [],
      driverStatusList: [],
      realStatusList: [],
      orgList: [],
      driverConfig: {},
      orgNmaetable: "",
      dialogCode: null,
    };
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.tableColumnsConfig = driverConfig.tableColumnsConfig;
    this.driverStatusList = driverConfig.driverStatusCongfigArr;
    this.driverConfig = driverConfig;
  },
  mounted() {
    this.getOrgHttp();
    // this.searchQuery();
  },
  methods: {
    //数据处理
    driverStatusDeal(status, type) {
      if (!status) return null;
      return driverConfig.driverStatusCongfig[status][type];
    },
    //实名状态处理
    realStatusDeal(status, type) {
      if (!status && status != 0) return null;
      return driverConfig.realStatusConfig[status][type];
    },
    //新增
    handleAdd() {
      this.title = "新增司机弹窗";
      this.editType = "add";
      this.open = true;
    }, //删除
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      if (obj.driverStatus == "0") {
        this.$confirm("司机正在运输任务中，无法删除。", "警告", {
          cancelButtonText: "取消",
          type: "warning",
        });
        return;
      }
      const ids = [obj.code] || this.ids;
      console.log("this.ids", ids);
      this.$confirm("是否确认删除此项数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const tmp = {
            moduleName: "http_driver",
            method: "post",
            url_alias: "driver_del",
            data: { list: ids },
          };
          http_request(tmp);
        })
        .then(() => {
          this.searchQuery();
          this.msgSuccess("删除成功");
        });
    },
    handleReset(data) {
      this.$refs.resetPwdDialog.reset(data.userCode);
      this.resetPwdOpen = true;
      this.pwdTitle = "密码重置";
    },
    handlePermission(data) {},
    //导入
    handleImport() {},
    //导出
    handleExport() {
      //  this.exportLoading = true;
      // const params = Object.assign({}, this.queryParams);
      // params.pageSize = undefined;
      // params.startIndex = undefined;
      // this.download('/fmsweb/basic/teamEmployee/v1/export', params, `职员信息`);
      // this.exportLoading = false;
    },
    handleUpdate(obj) {
      this.title = "修改司机弹窗";
      this.editType = "update";
      this.open = true;
      console.log("修改司机弹窗 ckc obj ", obj.code);
      this.dialogCode = obj.code;
    },
    handleDetail(obj) {
      this.editType = "detail";
      const code = obj.code;
      this.open = true;
      console.log("司机详情弹窗 ckc obj ", obj.code);
      this.dialogCode = obj.code;
      this.title = "司机详情弹窗";
      console.log("index code", code);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //获取组织树
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
      console.log("orgRes.data[0]", orgRes.data);
      this.queryParams.orgCode = this.orgTreeData[0].code;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.queryParams.orgCode);
      });
      console.log("当前code ckc", this.queryParams.orgCode);
      this.searchQuery();
    },
    //组织树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      console.log(
        "data.orgName.indexOf(value) !== -1",
        data.orgName.indexOf(value) !== -1
      );
      return data.orgName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("data ckc", data);
      this.queryParams.orgCode = data.code;
      this.queryParams.startIndex = 1;
      this.driverHttpReq();
    },
    //发送搜索请求
    searchQuery() {
      this.queryParams.startIndex = 1;
      this.driverHttpReq();
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
          const obj = {
            moduleName: "http_driver",
            method: "put",
            url_alias: "driver_enabled",
            data: {
              driverCode: row.code,
              enabled: row.enabled,
            },
          };
          return http_request(obj);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.enabled = row.enabled === 1 ? 0 : 1;
        });
    },

    //请求分页数据
    async driverHttpReq() {
      console.log("this.queryParams.orgCode", this.queryParams.orgCode);
      this.loading = true;
      const tmp = {
        startIndex: this.queryParams.startIndex,
        pageSize: this.queryParams.pageSize,
        name: this.queryParams.name,
        telphone: this.queryParams.telphone,
        enabled: this.queryParams.enabled, //分组
        driverStatus: this.queryParams.driverStatus || null, //是否停用
        realStatus: this.queryParams.realStatus, //是否停用
        createBeginTime: this.queryParams.dateRange[0] || null,
        createEndTime: this.queryParams.dateRange[1] || null,
        orgCode: this.queryParams.orgCode,
      };
      if (tmp.createBeginTime)
        tmp.createBeginTime = tmp.createBeginTime + " " + "00:00:00";
      if (tmp.createEndTime)
        tmp.createEndTime = tmp.createEndTime + " " + "23:59:59";
      const obj = {
        moduleName: "http_driver",
        method: "post",
        url_alias: "driver_paging",
        data: tmp,
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      console.log("res", res);
      if (res.code == "200") {
        this.driverList = res.data.rows;
        console.log("this.driverList", this.driverList);
        this.total = res.data.total;
        this.loading = false;
      } else {
        console.log("error", res);
        this.loading = false;
      }
    },
    colseDialog(e) {
      console.log("关闭。。。", e);
      this.open = false;
      if (e == "ok") this.searchQuery();
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
</style>