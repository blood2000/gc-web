<template>
  <!-- 职员管理 -->
  <div>
    <el-row>
      <!-- 组织树 -->
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
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
          <div class="head-container">
            <el-tree
              ref="tree"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :indent="0"
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
      <!-- 职员数据 -->
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div v-show="showSearch" class="app-container app-container--search">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="姓名" prop="nickName">
              <el-input
                v-model="queryParams.nickName"
                placeholder="请输入姓名"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="创建日期" prop="employeeStatus">
              <el-date-picker
                v-model="queryParams.startTime"
                clearable
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 140px"
                placeholder="请选择"
              />
              至
              <el-date-picker
                v-model="queryParams.endTime"
                clearable
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 140px"
                placeholder="请选择"
              />
            </el-form-item>
            <el-form-item label="使用状态" prop="employeeStatus">
              <el-select
                v-model="queryParams.employeeStatus"
                clearable
                filterable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in employeeStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="app-container">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['employee:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['employee:delete']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['employee:export']"
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出</el-button>
            </el-col>
            <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
          </el-row>
          <el-table v-loading="loading" highlight-current-row border :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="姓名" align="center" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="手机号" align="center" prop="phonenumber" :show-overflow-tooltip="true" />
            <el-table-column label="所属组织" align="center" prop="orgName" :show-overflow-tooltip="true" />
            <el-table-column label="所属角色" align="center" prop="roleNames" :show-overflow-tooltip="true" />
            <!-- 0 禁用 1 启用 -->
            <el-table-column label="账号状态" align="center" prop="employeeStatus">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.employeeStatus"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="200"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-hasPermi="['employee:edit']"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <!-- <el-button
                  v-hasPermi="['employee:rel:role']"
                  size="mini"
                  type="text"
                  @click="handleRole(scope.row)"
                >授予角色</el-button>
                <el-button
                  v-hasPermi="['employee:rel:org']"
                  size="mini"
                  type="text"
                  @click="handleOrg(scope.row)"
                >调整组织</el-button> -->
                <el-button
                  v-hasPermi="['employee:reset']"
                  size="mini"
                  type="text"
                  @click="handleResetPwd(scope.row)"
                >重置密码</el-button>
                <el-button
                  v-hasPermi="['employee:delete']"
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 新增/编辑 -->
    <EmployeeDialog ref="employeeDialog" :open.sync="open" :title="title" @refresh="getList" />
    <!-- 重置密码 -->
    <ResetPwdDialog ref="resetPwdDialog" :open.sync="resetPwdOpen" :title="title" @refresh="getList" />
  </div>
</template>

<script> 
import EmployeeDialog from './employeeDialog.vue';
import ResetPwdDialog from './resetPwdDialog.vue';
import { http_request } from '@/api';
export default {
  name: 'Employee',
  components: {
    EmployeeDialog,
    ResetPwdDialog
  },
  data() {
    return {
      loading: false,
      // 选中数组
      ids: [],
      nickNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 部门名称
      orgName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: 'childrenOrgList',
        label: 'orgName'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgCode: undefined,
        nickName: undefined,
        phonenumber: undefined,
        employeeStatus: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 职员列表数据
      dataList: [],
      total: 0,
      // 弹窗开关
      open: false,
      roleOpen: false,
      orgOpen: false,
      resetPwdOpen: false,
      // 弹窗标题
      title: '',
      // 字典
      employeeStatusOptions: [
        { dictLabel: '禁用', dictValue: 0 },
        { dictLabel: '启用', dictValue: 1 }
      ]
    }
  },
  watch: {
    // 根据名称筛选部门树
    orgName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTree();
    this.getList();
  },
  methods: {
    /** 获取组织树 */
    getTree() {
      const obj = {
        moduleName: 'http_org',
        method: 'get',
        url_alias: 'orgTree'
      }
      http_request(obj).then(res => {
        this.deptOptions = res.data;
      });
    },
    /** 筛选节点 */
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    /** 节点单击事件 */
    handleNodeClick(data) {
      this.queryParams.orgCode = data.code;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.orgCode = undefined;
      this.queryParams.startTime = undefined;
      this.queryParams.endTime = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 获取职员列表 */
    getList() {
      this.loading = true;
      const obj = {
        moduleName: 'http_employee',
        method: 'post',
        url_alias: 'listEmployee',
        data: this.queryParams
      }
      http_request(obj).then(res => {
        this.loading = false;
        this.dataList = res.data.rows;
        this.total = res.data.total;
      });
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.employeeCode);
      this.nickNames = selection.map(item => item.nickName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 添加职员 */
    handleAdd() {
      this.$refs.employeeDialog.reset();
      this.open = true;
      this.title = '添加职员';
    },
    /** 编辑职员 */
    handleUpdate(row) {
      this.$refs.employeeDialog.reset();
      const obj = {
        moduleName: 'http_employee',
        method: 'get',
        url_alias: 'infoEmployee',
        url_code: [row.employeeCode]
      }
      http_request(obj).then(res => {
        this.open = true;
        this.title = '编辑职员';
        this.$refs.employeeDialog.setForm(res.data)
      });
    },
    /** 授予角色 */
    handleRole(row) {
      this.roleOpen = true;
      this.title = '授予角色';
    },
    /** 调整组织 */
    handleOrg(row) {
      this.orgOpen = true;
      this.title = '调整组织';
    },
    /** 用户状态修改 */
    handleStatusChange(row) {
      const text = row.employeeStatus === '0' ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.nickName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        const obj = {
          moduleName: 'http_employee',
          method: 'put',
          url_alias: 'changeEmployeeStatus',
          data: {
            employeeCode: row.employeeCode,
            employeeStatus: row.employeeStatus === '0' ? '1' : '0'
          }
        }
        return http_request(obj);
      }).then(() => {
        this.msgSuccess(text + '成功');
      }).catch(function() {
        row.employeeStatus = row.employeeStatus === '0' ? '1' : '0';
      });
    },
    /** 重置密码 */
    handleResetPwd(row) {
      this.$refs.resetPwdDialog.reset(row.employeeCode);
      this.resetPwdOpen = true;
      this.title = `请输入"${row.nickName}"的新密码`;
    },
    /** 删除 */
    handleDelete(row) {
      const ids = row.employeeCode || this.ids;
      const nickNames = row.nickName || this.nickNames;
      this.$confirm('是否确认删除"' + row.nickName + '"的账号?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        const obj = {
          moduleName: 'http_employee',
          method: 'delete',
          url_alias: 'deleteEmployee',
          url_code: [row.employeeCode]
        }
        return http_request(obj);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('', params, `用户信息`);
    },
    
  }
}
</script>

<style lang="scss" scoped>

</style>