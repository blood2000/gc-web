<template>
  <!-- 职员管理 -->
  <div>
    <el-row>
      <!-- 组织树 -->
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
          <div class="head-container">
            <el-input
              v-model="deptName"
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
        <div class="app-container app-container--search">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="职员姓名" prop="nickNameOrPhonenumber">
              <el-input
                v-model="queryParams.nickNameOrPhonenumber"
                placeholder="请输入姓名/手机号"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
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
              >添加职员</el-button>
            </el-col>
          </el-row>
          <el-table v-loading="loading" highlight-current-row border :data="dataList">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="姓名" align="center" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="手机号" align="center" prop="phonenumber" :show-overflow-tooltip="true" />
            <el-table-column label="所属组织" align="center" prop="orgName" :show-overflow-tooltip="true" />
            <el-table-column label="所属角色" align="center" prop="roleNames" :show-overflow-tooltip="true" />
            <!-- 0 禁用 1 启用 -->
            <el-table-column label="账号状态" align="center" prop="employeeStatus" />
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
                >编辑</el-button>
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
                <!-- v-hasPermi="['employee:disable']" -->
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDisable(scope.row)"
                >禁用</el-button>
                <!-- v-hasPermi="['employee:reset']" -->
                <el-button
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
  </div>
</template>

<script> 
import EmployeeDialog from './employeeDialog.vue';
import { http_request } from '@/api';
export default {
  name: 'Employee',
  components: {
    EmployeeDialog
  },
  data() {
    return {
      loading: false,
      // 部门名称
      deptName: undefined,
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
        nickNameOrPhonenumber: undefined
      },
      // 职员列表数据
      dataList: [],
      total: 0,
      // 弹窗开关
      open: false,
      roleOpen: false,
      orgOpen: false,
      // 弹窗标题
      title: '',
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
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
      return data.label.indexOf(value) !== -1;
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
      this.resetForm('queryForm');
      this.queryParams.orgCode = undefined;
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
    /** 禁用 */
    handleDisable(row) {
      this.$confirm('是否确认禁用"' + row.nickName + '"的账号?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        //
      }).then(() => {
        this.getList();
        this.msgSuccess('禁用成功');
      });
    },
    /** 重置密码 */
    handleResetPwd(row) {
      this.$confirm('是否确认重置"' + row.nickName + '"的账号密码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        const obj = {
          moduleName: 'http_employee',
          method: 'put',
          url_alias: 'resetPassword',
          data: {
            employeeCode: row.employeeCode
          }
        }
        return http_request(obj);
      }).then(() => {
        this.getList();
        this.msgSuccess('重置密码成功');
      });
    },
    /** 删除 */
    handleDelete(row) {
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
    }
    
  }
}
</script>

<style lang="scss" scoped>

</style>