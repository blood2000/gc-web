<template>
  <div class="vehicleMore">
    <div @click="open" class="vehicleMore-link">查看更多</div>

    <el-drawer
      title="车辆效益"
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
              <el-form-item label="车牌号码">
                <el-input
                  v-model="queryParams.vehicleNumber"
                  placeholder="请输入车牌号码"
                  clearable
                  size="small"
                  @keyup.enter.native="onSearch"
                />
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
      <div class="table">
        <el-table
          v-loading="loading"
          highlight-current-row
          :stripe="true"
          :data="vehicleList"
          @row-click="onClickRow"
        >
          <el-table-column label="车辆别名" prop="vehicleAlias" />
          <el-table-column label="车牌号" prop="vehicleNumber" />
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

    <VehicleSingle ref="vehicleSingle" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import VehicleSingle from './vehicleSingle.vue'

export default {
  components: {
    VehicleSingle
  },
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
      vehicleList: [
        // {
        //   date: '', // 日期
        //   receiveCount: 0, // 已接单
        //   loadCount: 0, // 已出车
        //   unloadCount: 0 // 已回车
        // }
      ],
      queryParams: {
        dateList: [new Date(), new Date()],
        vehicleNumber: '', // 车牌号
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
        method: 'post',
        url_alias: 'vehicle',
        data: {
          ...this.queryParams,
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
          this.startDateNow = params.data.startTime
          this.endDateNow = params.data.endTime
          this.vehicleList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onReset() {
      this.queryParams.pageNum = 1
      this.queryParams.dateList = [new Date(), new Date()]
      this.queryParams.vehicleNumber = ''
      this.onSearch()
    },
    onClickRow(row) {
      this.$refs.vehicleSingle.open(row, this.startDateNow, this.endDateNow)
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
.vehicleMore {
  .vehicleMore-link {
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    &:hover {
      color: #eeeeee;
    }
  }
  .searchBar {
    margin-top: 20px;
    border-bottom: 1px solid #e4ecf4;
  }
  .table {
    padding: 25px 30px;
  }
}
</style>
