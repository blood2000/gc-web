<template>
  <div class="driverSingle">
    <el-drawer
      :title="title"
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
              <el-form-item label="日期">
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
                @click="onSearch"
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
            <div class="title">已接单</div>
            <div class="value">
              <span>{{ driver.orderReceived }}</span>
              单
            </div>
            <img src="@/assets/images/statistics/icon_revenueCount.png" alt="" />
          </div>
          <div class="box">
            <div class="title">已回车</div>
            <div class="value">
              <span>{{ driver.pressEnter }}</span>
              车
            </div>
            <img src="@/assets/images/statistics/icon_loadCount.png" alt="" />
          </div>
          <div class="box">
            <div class="title">运费</div>
            <div class="value">
              <span>{{ driver.freight }}</span>
              元
            </div>
            <img
              src="@/assets/images/statistics/icon_vehicle_revenue.png"
              alt=""
            />
          </div>
        </div>
        <el-table
          v-loading="loading"
          highlight-current-row
          :stripe="true"
          :data="driverList"
        >
          <el-table-column label="日期" prop="datetime" width="130" />
          <el-table-column label="已接单数" prop="orderReceived" />
          <el-table-column label="已回车数" prop="pressEnter" />
          <el-table-column label="运费" prop="freight" />
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
  data() {
    return {
      drawer: false,
      title: '',
      loading: false,
      driverInfo: {}, // 车辆信息
      driver: {
        orderReceived: 0, // 已接单
        pressEnter: 0, // 里程数
        freight: 0 // 运费
      },
      driverList: [],
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
    open(row, startDate, endDate) {
      this.title = `${row.driverName} 司机效益`
      this.driverInfo = row
      this.queryParams.dateList.splice(0, 1, startDate)
      this.queryParams.dateList.splice(1, 1, endDate)
      this.getdriverTotal()
      this.onSearch()
      this.drawer = true
    },
    onClose() {
      this.drawer = false
    },
    getdriverTotal() {
      if (!this.queryParams.dateList) {
        return
      }
      const params = {
        moduleName: 'http_statistic',
        method: 'post',
        url_alias: 'driverTotal',
        data: {
          driverCode: this.driverInfo.driverCode,
          startTime: this.parseTime(
            this.queryParams.dateList[0],
            '{y}-{m}-{d}'
          ),
          endTime: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}')
        }
      }
      http_request(params).then((res) => {
        this.driver = res.data || {}
      })
    },
    onSearch() {
      if (!this.queryParams.dateList) {
        this.$message.error('请选择查询日期')
        return
      }
      const params = {
        moduleName: 'http_statistic',
        method: 'post',
        url_alias: 'driver',
        data: {
          ...this.queryParams,
          driverCode: this.driverInfo.driverCode,
          startTime: this.parseTime(
            this.queryParams.dateList[0],
            '{y}-{m}-{d}'
          ),
          endTime: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}')
        }
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.driverList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.driverSingle {
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
