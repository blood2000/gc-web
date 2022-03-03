<template>
  <div class="pages-info">
    <div class="pages-info-left">
      <div class="head-container">
        <el-input
          v-model="filterText"
          placeholder="请输入搜索关键字"
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
          highlight-current
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
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="68px"
        class="ddc-queryParams"
        label-position="top"
      >
        <div class="ddc-queryParams-left">
          <div class="up">
            <el-form-item label="车队长姓名" prop="nickNameOrPhonenumber">
              <el-input
                v-model="queryParams.nickNameOrPhonenumber"
                placeholder="请输入车队长姓名/联系方式"
                clearable
                size="small"
                style="width: 220px"
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
            <el-form-item label="钱包开通状态" prop="authStatus">
              <el-select
                v-model="queryParams.authStatus"
                clearable
                filterable
                size="small"
                style="width: 220px"
              >
                <el-option
                  v-for="item in authStatusOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="ddc-queryParams-right">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">
              搜索
            </el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              size="mini"
              class="ddc-queryParams-right-reset"
              @click="onReset"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <el-button @click="onAddCaptain" class="mb20" type="primary">添加车队长</el-button>
        <el-table v-loading="loading"
         highlight-current-row :stripe="true" :data="captainList"
        :height="getTableHeight">
          <el-table-column label="车队长姓名（电话）" prop="nickName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ `${scope.row.nickName}（${scope.row.phonenumber}）` }}
            </template>
          </el-table-column>
          <el-table-column label="钱包开通状态" prop="phonenumber" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="captain-icon">
                <div class="icon" :class="'icon' + scope.row.authStatus" />
                <span :class="'captain-label' + scope.row.authStatus">
                  {{ authStatusLabel[scope.row.authStatus] }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属组织" prop="orgName" :show-overflow-tooltip="true" />
          <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" />
          <el-table-column label="备注信息" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="onClickDetail(scope.row.teamLeaderCode)">
                详情
              </el-button>
              <el-button size="mini" type="text" @click="onClickEdit(scope.row.teamLeaderCode)">
                编辑
              </el-button>
              <el-button size="mini" type="text" @click="onClickDel(scope.row.teamLeaderCode)">
                删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="onClickOpenWallet(scope.row.teamLeaderCode)"
                v-show="scope.row.authStatus === 0"
              >
                申请开通钱包
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="onClickChangeWallet(scope.row.teamLeaderCode)"
                v-show="scope.row.authStatus === 2"
              >
                修改申请信息
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="onClickViewWallet(scope.row.teamLeaderCode)"
                v-show="scope.row.authStatus === 1 || scope.row.authStatus === 3"
              >
                查看申请信息
              </el-button>
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
        @pagination="getPageCarCaptain"
      />
    </div>

    <AddCaptain ref="addCaptain" @onEvent="getPageCarCaptain('reset')" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import AddCaptain from './components/addCaptain.vue'

export default {
  name: 'carCaptain',
  components: {
    AddCaptain,
  },
  data() {
    return {
      filterText: '',
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: 'childrenOrgList',
        label: 'orgName',
      },
      loading: false,
      queryParams: {
        orgCode: '',
        nickNameOrPhonenumber: '', // 姓名或手机号
        authStatus: '', // 钱包开通状态（0未申请/1待审核/2审核未通过/3审核通过）
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      authStatusLabel: ['未开通', '审核中', '审核失败', '已开通'],
      authStatusOptions: [
        {
          value: '',
          label: '全部',
        },
        {
          value: 0,
          label: '未开通',
        },
        {
          value: 1,
          label: '审核中',
        },
        {
          value: 2,
          label: '审核失败',
        },
        {
          value: 3,
          label: '已开通',
        },
      ],
      captainList: [],
    }
  },
  created() {
    this.getCompanyTree()
    this.getPageCarCaptain()
  },
    computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 400;
    },
  },
  methods: {
    // 获取组织树
    getCompanyTree() {
      const obj = {
        moduleName: 'http_org',
        method: 'get',
        url_alias: 'orgTree',
      }
      http_request(obj).then((res) => {
        this.deptOptions = res.data
        this.queryParams.orgCode = this.deptOptions[0].code
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.queryParams.orgCode)
          this.getPageCarCaptain('reset')
        })
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.pageNum = 1
      this.queryParams.orgCode = data.code
      this.getPageCarCaptain('reset')
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // 搜索
    onSearch() {
      this.getPageCarCaptain('reset')
    },
    // 重置
    onReset() {
      this.resetForm('queryForm')
      this.getPageCarCaptain('reset')
    },
    // 点击新增车队长
    onAddCaptain() {
      this.$refs.addCaptain.open('add')
    },
    // 获取车队长分页
    getPageCarCaptain(which) {
      if (which === 'reset') {
        this.queryParams.pageNum = 1
      }
      const obj = {
        moduleName: 'http_carCaptain',
        method: 'post',
        url_alias: 'pageCarCaptain',
        data: this.queryParams,
      }
      this.loading = true
      http_request(obj).then((res) => {
        if (res.data) {
          this.captainList = res.data.rows
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    // 点击详情
    onClickDetail(teamLeaderCode) {
      this.$refs.addCaptain.open('detail', teamLeaderCode)
    },
    // 点击编辑
    onClickEdit(teamLeaderCode) {
      this.$refs.addCaptain.open('update', teamLeaderCode)
    },
    onClickDel(teamLeaderCode) {
      this.$confirm('删除操作不可恢复，确认要删除该车队长吗？', '确认要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._delCaptain(teamLeaderCode)
        })
        .catch(() => {})
    },
    _delCaptain(teamLeaderCode) {
      const obj = {
        moduleName: 'http_carCaptain',
        method: 'delete',
        url_alias: 'delCaptain',
        url_code: [teamLeaderCode],
      }
      http_request(obj).then((res) => {
        this.$message.success(res.msg)
        this.getPageCarCaptain('reset')
      })
    },
    // 点击申请开通钱包
    onClickOpenWallet(teamLeaderCode) {
      this.$refs.addCaptain.open('openWallet', teamLeaderCode)
    },
    // 点击修改申请信息
    onClickChangeWallet(teamLeaderCode) {
      this.$refs.addCaptain.open('changeWallet', teamLeaderCode)
    },
    // 查看申请信息
    onClickViewWallet(teamLeaderCode) {
      this.$refs.addCaptain.open('viewWallet', teamLeaderCode)
    },
  },
  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
}
</script>

<style lang="scss" scoped>
.captain-icon {
  display: flex;
  .icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    background-size: 100% 100%;
    background-repeat: repeat;
    margin: 2px 5px 0 0;
    &.icon0 {
      background-image: url('~@/assets/images/icon/icon-captain-auth0.png');
    }
    &.icon1 {
      background-image: url('~@/assets/images/icon/icon-captain-auth1.png');
    }
    &.icon2 {
      background-image: url('~@/assets/images/icon/icon-captain-auth2.png');
    }
    &.icon3 {
      background-image: url('~@/assets/images/icon/icon-captain-auth3.png');
    }
  }
  .captain-label0 {
    color: #b3b3b3;
  }
  .captain-label1 {
    color: #ffbc00;
  }
  .captain-label2 {
    color: #ef6969;
  }
  .captain-label3 {
    color: #43b91e;
  }
}
</style>
