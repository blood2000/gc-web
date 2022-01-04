<template>
  <div class="transport">
    <div class="transport-left">
      <div class="transport-left__bar">
        <div class="transport-left__title">运输趋势图</div>
        <el-button-group>
          <el-button @click="onClickDay(0)" :type="dayRadio === 0 ? '' : 'info'" plain size="small">
            今日
          </el-button>
          <el-button @click="onClickDay(1)" :type="dayRadio === 1 ? '' : 'info'" plain size="small">
            7天
          </el-button>
        </el-button-group>
      </div>
      <div class="transport-left__main">
        <div ref="chart" class="chart-wrapper"></div>
      </div>
    </div>
    <div class="transport-right">
      <div class="transport-right__bar">
        <div class="transport-right__title">承运信息</div>
        <el-button type="text" @click="onClickMore">更多信息</el-button>
      </div>
      <NoneData v-if="transList.length <= 0" />
      <div class="transport-right__box" v-for="(item, index) in transList" :key="index">
        <div class="user-bar">
          <div class="user-id" v-show="item.vehicleAlias">{{ item.vehicleAlias }}</div>
          <div class="user-license">{{ item.vehicleNumber }}</div>
          <div class="user-name">
            <img src="@/assets/images/index/driver-userIcon.png" alt="" />
            <span>{{ item.driverName }}</span>
          </div>
        </div>
        <div class="address">
          {{ item.statusStr }}<span>{{ item.companyName }}</span>
        </div>
        <div class="date">{{ item.updateTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import * as echarts from 'echarts'
import { getDisDayTime } from '@/utils/ddc'
import NoneData from '../NoneData'

export default {
  name: 'Transport',
  components: {
    NoneData,
  },
  data() {
    return {
      dayRadio: 0,
      chart: null,
      transList: [],
    }
  },
  created() {
    this.queryPagingTransTrend()
    this.queryListTransTrend()
  },
  methods: {
    queryPagingTransTrend() {
      const objDispatch = {
        moduleName: 'http_home',
        method: 'post',
        url_alias: 'pagingTransTrend',
        data: {
          pageIndex: 1,
          pageSize: 4,
        },
      }
      http_request(objDispatch).then((res) => {
        const data = res.data ? res.data.rows || [] : []
        this.transList = data
      })
    },
    queryListTransTrend() {
      const date = new Date()
      const objDispatch = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'listTransTrend',
        data: {
          startDate: getDisDayTime(date, 6),
          endDate: this.parseTime(date, '{y}-{m}-{d}'),
        },
      }
      http_request(objDispatch).then((res) => {
        const data = res.data
        if (data) {
          this.initChart(data)
        }
      })
    },
    // 初始化echarts
    initChart(data) {
      this.dateList = data.map((item) => {
        return item.dateStr.substring(5).replace('-', '/')
      })
      this.tripList = data.map((item) => {
        return item.tripTotal
      })
      this.chart = echarts.init(this.$refs.chart, 'macarons', {
        width: 435,
        height: 360,
      })
      this.option = {
        grid: {
          top: '15%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
        },
        legend: {
          left: 0,
          itemHeight: 8,
          data: ['运输趟次'],
        },
        xAxis: {
          type: 'category',
          data: this.dateList,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['#ebebeb'],
              type: 'dashed',
            },
          },
        },
        series: [
          {
            name: '运输趟次',
            data: this.tripList,
            type: 'bar',
            showBackground: true,
            barWidth: 16,
            backgroundStyle: {
              color: '#F7F7F7',
            },
          },
        ],
      }
      this.changeBarColor()
    },
    // 点击日子
    onClickDay(which) {
      if (this.dayRadio !== which) {
        this.dayRadio = which
        this.changeBarColor()
      }
    },
    // 改变条的颜色
    changeBarColor() {
      let length = this.option.series[0].data.length
      let seriesData = []
      for (let i = 0; i < length; i++) {
        if (i >= length - 1) {
          seriesData.push({
            value: this.tripList[i],
            itemStyle: {
              color: '#4682FA',
            },
            emphasis: {
              itemStyle: {
                color: '#5c90f7',
              },
            },
          })
        } else {
          seriesData.push({
            value: this.tripList[i],
            itemStyle: {
              color: this.dayRadio === 0 ? '#EBEBEB' : '#4682FA',
            },
            emphasis: {
              itemStyle: {
                color: '#5c90f7',
              },
            },
          })
        }
      }
      this.option.series[0].data = seriesData
      this.onDrawChart()
    },
    onDrawChart() {
      if (this.chart) {
        this.chart.setOption(this.option)
      }
    },
    onClickMore() {
      this.$router.push({ path: '/dispatch/manage' })
    },
  },
}
</script>

<style lang="scss" scoped>
.transport {
  width: 744px;
  height: 408px;
  background: #fff;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  .transport-left {
    width: 395px;
    margin-right: 15px;
    &__bar {
      display: flex;
      justify-content: space-between;
    }
    &__title {
      font-size: 20px;
      font-weight: bold;
      color: #3d4050;
    }
    &__main {
      width: 100%;
      height: 280px;
      margin-top: 15px;
      .chart-wrapper {
        width: 100%;
        height: 100%;
      }
    }
  }
  .transport-right {
    width: 304px;
    height: 376px;
    position: relative;
    background: #f7f7f7;
    border-radius: 4px;
    padding: 12px;
    &__bar {
      width: 100%;
      height: 35px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    &__title {
      font-size: 16px;
      font-weight: bold;
      color: #3d4050;
    }
    &__box {
      width: 280px;
      height: 71px;
      background: #fff;
      border-radius: 4px;
      border-left: 4px solid #4682fa;
      margin-bottom: 12px;
      padding: 7px;
      .user-bar {
        display: flex;
        align-items: center;
      }
      .user-id {
        height: 18px;
        line-height: 18px;
        margin-right: 7px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        background: linear-gradient(90deg, #4682fa 0%, #155ff2 100%);
        border-radius: 2px;
      }
      .user-license {
        font-size: 16px;
        font-weight: bold;
        color: #3d4050;
        margin-right: 7px;
      }
      .user-name {
        display: flex;
        align-items: center;
        img {
          width: 12px;
          height: 12px;
        }
        span {
          font-size: 12px;
          color: #3d4050;
        }
      }
      .address {
        font-weight: bold;
        color: #3d4050;
        span {
          font-weight: normal;
          color: #bebebe;
          margin-left: 3px;
        }
      }
      .date {
        font-size: 12px;
        color: #bebebe;
      }
    }
  }
}
</style>
