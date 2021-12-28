<template>
  <div class="dispatch">
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
            <el-form-item label="磅单日期" prop="dateList">
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
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="onSearch('reset')"
            >
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
    <el-tabs v-model="queryParams.type" @tab-click="onClickTab">
      <el-tab-pane label="按企业" name="1" />
      <el-tab-pane label="按路线" name="2" />
      <el-tab-pane label="按车辆" name="3" />
    </el-tabs>
    <div class="dispatch__table">
      <el-button
        class="mb20"
        type="primary"
        :loading="exportLoading"
        @click="onExport"
        >导出</el-button
      >
      <el-table
        v-loading="loading"
        highlight-current-row
        :stripe="true"
        :data="weightList"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="queryParams.type === '1'"
          label="用车企业"
          prop="companyName"
          :key="Math.random()"
        />
        <el-table-column
          v-if="queryParams.type === '1'"
          label="路线数"
          prop="routeCount"
          :key="Math.random()"
        />
        <el-table-column
          v-if="queryParams.type === '2'"
          label="路线名称"
          prop="routeName"
        />
        <el-table-column
          v-if="queryParams.type === '2'"
          label="用车企业数"
          prop="companyCount"
        />
        <el-table-column
          v-if="queryParams.type === '2'"
          label="出发地"
          prop="startRoute"
        />
        <el-table-column
          v-if="queryParams.type === '2'"
          label="目的地"
          prop="endRoute"
        />
        <el-table-column
          v-if="queryParams.type === '3'"
          label="车辆别名"
          prop="vehicleAlias"
        />
        <el-table-column
          v-if="queryParams.type === '3'"
          label="车牌号"
          prop="vehicleNumber"
        />
        <el-table-column label="磅单数" prop="weighbridgeCount" />
        <el-table-column label="结算总额（元）" prop="freightTotal" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onClickDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="onSearch"
      />
    </div>

    <Detail ref="detail" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import Detail from './components/detail.vue'

export default {
  components: {
    Detail
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      weightList: [],
      queryParams: {
        dateList: [new Date(), new Date()],
        type: '1',
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    onReset() {
      this.queryParams = {
        dateList: [new Date(), new Date()],
        type: '1',
        pageNum: 1,
        pageSize: 10
      }
      this.onSearch('reset')
    },
    onClickTab() {
      this.$nextTick(() => {
        this.onSearch('reset')
      })
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
        url_alias: 'pagingWeighbridgeStatistics',
        data: {
          type: this.queryParams.type,
          startDate: this.parseTime(
            this.queryParams.dateList[0],
            '{y}-{m}-{d}'
          ),
          endDate: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}'),
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        }
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.startDateNow = params.data.startDate
          this.endDateNow = params.data.endDate
          this.weightList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onClickDetail(row) {
      row.type = this.queryParams.type
      this.$refs.detail.open(row, this.startDateNow, this.endDateNow)
    },
    // 导出
    onExport() {
      if (!this.queryParams.dateList) {
        this.$message.error('请选择导出日期')
        return
      }
      this.exportLoading = true
      const params = {
        startDate: this.startDateNow,
        endDate: this.endDateNow,
        type: this.queryParams.type
      }
      let fileName = `${params.startDate}至${params.endDate}`
      if (params.type === '1') {
        fileName = fileName + '各用车企业磅单统计报表'
      } else if (params.type === '2') {
        fileName = fileName + '各路线磅单统计报表'
      } else if (params.type === '3') {
        fileName = fileName + '各车辆磅单统计报表'
      }
      this.downloadFileName(
        '/fmsweb/basic/weighbridge/v1/exportWeighbridgeStatistics',
        params,
        fileName
      )
      this.exportLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dispatch {
  background: #fff;
  margin: 0 20px;
  .mb20 {
    margin-bottom: 20px;
  }
  &__searchBar {
    padding-top: 20px;
  }
  &__table {
    padding: 0 20px 20px 20px;
  }
}

::v-deep .el-tabs__nav-scroll {
  padding: 0 20px;
}
</style>
