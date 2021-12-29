<template>
  <div class="vehicleSingle">
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
            <div class="title">运输次数</div>
            <div class="value">
              <span>{{ vehicle.transCount }}</span>
              趟
            </div>
            <img src="@/assets/images/statistic/icon_revenueCount.png" alt="" />
          </div>
          <div class="box">
            <div class="title">载重</div>
            <div class="value">
              <span>{{ vehicle.weight }}</span>
              吨
            </div>
            <img src="@/assets/images/statistic/icon_weight.png" alt="" />
          </div>
          <div class="box">
            <div class="title">里程数</div>
            <div class="value">
              <span>{{ vehicle.mileage }}</span>
              公里
            </div>
            <img src="@/assets/images/statistic/icon_mileage.png" alt="" />
          </div>
          <div class="box">
            <div class="title">运费</div>
            <div class="value">
              <span>{{ vehicle.revenue }}</span>
              元
            </div>
            <img
              src="@/assets/images/statistic/icon_vehicle_revenue.png"
              alt=""
            />
          </div>
        </div>
        <el-table
          v-loading="loading"
          highlight-current-row
          :stripe="true"
          :data="vehicleList"
        >
          <el-table-column label="日期" prop="dateTime" width="130" />
          <el-table-column label="运输次数" prop="transCount" />
          <el-table-column label="载重" prop="weight" />
          <el-table-column label="里程数" prop="mileage" />
          <el-table-column label="运费" prop="revenue" />
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
      vehicleInfo: {}, // 车辆信息
      vehicle: {
        transCount: 0, // 运输次数
        weight: 0, // 载重
        mileage: 0, // 里程数
        revenue: 0 // 运费
      },
      vehicleList: [],
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
      this.title = `${row.vehicleAlias ? row.vehicleAlias + ' | ' : ''} ${
        row.vehicleNumber
      } 车辆效益`
      this.vehicleInfo = row
      this.queryParams.dateList.splice(0, 1, startDate)
      this.queryParams.dateList.splice(1, 1, endDate)
      this.getVehicleTotal()
      this.onSearch()
      this.drawer = true
    },
    onClose() {
      this.drawer = false
    },
    getVehicleTotal() {
      if (!this.queryParams.dateList) {
        return
      }
      const params = {
        moduleName: 'http_statistic',
        method: 'post',
        url_alias: 'vehicleTotal',
        data: {
          vehicleCode: this.vehicleInfo.vehicleCode,
          startTime: this.parseTime(
            this.queryParams.dateList[0],
            '{y}-{m}-{d}'
          ),
          endTime: this.parseTime(this.queryParams.dateList[1], '{y}-{m}-{d}')
        }
      }
      http_request(params).then((res) => {
        this.vehicle = res.data || {}
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
        url_alias: 'vehicle',
        data: {
          ...this.queryParams,
          vehicleCode: this.vehicleInfo.vehicleCode,
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
          this.vehicleList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vehicleSingle {
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
