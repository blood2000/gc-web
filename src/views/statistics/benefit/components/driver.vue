<template>
  <div class="driver">
    <div class="driver-bar">
      <div class="driver-title">
        <span class="title">车辆效益</span>
        <DriverMore :startDate="startDate" :endDate="endDate" />
      </div>
      <div class="driver-data">
        <div class="driver-data__wrapper">
          <div class="driver-data__title">任务司机</div>
          <div class="driver-data__num">
            {{ driverBenefitInfo.driverCount || 0 }}
            <span>人</span>
          </div>
        </div>
        <div class="driver-data__wrapper">
          <div class="driver-data__title">已收款</div>
          <div class="driver-data__num">
            {{ driverBenefitInfo.revenue || 0 }}
            <span>元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="driver-wrapper">
      <div class="driver-wrapper__title">运输Top3</div>
      <NoneData
        v-if="
          !driverBenefitInfo.driverBenefitRanking ||
          driverBenefitInfo.driverBenefitRanking.length <= 0
        "
      />
      <div
        v-else
        class="driver-wrapper__box"
        v-for="(item, index) in driverBenefitInfo.driverBenefitRanking"
        :key="index"
      >
        <div class="rank" :class="'rank_' + index"></div>
        <div class="driverNumber">{{ item.driverName }}</div>
        <div class="num">
          {{ item.receivedOrder || 0 }}
          <span>单</span>
        </div>
        <div class="num ml20">
          {{ item.freight || 0 }}
          <span>元</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import NoneData from '../../../components/index/NoneData/index.vue'
import DriverMore from './driverMore.vue'

export default {
  components: {
    NoneData,
    DriverMore
  },
  props: {
    driverBenefitInfo: {
      type: Object,
      default: {}
    },
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
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.driver {
  margin-top: 18px;
  &-bar {
    width: 100%;
    height: 175px;
    background: url('~@/assets/images/statistic/color-bg.png') no-repeat;
    background-size: 100% 100%;
    background-color: #43b91e;
    border-radius: 4px;
  }
  &-title {
    padding: 14px;
    position: relative;
    display: flex;
    justify-content: center;
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0px 1px 2px #217e03;
    }
  }
  &-data {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
    &__title {
      font-size: 14px;
      color: #ffffff;
      opacity: 0.5;
    }
    &__num {
      font-size: 26px;
      font-family: Bahnschrift;
      font-weight: bold;
      color: #ffffff;
      span {
        font-size: 14px;
        color: #ffffff;
        opacity: 0.5;
      }
    }
  }
  &-wrapper {
    width: 460px;
    height: 311px;
    background: #fff;
    padding: 20px 25px;
    border-radius: 16px 16px 4px 4px;
    margin-top: -27px;
    position: relative;
    &__title {
      font-size: 20px;
      font-weight: bold;
      color: #3d4050;
      margin-bottom: 15px;
    }
    &__box {
      width: 412px;
      height: 70px;
      background: linear-gradient(
        90deg,
        rgba(67, 185, 30, 0.08) 0%,
        rgba(67, 185, 30, 0) 100%
      );
      display: flex;
      align-items: center;
      padding: 20px 20px 20px 55px;
      margin-top: 5px;
      position: relative;
      .rank {
        width: 34px;
        height: 24px;
        position: absolute;
        top: 0px;
        left: 0px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .rank_0 {
        background-image: url('~@/assets/images/statistic/green_1.png');
      }
      .rank_1 {
        background-image: url('~@/assets/images/statistic/green_2.png');
      }
      .rank_2 {
        background-image: url('~@/assets/images/statistic/green_3.png');
      }
      .driverNumber {
        flex: 1 1 auto;
        font-size: 18px;
        font-weight: bold;
        color: #3d4050;
      }
      .num {
        font-size: 24px;
        font-family: Bahnschrift;
        font-weight: bold;
        color: #3d4050;
        span {
          font-size: 14px;
          font-weight: bold;
          color: #7e7f81;
        }
      }
      .ml20 {
        margin-left: 20px;
      }
    }
  }
}
</style>
