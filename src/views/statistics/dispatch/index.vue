<template>
  <div class="pages-info  none-org-tree">
     <div class="pages-info-right">
    <div class="dispatch__searchBar">
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
            <el-form-item label="用车企业">
              <el-input
                v-model="queryParams.companyName"
                placeholder="请选择用车企业"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
            <el-form-item label="日期" prop="dateList">
              <el-date-picker
                v-model="queryParams.dateList"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                size="small"
                @keyup.enter.native="onSearch"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="ddc-queryParams-right">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch('reset')">
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
    </div>
    <div class="dispatch__table">
      <el-button class="mb20" type="primary"
       v-hasPermi="['statistics:dispatch:export']"
       :loading="exportLoading" @click="onExport"
        >导出</el-button
      >
      <el-table v-loading="loading" 
      highlight-current-row 
      :stripe="true" 
      :height="getTableHeight"
      :data="vehicleList">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用车企业" prop="companyName" />
        <el-table-column label="调度单数" prop="dispatchOrderTotal" />
        <el-table-column label="承运趟次" prop="tripsTotal" />
        <el-table-column label="承运净重（吨）" prop="netWeightTotal" />
        <el-table-column label="总收入（元）" prop="sumIncomeTotal" />
        <el-table-column label="已收（元）" prop="incomeTotal" />
        <el-table-column label="待收（元）" prop="stayIncomeTotal" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text"
            v-hasPermi="['statistics:dispatch:detail']"
             @click="onClickDetail(scope.row)"> 详情 </el-button>
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
        @pagination="onSearch"
      />
    <CompanyDetail ref="companyDetail" />
     </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import CompanyDetail from './components/companyDetail.vue'

export default {
  components: {
    CompanyDetail,
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      vehicleList: [],
      queryParams: {
        companyName: '',
        dateList: [this.parseTime(new Date(), '{y}-{m}') + '-01', new Date()],
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    }
  },
  created() {
    this.onSearch()
  },
    computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 410;
    },
  },
  methods: {
    onReset() {
      this.queryParams = {
        companyName: '',
        dateList: [this.parseTime(new Date(), '{y}-{m}') + '-01', new Date()],
        pageNum: 1,
        pageSize: 10,
      }
      this.onSearch('reset')
    },
    onSearch(which) {
      if (!this.queryParams.dateList) {
        this.$message.error('请选择查询日期')
        return
      }
      if (which === 'reset') {
        this.queryParams.pageNum = 1
      }
      const params = {
        moduleName: 'http_statistic',
        method: 'get',
        url_alias: 'pagingFirstDispatchOrder',
        data: {
          companyName: this.queryParams.companyName,
          startDate: this.parseTime(this.queryParams.dateList[0], '{y}-{m}-{d}'),
          endDate: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}'),
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
        },
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.startDateNow = params.data.startDate
          this.endDateNow = params.data.endDate
          this.companyNameNow = params.data.companyName
          this.vehicleList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onClickDetail(row) {
      this.$refs.companyDetail.open(row, this.startDateNow, this.endDateNow)
    },
    // 导出
    onExport() {
      if (!this.queryParams.dateList) {
        this.$message.error('请选择导出日期')
        return
      }
      this.exportLoading = true
      const params = {
        companyName: this.companyNameNow,
        startDate: this.startDateNow,
        endDate: this.endDateNow,
      }
      this.downloadFileName(
        '/fmsweb/basic/dispatch/v1/exportFirstDispatchOrder',
        params,
        `${params.startDate}至${params.endDate}整体运输情况报表`
      )
      this.exportLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
  .mb20 {
    margin-bottom: 20px;
  }
  .dispatch__searchBar {
    padding-top: 20px;
    border-bottom: 1px solid #e4ecf4;
  }
  .dispatch__table {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
