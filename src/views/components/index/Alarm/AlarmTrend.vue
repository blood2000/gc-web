<template>
  <div class="alarmTrend">
    <div class="alarmTrend__bar">
      <div class="alarmTrend__title">告警趋势图</div>
      <el-button-group>
        <el-button @click="onClickDay(1)" :type="dayRadio === 1 ? '' : 'info'" plain size="small">
          今日
        </el-button>
        <el-button @click="onClickDay(2)" :type="dayRadio === 2 ? '' : 'info'" plain size="small">
          7天
        </el-button>
      </el-button-group>
    </div>
    <div class="alarmTrend__main">
      <div ref="chart" class="chart-wrapper"></div>
      <div ref="pieChart" class="pieChart-wrapper"></div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import * as echarts from 'echarts'

export default {
  name: 'alarmTrend',
  data() {
    return {
      dayRadio: 1,
      chart: null,
      pieChart: null,
      pieData: {},
    }
  },
  created() {
    this.queryAlarmTrendChart()
  },
  methods: {
    // 获取告警趋势图信息
    queryAlarmTrendChart(which) {
      const objDispatch = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'alarmTrendChart',
        data: {
          dateType: this.dayRadio,
        },
      }
      http_request(objDispatch).then((res) => {
        const data = res.data
        if (data) {
          if (!which) {
            data.alarmTrendChartColumnChartVos && this.initChart(data.alarmTrendChartColumnChartVos)
          }
          data.alarmTrendChartPieChartVos && this.initPieChart(data.alarmTrendChartPieChartVos)
        }
      })
    },
    // 初始化echarts
    initChart(data) {
      this.dateList = data.map((item) => {
        return item.createTime
      })
      this.alarmList = data.map((item) => {
        return item.number
      })
      this.chart = echarts.init(this.$refs.chart, 'macarons', {
        width: 700,
        height: 270,
      })
      this.option = {
        grid: {
          top: '15%',
          left: '8%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
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
            name: '告警次数',
            data: this.alarmList,
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
    // 初始化饼图
    initPieChart(data) {
      const that = this
      data.forEach((item) => {
        this.pieData[item.alarmObject] = item
      })
      this.pieChart = echarts.init(this.$refs.pieChart, 'macarons', {
        width: 340,
        height: 250,
      })
      this.pieOption = {
        legend: {
          top: '75%',
          left: 'center',
          itemWidth: 5,
          itemHeight: 5,
        },
        series: [
          {
            type: 'pie',
            radius: ['28%', '55%'],
            center: ['50%', '35%'],
            data: [
              {
                value: that.pieData.vehicle.number,
                name: '行车事件',
                itemStyle: {
                  color: '#3751FF',
                },
                label: {
                  color: '#fff',
                  fontWeight: 'bold',
                  position: 'inside',
                  formatter: function () {
                    return `${that.pieData.vehicle.percentage}%`
                  },
                },
              },
              {
                value: that.pieData.driver.number,
                name: '司机行为',
                label: {
                  color: '#fff',
                  fontWeight: 'bold',
                  position: 'inside',
                  formatter: function () {
                    return `${that.pieData.driver.percentage}%`
                  },
                },
                itemStyle: {
                  color: '#7C8DFF',
                },
              },
              {
                value: that.pieData.device.number,
                name: '异常事件',
                label: {
                  color: '#fff',
                  fontWeight: 'bold',
                  position: 'inside',
                  formatter: function () {
                    return `${that.pieData.device.percentage}%`
                  },
                },
                itemStyle: {
                  color: '#43B91E',
                },
              },
              {
                value: that.pieData.transport.number,
                name: '运输事件',
                label: {
                  color: '#fff',
                  fontWeight: 'bold',
                  position: 'inside',
                  formatter: function () {
                    return `${that.pieData.transport.percentage}%`
                  },
                },
                itemStyle: {
                  color: '#9AE284',
                },
              },
            ],
          },
          {
            type: 'pie',
            radius: ['28%', '55%'],
            center: ['50%', '35%'],
            data: [
              {
                value: that.pieData.vehicle.number,
                name: '行车事件',
                itemStyle: {
                  color: '#3751FF',
                },
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#3D4050',
                    fontWeight: 'bold',
                    formatter: function (p) {
                      return `${p.data.name}\n${that.pieData.vehicle.percentage}%`
                    },
                  },
                },
              },
              {
                value: that.pieData.driver.number,
                name: '司机行为',
                itemStyle: {
                  color: '#7C8DFF',
                },
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#3D4050',
                    fontWeight: 'bold',
                    formatter: function (p) {
                      return `${p.data.name}\n${that.pieData.driver.percentage}%`
                    },
                  },
                },
              },
              {
                value: that.pieData.device.number,
                name: '异常事件',
                itemStyle: {
                  color: '#43B91E',
                },
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#3D4050',
                    fontWeight: 'bold',
                    formatter: function (p) {
                      return `${p.data.name}\n${that.pieData.device.percentage}%`
                    },
                  },
                },
              },
              {
                value: that.pieData.transport.number,
                name: '运输事件',
                itemStyle: {
                  color: '#9AE284',
                },
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#3D4050',
                    fontWeight: 'bold',
                    formatter: function (p) {
                      return `${p.data.name}\n${that.pieData.transport.percentage}%`
                    },
                  },
                },
              },
            ],
          },
        ],
      }
      if (this.pieChart) {
        this.pieChart.setOption(this.pieOption)
      }
    },
    // 点击日子
    onClickDay(which) {
      if (this.dayRadio !== which) {
        this.dayRadio = which
        this.queryAlarmTrendChart('changeDay')
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
            value: this.alarmList[i],
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
            value: this.alarmList[i],
            itemStyle: {
              color: this.dayRadio === 1 ? '#EBEBEB' : '#4682FA',
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
  },
}
</script>

<style lang="scss" scoped>
.alarmTrend {
  width: 1044px;
  height: 380px;
  background: #fff;
  border-radius: 4px;
  padding: 20px 30px;
  &__bar {
    width: 100%;
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
    display: flex;
    margin-top: 40px;
    .chart-wrapper {
      width: 660px;
      height: 100%;
    }
    .pieChart-wrapper {
      width: 324px;
      height: 100%;
    }
  }
}
</style>
