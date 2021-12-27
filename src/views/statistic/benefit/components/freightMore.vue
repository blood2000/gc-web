<template>
  <div class="freightMore">
    <el-button @click="open" type="text">查看更多</el-button>

    <el-drawer
      title="运费统计"
      :visible.sync="drawer"
      direction="rtl"
      size="60%"
      :before-close="onClose"
    >
      <div class="searchBar">
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
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="onSearch('reset')"
              >
                搜索
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="table">
        <div class="wrapper">
          <div class="box">
            <div class="title">待收款单数</div>
            <div class="value">
              <span>{{ freight.notRevenueCount }}</span>
              单
            </div>
            <img
              src="@/assets/images/statistic/icon_notRevenueCount.png"
              alt=""
            />
          </div>
          <div class="box">
            <div class="title">待收款金额</div>
            <div class="value">
              <span>{{ freight.notRevenue }}</span>
              元
            </div>
            <img src="@/assets/images/statistic/icon_notRevenue.png" alt="" />
          </div>
          <div class="box">
            <div class="title">已收款单数</div>
            <div class="value">
              <span>{{ freight.revenueCount }}</span>
              单
            </div>
            <img src="@/assets/images/statistic/icon_revenueCount.png" alt="" />
          </div>
          <div class="box">
            <div class="title">已收款金额</div>
            <div class="value">
              <span>{{ freight.revenue }}</span>
              元
            </div>
            <img src="@/assets/images/statistic/icon_revenue.png" alt="" />
          </div>
        </div>
        <el-table
          v-loading="loading"
          highlight-current-row
          :stripe="true"
          :data="freight.list"
        >
          <el-table-column label="日期" prop="date" width="130" />
          <el-table-column label="待收款单数" prop="notRevenueCount" />
          <el-table-column label="待收款金额" prop="notRevenue" />
          <el-table-column label="已收款单数" prop="revenueCount" />
          <el-table-column label="已收款金额" prop="revenue" />
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
    </el-drawer>
  </div>
</template>

<script>
import { http_request } from '@/api'

export default {
  props: {
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawer: false,
      loading: false,
      freight: {
        notRevenueCount: 0, // 待收款单数
        notRevenue: 0, // 待收款金额
        revenueCount: 0, // 已收款单数
        revenue: 0, // 已收款金额
        list: [
          // {
          //   date: '', // 日期
          //   notRevenueCount: 0, // 待收款单数
          //   notRevenue: 0, // 待收款金额
          //   revenueCount: 0, // 已收款单数
          //   revenue: 0 // 已收款金额
          // }
        ]
      },
      queryParams: {
        dateList: [new Date(), new Date()],
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  mounted() {},
  methods: {
    open() {
      this.drawer = true
      this.onSearch('reset')
    },
    onClose() {
      this.drawer = false
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
        url_alias: 'freightStatistics',
        data: {
          ...this.queryParams,
          startDate: this.parseTime(
            this.queryParams.dateList[0],
            '{y}-{m}-{d}'
          ),
          endDate: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}')
        }
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          res.data.list = res.data.list || []
          this.freight = res.data
        }
        this.loading = false
      })
    }
  },
  watch: {
    startDate() {
      this.queryParams.dateList.splice(0, 1, this.startDate)
    },
    endDate() {
      this.queryParams.dateList.splice(1, 1, this.endDate)
    }
  }
}
</script>

<style lang="scss" scoped>
.freightMore {
  .searchBar {
    margin-top: 20px;
    border-bottom: 1px solid #e4ecf4;
  }
  .table {
    padding: 25px 30px;
    .wrapper {
      margin-bottom: 20px;
      display: flex;
      .box {
        width: 172px;
        height: 72px;
        background: #f7f7f7;
        border-radius: 4px;
        padding: 10px 15px;
        margin-right: 24px;
        font-size: 14px;
        color: #7e7f81;
        position: relative;
        .value {
          span {
            font-size: 26px;
            font-weight: bold;
            color: #3d4050;
          }
        }
        img {
          width: 28px;
          height: 28px;
          position: absolute;
          top: 8px;
          right: 12px;
        }
      }
    }
  }
}
</style>
