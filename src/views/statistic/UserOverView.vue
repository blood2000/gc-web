<template>
  <div class="s-container">
    <!-- 0降 1升 -->
    <ul class="s-container__list ly-flex ly-flex-pack-justify ly-flex-w">
      <li class="ly-flex ly-flex-pack-justify ly-flex-align-center">
        <img src="~@/assets/images/statistic/count_before.png">
        <div class="line-box ly-flex ly-flex-pack-justify">
          <p class="label ly-flex ly-flex-align-center">接入企业</p>
          <div class="count-content ly-flex ly-flex-pack-justify ly-flex-align-center">
            <count-to class="count" :end-val="countData.enterpriseCount" :decimal-places="0" />
            <img :src="require(`@/assets/images/statistic/count_${countData.enterpriseYearType===0?'down':'up'}.png`)">
            <span :class="countData.enterpriseYearType===0?'count-down':'count-up'">{{ countData.enterpriseYearValue ? countData.enterpriseYearValue : '0%' }}</span>
            <img class="mouth" :src="require(`@/assets/images/statistic/mouth_${countData.enterpriseYearType===0?'down':'up'}.png`)">
          </div>
        </div>
      </li>
      <li class="ly-flex ly-flex-pack-justify ly-flex-align-center">
        <img src="~@/assets/images/statistic/count_before.png">
        <div class="line-box ly-flex ly-flex-pack-justify">
          <p class="label ly-flex ly-flex-align-center">接入车队</p>
          <div class="count-content ly-flex ly-flex-pack-justify ly-flex-align-center">
            <count-to class="count" :end-val="countData.fmsCount" :decimal-places="0" />
            <img :src="require(`@/assets/images/statistic/count_${countData.fmsYearType===0?'down':'up'}.png`)">
            <span :class="countData.fmsYearType===0?'count-down':'count-up'">{{ countData.fmsYearValue ? countData.fmsYearValue : '0%' }}</span>
            <img class="mouth" :src="require(`@/assets/images/statistic/mouth_${countData.fmsYearType===0?'down':'up'}.png`)">
          </div>
        </div>
      </li>
      <li class="ly-flex ly-flex-pack-justify ly-flex-align-center">
        <img src="~@/assets/images/statistic/count_before.png">
        <div class="line-box ly-flex ly-flex-pack-justify">
          <p class="label ly-flex ly-flex-align-center">接入车辆</p>
          <div class="count-content ly-flex ly-flex-pack-justify ly-flex-align-center">
            <count-to class="count" :end-val="countData.vehicleCount" :decimal-places="0" />
            <img :src="require(`@/assets/images/statistic/count_${countData.vehicleYearType===0?'down':'up'}.png`)">
            <span :class="countData.vehicleYearType===0?'count-down':'count-up'">{{ countData.vehicleYearValue ? countData.vehicleYearValue : '0%' }}</span>
            <img class="mouth" :src="require(`@/assets/images/statistic/mouth_${countData.vehicleYearType===0?'down':'up'}.png`)">
          </div>
        </div>
      </li>
      <li class="ly-flex ly-flex-pack-justify ly-flex-align-center">
        <img src="~@/assets/images/statistic/count_before.png">
        <div class="line-box ly-flex ly-flex-pack-justify">
          <p class="label ly-flex ly-flex-align-center">接入司机</p>
          <div class="count-content ly-flex ly-flex-pack-justify ly-flex-align-center">
            <count-to class="count" :end-val="countData.driverCount" :decimal-places="0" />
            <img :src="require(`@/assets/images/statistic/count_${countData.driverYearType===0?'down':'up'}.png`)">
            <span :class="countData.driverYearType===0?'count-down':'count-up'">{{ countData.driverYearValue ? countData.driverYearValue : '0%' }}</span>
            <img class="mouth" :src="require(`@/assets/images/statistic/mouth_${countData.driverYearType===0?'down':'up'}.png`)">
          </div>
        </div>
      </li>
    </ul>

    <div ref="chart" class="s-container__chart" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';
