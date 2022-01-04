<template>
  <div class="orderDetail">
    <el-drawer
      :title="orderDetail.companyName"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :before-close="onClose"
    >
      <div class="orderDetail__wrapper">
        <div class="orderDetail__date">{{ startDate }} 至 {{ endDate }}</div>
        <div class="orderDetail__source-wrapper">
          <div
            class="orderDetail__source"
            :class="{
              chy: orderDetail.source === 'chy',
              zj: orderDetail.source === 'zj',
            }"
          >
            <img
              v-show="orderDetail.source === 'chy'"
              src="@/assets/images/statistics/icon_chy.png"
              alt=""
            />
            <img
              v-show="orderDetail.source === 'zj'"
              src="@/assets/images/statistics/icon_zj.png"
              alt=""
            />
            <span>{{ orderDetail.title }}</span>
          </div>
        </div>
        <div class="orderDetail__address">
          <div class="box">
            <div class="iconText">起</div>
            <div class="line"></div>
            <div class="address">{{ orderDetail.loadFormattedAddress }}</div>
          </div>
          <div class="box">
            <div class="iconText blueIconText">终</div>
            <div class="address">{{ orderDetail.unloadFormattedAddress }}</div>
          </div>
        </div>
        <el-button class="mtb20" type="primary" :loading="exportLoading" @click="onExport">
          导出
        </el-button>
        <div class="table">
          <el-table v-loading="loading" highlight-current-row :stripe="true" :data="orderList">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆别名" prop="vehicleAlias" />
            <el-table-column label="车牌号" prop="vehicleNumber" />
            <el-table-column label="趟次" prop="tripsTotal" />
            <el-table-column label="净重（吨）" prop="netWeightTotal" />
            <el-table-column label="应收运费（元）" prop="incomeTotal" />
            <el-table-column label="应付运费（元）" prop="payTotal" />
            <el-table-column label="净收入（元）" prop="netIncomeTotal" />
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
  </div>
</template>

<script>
import { http_request } from '@/api'

export default {
  components: {},
  data() {
    return {
      drawer: false,
      startDate: '',
      endDate: '',
      loading: false,
      exportLoading: false,
      orderDetail: {},
      orderList: [],
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
      this.orderDetail = data
      this.drawer = true
      this.onSearch()
    },
    onClose() {
      this.drawer = false
    },
    onSearch() {
      const params = {
        moduleName: 'http_statistic',
        method: 'get',
        url_alias: 'pagingDispatchOrderByDispatchOrderCode',
        data: {
          ...this.queryParams,
          dispatchOrderCode: this.orderDetail.dispatchOrderCode,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.orderList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    // 导出
    onExport() {
      this.exportLoading = true
      const params = {
        startDate: this.startDate,
        endDate: this.endDate,
        companyName: this.companyName,
        dispatchOrderCode: this.orderDetail.dispatchOrderCode,
      }
      this.downloadFileName(
        '/fmsweb/basic/dispatch/v1/exportDispatchOrderByDispatchOrderCode',
        params,
        `${params.startDate}至${params.endDate}${this.orderDetail.companyName}_${this.orderDetail.title}_运输明细表`
      )
      this.exportLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.orderDetail {
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
  &__source-wrapper {
    display: flex;
  }
  &__source {
    min-width: 285px;
    height: 28px;
    padding: 0 5px;
    margin: 15px 0;
    border-radius: 3px;
    display: flex;
    align-items: center;
    &.chy {
      background: linear-gradient(90deg, rgba(70, 130, 250, 0.16) 0%, rgba(70, 130, 250, 0) 100%);
    }
    &.zj {
      background: linear-gradient(90deg, rgba(67, 185, 30, 0.16) 0%, rgba(67, 185, 30, 0) 100%);
    }
    img {
      width: 37px;
      height: 20px;
      margin-right: 5px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
      color: #3d4050;
    }
  }
  &__address {
    .box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
    .line {
      width: 1px;
      height: 8px;
      background: #c7cbd2;
      position: absolute;
      top: 22px;
      left: 9px;
    }
    .iconText {
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: #ffbc00;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
      margin-right: 10px;
    }
    .blueIconText {
      background: #4682fa;
    }
    .address {
      font-size: 14px;
      color: #3d4050;
    }
  }
}
</style>
