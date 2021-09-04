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
              :current-node-key="orgCode"
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
          <div class="device-info-right-top">
            <!-- 上：搜索 -->
            <QueryForm
              v-model="queryParams"
              :stopStatusList="stopStatusList"
              :taskStatusList="taskStatusList"
              :realStatusList="realStatusList"
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
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-position"
                  @click="handlePermission(row)"
                >
                  数据权限</el-button
                >
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
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="driverHttpReq"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <DriverDialog
      :options="{ editType: editType, code: currCode }"
      :open="open"
      :title="title"
      :orgList ="orgList"
      @colseDialog="colseDialog"
    ></DriverDialog>
  </div>
</template>

<script>
import { http_request } from "@/api";
import driverConfig from "./driver_config";
import DriverDialog from "./components/driver_dialog.vue";
import QueryForm from "./components/queryForm.vue";
export default {
  components: { QueryForm, DriverDialog },
  data() {
    return {
      showSearch: true, //搜索显隐
      loading: false, //表格load
      exportLoading: false, //到处load
      total: 0, //总条数
      open: false,
      editType: "",
      title: "",
      multiple: true, //是否激活多选删除按钮
      ids: [],
      driverList: [], //表格数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        telphone: "",
        stopStatus: "",
        taskStatus: "",
        realStatus: "",
        dateRange: [], //日期范围
      },
      currCode: null, //当前选中的currCode

      orgName: "", //组织查询
      orgCode: null, // 当前选中的类型
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      selection: [], // 被勾选表格数据
      codes: [], //删除选择的codes
      stopStatusList: [],
      taskStatusList: [],
      realStatusList: [],
      orgList:[]
    };
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.tableColumnsConfig = driverConfig.tableColumnsConfig;
  },
  mounted() {
    this.getOrgHttp();
    this.searchQuery();
  },
  methods: {
    //新增
    handleAdd() {
      this.title = "新增司机弹窗";
      this.editType = "add";
      this.open = true;
    }, //删除
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      const ids = obj.code || this.ids;
      console.log("this.ids", ids);
      console.log("暂未开通, 等待接口");
      return;
    },
    handleReset(data) {},
    handlePermission(data) {},
    //导入
    handleImport() {},
    //导出
    handleExport() {},
    handleUpdate(obj) {
      this.title = "修改司机弹窗";
      this.editType = "update";
      this.open = true;
      this.currCode = obj.code;
    },
    handleDetail(obj) {
      this.editType = "detail";
      const code = obj.code;
      console.log("index code", code);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    async getOrgHttp() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      if (this.orgName) obj.data = { orgName: this.orgName };
      const orgRes = await http_request(obj);
      console.log("orgRes res", orgRes);
      this.orgTreeData =
        orgRes.data.length > 0 ? orgRes.data[0].childrenOrgList : [];
      this.currCode = this.orgTreeData[0].code;
      console.log("当前code", this.currCode);
      //     this.searchQuery();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("data", data);
      this.orgCode = data.code;
      this.queryParams.pageNum = 1;
      this.driverHttpReq();
    },
    //发送搜索请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.driverHttpReq();
    },
    //请求分页数据
    async driverHttpReq() {
      this.loading = true;
      const obj = {
        moduleName: "http_driver",
        method: "post",
        url_alias: "driver_paging",
        data: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          name: this.queryParams.name || null,
          telphone: this.queryParams.telphone || null,
          stopStatus: this.queryParams.stopStatus || null, //分组
          taskStatus: this.queryParams.taskStatus, //是否停用
          realStatus: this.queryParams.realStatus, //是否停用
          createBeginTime: this.queryParams.dateRange[0] || null,
          createEndTime: this.queryParams.dateRange[1] || null,
        },
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      console.log("res", res);
      if (res.code == "200") {
        this.driverList = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
      } else {
        console.log("error", res);
        this.loading = false;
      }
    },
    colseDialog() {
      console.log("关闭。。。");
      this.open = false;
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