<template>
  <div class="detail">
    <el-drawer
      :title="detail.name"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :before-close="onClose"
    >
      <div class="detail__wrapper">
        <div class="detail__address" v-show="detail.type === '2'">
          <div class="box">
            <div class="iconText">起</div>
            <div class="line"></div>
            <div class="address">{{ detail.startRoute }}</div>
          </div>
          <div class="box">
            <div class="iconText blueIconText">终</div>
            <div class="address">{{ detail.endRoute }}</div>
          </div>
        </div>
        <div class="detail__date">{{ startDate }} 至 {{ endDate }}</div>
        <el-button
          class="mtb20"
          type="primary"
          :loading="exportLoading"
          @click="onExport"
        >
          导出
        </el-button>
        <div class="table">
          <el-table
            v-loading="loading"
            highlight-current-row
            :stripe="true"
            :data="list"
          >
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="detail.type === '3'"
              label="用车企业"
              prop="companyName"
            />
            <el-table-column
              v-if="detail.type === '1' || detail.type === '3'"
              label="路线名称"
              prop="routeName"
            />
            <el-table-column
              v-if="detail.type === '1' || detail.type === '3'"
              label="出发地"
              prop="startRoute"
            />
            <el-table-column
              v-if="detail.type === '1' || detail.type === '3'"
              label="目的地"
              prop="endRoute"
            />
            <el-table-column
              v-if="detail.type === '2'"
              label="用车企业"
              prop="companyName"
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
      </div>
    </el-drawer>

    <LastDetail ref="lastDetail" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import LastDetail from './lastDetail.vue'

export default {
  components: {
    LastDetail
  },
  data() {
    return {
      drawer: false,
      startDate: '',
      endDate: '',
      loading: false,
      exportLoading: false,
      detail: {},
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  mounted() {},
  methods: {
    open(data, startDate, endDate) {
      this.startDate = startDate
      this.endDate = endDate
      if (data.type === '1') {
        this.detail = {
          ...data,
          name: data.companyName,
          code: data.shipmentCode
        }
      } else if (data.type === '2') {
        this.detail = {
          ...data,
          name: data.routeName,
          code: data.routeCode
        }
      } else if (data.type === '3') {
        this.detail = {
          ...data,
          name: `${data.vehicleAlias}（${data.vehicleNumber}）`,
          code: data.vehicleCode
        }
      }
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
        url_alias: 'pagingWeighbridgeStatisticsByCode',
        data: {
          type: this.detail.type,
          code: this.detail.code,
          startDate: this.startDate,
          endDate: this.endDate,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        }
      }
      this.loading = true
      http_request(params).then((res) => {
        if (res.data) {
          this.list = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onClickDetail(row) {
      row.name = this.detail.name
      row.type = this.detail.type
      row.code = this.detail.code
      if (this.detail.startRoute) {
        row.startRoute = this.detail.startRoute
        row.endRoute = this.detail.endRoute
      }
      row.vehicleName = `（${this.detail.vehicleAlias}-${this.detail.vehicleNumber}）`
      this.$refs.lastDetail.open(row, this.startDate, this.endDate)
    },
    // 导出
    onExport() {
      this.exportLoading = true
      const params = {
        type: this.detail.type,
        code: this.detail.code,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let fileName = `${params.startDate}至${params.endDate}`
      if (params.type === '1') {
        fileName = `${fileName}${this.detail.companyName}各路线磅单统计报表`
      } else if (params.type === '2') {
        fileName = `${fileName}${this.detail.routeName}磅单统计报表（${this.detail.startRoute}-${this.detail.endRoute}）`
      } else if (params.type === '3') {
        fileName = `${fileName}（${this.detail.vehicleAlias}-${this.detail.vehicleNumber}）磅单统计报表`
      }
      this.downloadFileName(
        '/fmsweb/basic/weighbridge/v1/exportWeighbridgeStatisticsByCode',
        params,
        fileName
      )
      this.exportLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
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
  &__address {
    margin-top: 5px;
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
