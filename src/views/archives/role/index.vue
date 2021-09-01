<template>
  <!-- 角色管理 -->
  <div>
    <div class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
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
            v-hasPermi="['role:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" highlight-current-row border :data="dataList">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="角色名称" align="center" prop="roleName" :show-overflow-tooltip="true" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime">
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
              @click="handleEmployee(scope.row)"
            >设置职员</el-button>
            <el-button
              v-hasPermi="['role:edit']"
              size="mini"
              type="text"
              @click="handleResource(scope.row)"
            >设置资源</el-button>
            <el-button
              v-hasPermi="['role:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDisable(scope.row)"
            >禁用</el-button>
            <el-button
              v-hasPermi="['role:delete']"
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

    <!-- 新增/编辑 -->
    <RoleDialog :open.sync="open" :title="title" @refresh="getList" />
    <!-- 设置职员 -->
    <SettingEmployee :open.sync="employeeOpen" :title="title" @refresh="getList" />
    <!-- 设置资源 -->
    <SettingResource :open.sync="resourceOpen" :title="title" @refresh="getList" />
  </div>
</template>

<script>
import RoleDialog from './roleDialog.vue';
import SettingEmployee from './settingEmployee.vue';
import SettingResource from './settingResource.vue';
import { http_request } from '@/api';
export default {
  name: 'Role',
  components: {
    RoleDialog,
    SettingEmployee,
    SettingResource
  },
  data() {
    return {
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined
      },
      // 角色列表数据
      dataList: [{}],
      total: 0,
      // 弹窗开关
      open: false,
      employeeOpen: false,
      resourceOpen: false,
      // 弹窗标题
      title: ''
    }
  },
  created() {

  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 获取角色列表 */
    getList() {
      const obj = {
        moduleName: 'http_role',
        method: 'post',
        url_alias: 'listRole',
        data: this.queryParams
      }
      http_request(obj).then(res => {
        console.log(res)
      });
    },
    /** 添加角色 */
    handleAdd() {
      // this.$refs.employeeDialog.reset();
      this.open = true;
      this.title = '添加角色';
    },
    /** 编辑角色 */
    handleUpdate(row) {
      // this.$refs.employeeDialog.reset();
      this.open = true;
      this.title = '编辑角色';
    },
    /** 设置职员 */
    handleEmployee(row) {
      this.employeeOpen = true;
      this.title = '设置职员';
    },
    /** 设置资源 */
    handleResource(row) {
      this.resourceOpen = true;
      this.title = '设置资源';
    },
    /** 禁用 */
    handleDisable(row) {
      this.$confirm('是否确认禁用"' + row.nickName + '"角色?', '警告', {
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
    /** 删除 */
    handleDelete(row) {
      this.$confirm('是否确认删除"' + row.nickName + '"角色?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        //
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