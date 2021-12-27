<template>
  <div class="driverMore">
    <div @click="open" class="driverMore-link">查看更多</div>

    <el-drawer
      title="司机效益"
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
              <el-form-item label="姓名">
                <el-input
                  v-model="queryParams.driverName"
                  placeholder="请输入司机姓名"
                  clearable
                  size="small"
                  @keyup.enter.native="onSearch"
                />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                  v-model="queryParams.driverPhone"
                  placeholder="请输入手机号"
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
          :data="driverList"
          @row-click="onClickRow"
        >
          <el-table-column label="姓名" prop="driverName" />
          <el-table-column label="手机号" prop="driverPhone" />
          <el-table-column label="已接单" prop="orderReceived" />
          <el-table-column label="已回车" prop="pressEnter" />
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

    <DriverSingle ref="driverSingle" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import DriverSingle from './driverSingle.vue'

export default {
  components: {
    DriverSingle
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
      driverList: [
        // {
        //   date: '', // 日期
        //   receiveCount: 0, // 已接单
        //   loadCount: 0, // 已出车
        //   unloadCount: 0 // 已回车
        // }
      ],
      queryParams: {
        dateList: [new Date(), new Date()],
        driverName: '', // 司机名
        driverPhone: '', // 手机号
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
        url_alias: 'driver',
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
          this.driverList = res.data.rows || []
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    onReset() {
      this.queryParams.pageNum = 1
      this.queryParams.dateList = [new Date(), new Date()]
      this.queryParams.driverName = ''
      this.queryParams.driverPhone = ''
      this.onSearch()
    },
    onClickRow(row) {
      this.$refs.driverSingle.open(row, this.startDateNow, this.endDateNow)
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
.driverMore {
  .driverMore-link {
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
