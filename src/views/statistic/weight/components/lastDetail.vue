<template>
  <div class="lastDetail">
    <el-drawer
      :title="detail.name"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :before-close="onClose"
    >
      <div class="lastDetail__wrapper">
        <div class="lastDetail__date">{{ startDate }} 至 {{ endDate }}</div>
        <div v-show="detail.type === '3'" class="lastDetail__companyName">
          {{ detail.companyName }}
        </div>
        <div class="lastDetail__route">
          <img src="@/assets/images/icon/icon-route.png" alt="" />
          <span>{{ detail.routeName }}</span>
        </div>
        <div class="lastDetail__address">
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
        <div class="lastDetail__searchBar">
          <el-button
            class="mtb20"
            type="primary"
            :loading="exportLoading"
            @click="onExport"
          >
            导出
          </el-button>
          <div class="label" v-show="detail.type !== '3'">
            <p>货品类型</p>
            <el-select
              class="w260"
              v-model="queryParams.goodsCode"
              filterable
              size="small"
              @change="onGoodsChange"
            >
              <el-option
                v-for="item in goodsList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="table">
          <el-table
            v-if="drawer"
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
              v-if="detail.type === '1' || detail.type === '2'"
              label="车辆别名"
              prop="vehicleAlias"
              :key="Math.random()"
            />
            <el-table-column
              v-if="detail.type === '1' || detail.type === '2'"
              label="车牌号"
              prop="vehicleNumber"
              :key="Math.random()"
            />
            <el-table-column label="货品类型" prop="goodsName" />
            <el-table-column
              v-if="detail.type === '1' || detail.type === '2'"
              label="磅单数"
              prop="weighbridgeCount"
              :key="Math.random()"
            />
            <el-table-column
              v-if="detail.type === '3'"
              label="司机运费（元）"
              prop="driverFreightPrice"
              :key="Math.random()"
            />
            <el-table-column
              v-if="detail.type === '3'"
              label="司机附加费（元）"
              prop="driverSurchargePrice"
              :key="Math.random()"
            />
            <el-table-column
              v-if="detail.type === '3'"
              label="装货净重（吨）"
              prop="loadingNetWeight"
              :key="Math.random()"
            />
            <el-table-column
              v-if="detail.type === '3'"
              label="卸货净重（吨）"
              prop="unloadingNetWeight"
              :key="Math.random()"
            />
            <el-table-column label="结算总额（元）" prop="freightTotal" />
            <el-table-column
              v-if="detail.type === '3'"
              label="磅单日期"
              prop="recordDate"
              :key="Math.random()"
            />
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
      detail: {},
      list: [],
      queryParams: {
        goodsCode: '',
        pageNum: 1,
        pageSize: 10
      },
      goodsList: [],
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
          companyName: data.name,
          shipmentCode: data.code
        }
      } else if (data.type === '2') {
        this.detail = {
          ...data,
          routeCode: data.code,
          routeName: data.name,
          name: data.companyName
        }
      } else if (data.type === '3') {
        this.detail = {
          ...data,
          vehicleCode: data.code
        }
      }
      this.drawer = true
      this.onSearch()
      this.queryGoods()
    },
    onClose() {
      this.queryParams = {
        goodsCode: '',
        pageNum: 1,
        pageSize: 10
      }
      this.list = []
      this.drawer = false
    },
    onGoodsChange() {
      this.queryParams.pageNum = 1
      this.onSearch()
    },
    onSearch() {
      const params = {
        moduleName: 'http_statistic',
        method: 'get',
        url_alias: 'pagingLastWeighbridgeStatistics',
        data: {
          ...this.queryParams,
          routeCode: this.detail.routeCode,
          shipmentCode: this.detail.shipmentCode,
          vehicleCode: this.detail.vehicleCode,
          type: this.detail.type,
          startDate: this.startDate,
          endDate: this.endDate
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
    // 查询货品列表
    queryGoods() {
      const params = {
        moduleName: 'http_coRoute',
        method: 'get',
        url_alias: 'coRoute_goods'
      }
      http_request(params).then((res) => {
        let goodsList = res.data || []
        goodsList.unshift({
          dictLabel: '全部',
          dictValue: ''
        })
        this.goodsList = goodsList
      })
    },
    // 导出
    onExport() {
      this.exportLoading = true
      const params = {
        startDate: this.startDate,
        endDate: this.endDate,
        type: this.detail.type,
        shipmentCode: this.detail.shipmentCode,
        routeCode: this.detail.routeCode,
        vehicleCode: this.detail.vehicleCode,
        goodsCode: this.queryParams.goodsCode
      }
      let fileName = `${params.startDate}至${params.endDate}`
      if (params.type === '1') {
        fileName = `${fileName}${this.detail.companyName}磅单明细报表${this.detail.routeName}（${this.detail.startRoute}-${this.detail.endRoute}）`
      } else if (params.type === '2') {
        fileName = `${fileName}${this.detail.companyName}磅单明细报表${this.detail.routeName}（${this.detail.startRoute}-${this.detail.endRoute}）`
      } else if (params.type === '3') {
        fileName = `${fileName}${this.detail.vehicleName}磅单明细报表${this.detail.companyName}-${this.detail.routeName}（${this.detail.startRoute}-${this.detail.endRoute}）`
      }
      this.downloadFileName(
        '/fmsweb/basic/weighbridge/v1/exportLastWeighbridgeStatistics',
        params,
        fileName
      )
      this.exportLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.lastDetail {
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
  &__route {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: #3d4050;
    margin: 15px 0;
    img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
  &__companyName {
    font-size: 18px;
    font-weight: bold;
    color: #3d4050;
    margin-top: 15px;
  }
  &__address {
    .box {
      display: flex;
      align-items: center;
      margin: 0 0 10px 35px;
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
  &__searchBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .label {
      p {
        font-size: 14px;
        color: #3d4050;
      }
      .w260 {
        width: 260px;
      }
    }
  }
}
</style>
