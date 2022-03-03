<template>
  <!-- 角色管理 -->
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="68px"
        @submit.native.prevent
        class="ddc-queryParams"
        label-position="top"
      >
        <div class="ddc-queryParams-left">
          <div class="up">
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="queryParams.roleName"
                placeholder="请输入角色名称"
                clearable
                size="small"
                style="width: 240px"
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
              v-hasPermi="['role:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['employee:delete']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDeleteMultiple"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
          v-loading="loading"
          highlight-current-row
          stripe
          :data="dataList"
          :height="getTableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="center"
            :selectable="checkboxSelectable"
          />
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column
            label="角色名称"
            align="center"
            prop="roleName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="角色描述"
            align="center"
            prop="remark"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="280"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['role:edit']"
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <!-- isSystem 1系统角色 0其他 -->
              <template v-if="scope.row.isSystem !== 1">
                <el-button
                  v-hasPermi="['role:edit']"
                  size="mini"
                  type="text"
                  @click="handleEmployee(scope.row)"
                  >设置职员</el-button
                >
                <el-button
                  v-hasPermi="['role:edit']"
                  size="mini"
                  type="text"
                  @click="handleResource(scope.row)"
                  >功能分配</el-button
                >
                <el-button
                  v-hasPermi="['role:delete']"
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
      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 新增/编辑 -->
    <RoleDialog
      ref="RoleDialog"
      :open.sync="open"
      :title="title"
      :isSystem="isSystem"
      @refresh="getList"
    />
    <!-- 设置职员 -->
    <SettingEmployee
      ref="SettingEmployee"
      :open.sync="employeeOpen"
      :title="title"
      @refresh="getList"
    />
    <!-- 功能分配 -->
    <SettingResource
      ref="SettingResource"
      :open.sync="resourceOpen"
      :title="title"
      @refresh="getList"
    />
  </div>
</template>

<script>
import RoleDialog from "./roleDialog.vue";
import SettingEmployee from "./settingEmployee.vue";
import SettingResource from "./settingResource.vue";
import { http_request } from "@/api";
export default {
  name: "Role",
  components: {
    RoleDialog,
    SettingEmployee,
    SettingResource,
  },
  data() {
    return {
      loading: false,
      // 选中数组
      ids: [],
      roleNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
      },
      // 角色列表数据
      dataList: [],
      total: 0,
      // 弹窗开关
      open: false,
      employeeOpen: false,
      resourceOpen: false,
      // 弹窗标题
      title: "",
      // 是否系统角色
      isSystem: 0,
    };
  },
  computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 380;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 获取角色列表 */
    getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_role",
        method: "post",
        url_alias: "listRole",
        data: this.queryParams,
      };
      http_request(obj).then((res) => {
        this.loading = false;
        this.dataList = res.data.rows;
        this.total = res.data.total;
      });
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.code);
      this.roleNames = selection.map((item) => item.roleName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 添加角色 */
    handleAdd() {
      this.$refs.RoleDialog.reset();
      this.open = true;
      this.title = "添加角色";
      this.isSystem = 0;
    },
    /** 编辑角色 */
    handleUpdate(row) {
      this.$refs.RoleDialog.reset();
      this.isSystem = row.isSystem;
      const obj = {
        moduleName: "http_role",
        method: "get",
        url_alias: "infoRole",
        url_code: [row.code],
      };
      http_request(obj).then((res) => {
        this.open = true;
        this.title = "编辑角色";
        this.$refs.RoleDialog.setForm(res.data);
      });
    },
    /** 设置职员 */
    handleEmployee(row) {
      this.$refs.SettingEmployee.reset();
      this.$refs.SettingEmployee.roleAssignEmployeeInfo(row.code);
      this.employeeOpen = true;
      this.title = "设置职员";
    },
    /** 功能分配 */
    handleResource(row) {
      this.$refs.SettingResource.reset();
      this.$refs.SettingResource.setRoleMenuTreeselect(row.code);
      this.resourceOpen = true;
      this.title = "功能分配";
    },
    /** 删除 */
    handleDelete(row) {
      this.$confirm("删除操作不可恢复，确认要删除该角色吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const obj = {
            moduleName: "http_role",
            method: "delete",
            url_alias: "deleteRole",
            url_code: [row.code],
          };
          return http_request(obj);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 删除多个 */
    handleDeleteMultiple() {
      const _this = this;
      this.$confirm("删除操作不可恢复，确认要删除选中的角色吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const obj = {
            moduleName: "http_role",
            method: "delete",
            url_alias: "deleteRoleList",
            data: {
              codeList: _this.ids,
            },
          };
          return http_request(obj);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 系统角色的checkbox不可选 */
    checkboxSelectable(row) {
      if (row.isSystem !== 1) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>