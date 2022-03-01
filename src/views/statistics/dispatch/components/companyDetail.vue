<template>
  <div class="companyDetail">
    <el-drawer
      :title="companyName"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :before-close="onClose"
    >
      <div class="companyDetail__wrapper">
        <div class="companyDetail__date">{{ startDate }} 至 {{ endDate }}</div>
        <el-button class="mtb20" type="primary" :loading="exportLoading" @click="onExport">
          导出
        </el-button>
        <div class="table">
          <el-table v-loading="loading" highlight-current-row :stripe="true" :data="companyList">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调度单来源" prop="source">
              <template slot-scope="scope">
                <span v-show="scope.row.source === 'chy'">超好运</span>
                <span v-show="scope.row.source === 'zj'">自建</span>
              </template>
            </el-table-column>
            <el-table-column label="货品类型" prop="title" />
            <el-table-column label="出发地" prop="loadFormattedAddress" />
            <el-table-column label="目的地" prop="unloadFormattedAddress" />
            <el-table-column label="趟次" prop="tripsTotal" />
            <el-table-column label="净重（吨）" prop="netWeightTotal" />
            <el-table-column label="总收入（元）" prop="sumIncomeTotal" />
            <el-table-column label="已收（元）" prop="incomeTotal" />
            <el-table-column label="未收（元）" prop="stayIncomeTotal" />
            <el-table-column label="应付运费（元）" prop="payTotal" />
            <el-table-column label="净收入（元）" prop="netIncomeTotal" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onClickDetail(scope.row)"> 详情 </el-button>
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
      </div>
    </el-drawer>

    <OrderDetail ref="orderDetail" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import OrderDetail from './orderDetail.vue'

export default {
  components: {
    OrderDetail,
  },
  data() {
    return {
      drawer: false,
      companyName: '',
      startDate: '',
      endDate: '',
      loading: false,
      exportLoading: false,
      companyList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    }
  },
  mounted() {},
  methods: {
    open(data, startDate, endDate) {
      this.startDate = startDate
      this.endDate = endDate
      this.companyName = data.companyName
      this.drawer = true
      this.onSearch()
    },
    onClose() {
      this.drawer = false
    },
    onSearch() {
      console.log('1321313')
      const params = {
        moduleName: 'http_statistic',
        method: 'get',
        url_alias: 'pagingDispatchOrderByCompanyName',
        data: {
          ...this.queryParams,
          companyName: this.companyName,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.companyList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onClickDetail(row) {
      row.companyName = this.companyName
      this.$refs.orderDetail.open(row, this.startDate, this.endDate)
    },
    // 导出
    onExport() {
      this.exportLoading = true
      const params = {
        startDate: this.startDate,
        endDate: this.endDate,
        companyName: this.companyName,
      }
      this.downloadFileName(
        '/fmsweb/basic/dispatch/v1/exportDispatchOrderByCompanyName',
        params,
        `${params.startDate}至${params.endDate}${this.companyName}运输统计报表`
      )
      this.exportLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.companyDetail {
  &__wrapper {
    padding: 0 16px;
  }
  .mtb20 {
    margin: 20px 0;
  }
  &__date {
    font-size: 16px;
    color: #3d4050;
  }
}
</style>