import CountTo from '@/components/CountTo';
import { http_request } from "@/api";
export default {
  components: {
    CountTo
  },
  props: {

  },
  data() {
    return {
      chart: null,
      countData: {},
      priseData: [],
      fmsData: [],
      vehicleData: [],
      driverData: []
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "userOverView"
      };
      http_request(obj).then((res) => {
        if (res.data) {
          const {
            nearlySevenDaysEnterpriseCount,
            nearlySevenDaysFmsCount,
            nearlySevenDaysVehicleCount,
            nearlySevenDaysDriverCount
          } = res.data;
          this.countData = res.data;
          this.priseData = nearlySevenDaysEnterpriseCount || [];
          this.fmsData = nearlySevenDaysFmsCount || [];
          this.vehicleData = nearlySevenDaysVehicleCount || [];
          this.driverData = nearlySevenDaysDriverCount || [];
          this.$nextTick(() => {
            this.initChart();
          });
        }
      });
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons');
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      const timeData = [];
      const priseData = [];
      const fmsData = [];
      const vehicleData = [];
      const driverData = [];
      this.priseData.forEach(el => {
        timeData.push(el.datetime);
        priseData.push(el.count);
      })
      this.fmsData.forEach(el => {
        fmsData.push(el.count);
      })
      this.vehicleData.forEach(el => {
        vehicleData.push(el.count);
      })
      this.driverData.forEach(el => {
        driverData.push(el.count);
      })
      this.chart.setOption({
        legend: {
          show: true,
          right: 0,
          top: '4%',
          icon: 'circle',
          textStyle: {
            color: '#EBEBEB',
            fontFamily: 'PingFang SC'
          },
          data: [{
            name: '接入企业'
          }, {
            name: '接入车队'
          }, {
            name: '接入车辆'
          }, {
            name: '接入司机'
          }]
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '8%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#F2E9FA',
              fontFamily: 'PingFang SC'
            }
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#65378B'
            }
          },
          axisTick: {
            show: true // 显示x坐标轴刻度
          },
          data: timeData
        },
        yAxis: {
          name: '数量(万)',
          nameTextStyle: {
            color: '#F9EBFF',
            paddingLeft: '2%',
            fontFamily: 'PingFang SC'
          },
          type: 'value',
          minInterval: 1, // 只显示整数
          axisLine: {
            show: false
          },
          // y轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#F2E9FA',
              fontFamily: 'PingFang SC'
            }
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(130, 85, 168, 0.6)',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false // 隐藏y坐标轴刻度
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang SC'
          }
        },
        series: [{
          name: '接入企业',
          data: priseData,
          type: 'line',
          symbol: 'circle',
          color: '#F23AA1', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgba(242, 58, 161, 0.42)'
              }
            }
          }
        },{
          name: '接入车队',
          data: fmsData,
          type: 'line',
          symbol: 'circle',
          color: '#373AD8', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#201E6E'
              }
            }
          }
        },{
          name: '接入车辆',
          data: vehicleData,
          type: 'line',
          symbol: 'circle',
          color: '#A943F9', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgba(199, 134, 250, 0.47)'
              }
            }
          }
        },{
          name: '接入司机',
          data: driverData,
          type: 'line',
          symbol: 'circle',
          color: '#8B9BF7', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgba(165, 175, 228, 0.47)'
              }
            }
          }
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        legend: {
          itemWidth: setfontSize(6),
          itemHeight: setfontSize(6),
          textStyle: {
            fontSize: setfontSize(10)
          }
        },
        tooltip: {
          padding: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(11)
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            fontSize: setfontSize(11)
          },
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(11)
            }
          }
        },
        series: [{
          symbolSize: setfontSize(5),
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(1.5)
              }
            }
          }
        },{
          symbolSize: setfontSize(5),
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(1.5)
              }
            }
          }
        },{
          symbolSize: setfontSize(5),
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(1.5)
              }
            }
          }
        },{
          symbolSize: setfontSize(5),
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(1.5)
              }
            }
          }
        }]
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  &__list{
    height: 5rem;
    padding: 0.8rem 0 0.5rem;
    >li{
      height: calc(50% - 0.4rem);
      width: calc(50% - 1.48rem);
      margin-right: 1.48rem;
      position: relative;
      &:nth-child(1), &:nth-child(2){
        margin-bottom: 0.8rem;
      }
      >img{
        width: 1.05rem;
        height: 0.9rem;
      }
      >.line-box{
        width: calc(100% - 1.1rem);
        height: 100%;
        position: relative;
        padding-left: 0.25rem;
        >.label{
          height: 100%;
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(223, 215, 230, 0.88);
          transform: scale(0.9);
        }
        >.count-content{
          height: 100%;
          >.count{
            font-size: 0.85rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(242, 233, 250, 0.88);
          }
          >img{
            width: 0.65rem;
            height: 0.425rem;
            margin: 0 0.1rem 0 0.5rem;
            &.mouth{
              width: 0.5rem;
              height: 0.5rem;
              margin: 0 0 0 0.2rem;
            }
          }
          >.count-up, >.count-down{
            font-size: 0.6rem;
            font-family: PingFang SC;
            font-weight: 500;
            transform: scale(0.8);
          }
          >.count-up{
            color: #FF99D5;
          }
          >.count-down{
            color: #BB71FF; 
          }
        }
        &::before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 0.2rem;
          background: url('~@/assets/images/statistic/line_top.png') no-repeat;
          background-size: 100% 100%;
        }
        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 0.225rem;
          background: url('~@/assets/images/statistic/line_bottom.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  &__chart{
    height: calc(100% - 5rem);
  }
}
</style>