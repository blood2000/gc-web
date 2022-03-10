<template>
  <!-- 组织管理 -->
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        @submit.native.prevent
        class="ddc-queryParams"
        label-position="top"
      >
        <div class="ddc-queryParams-left">
          <div class="up">
            <el-form-item label="组织名称" prop="orgName">
              <el-input
                v-model="queryParams.orgName"
                placeholder="请输入组织名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </div>
        </div>
        <div class="ddc-queryParams-right">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              size="mini"
              class="ddc-queryParams-right-reset"
              @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <el-row :gutter="10" class="toolsbar">
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['archives:org:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"

              >新增</el-button
            >
          </el-col>
          <!-- <right-toolbar :show-search.sync="showSearch" @queryTable="getList" /> -->
        </el-row>

        <el-table
          v-loading="loading"
          :data="dataList"
          row-key="id"
          highlight-current-row
          stripe
          default-expand-all
           :height="getTableHeight"
          :tree-props="{
            children: 'childrenOrgList',
            hasChildren: 'hasChildren',
          }"
        >
          <el-table-column prop="orgName" label="组织名称" />
          <el-table-column prop="orderNum" align="center" label="排序" />
          <el-table-column prop="createTime" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['archives:org:add']"
                size="mini"
                type="text"
                @click="handleAdd(scope.row)"
                >新增</el-button
              >
              <template v-if="scope.row.parentId !== 0">
                <el-button
                  v-hasPermi="['archives:org:edit']"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                  >修改</el-button
                >
                <el-button
                  v-hasPermi="['archives:org:del']"
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <OrgDialog
      ref="OrgDialog"
      :open.sync="open"
      :title="title"
      @refresh="getList"
    />
  </div>
</template>

<script>
import OrgDialog from "./orgDialog.vue";
import { http_request } from "@/api";
export default {
  name: "Org",
  components: {
    OrgDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        orgName: undefined,
      },
      // 列表数据
      dataList: [],
      // 弹窗开关
      open: false,
      // 弹窗标题
      title: "",
    };
  },
  created() {
    this.getList();
  },
   computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 350;
    },
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
        data: this.queryParams,
      };
      http_request(obj).then((res) => {
        this.loading = false;
        this.dataList = res.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.$refs.OrgDialog.reset(row.id);
      this.open = true;
      this.title = "添加组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.OrgDialog.reset();
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "infoOrg",
        url_code: [row.code],
      };
      http_request(obj).then((res) => {
        this.open = true;
        this.title = "编辑组织";
        this.$refs.OrgDialog.setForm(res.data);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("删除操作不可恢复，确认要删除该组织吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const obj = {
            moduleName: "http_org",
            method: "delete",
            url_alias: "deleteOrg",
            url_code: [row.code],
          };
          return http_request(obj);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>