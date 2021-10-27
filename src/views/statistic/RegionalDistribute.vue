<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <li v-for="(item, index) in dataList" :key="index" class="ly-flex ly-flex-pack-justify">
        <h5>
          <span class="index">{{ index + 1 }}</span>
          <span class="title">{{ item.cityName }}</span>
        </h5>
        <div class="count-content ly-flex ly-flex-pack-justify">
          <div class="count-content-item">
            <p class="label">企业</p>
            <p class="value">
              <count-to :end-val="item.companyCount" :decimal-places="0" />
            </p>
          </div>
          <div class="count-content-item">
            <p class="label">车队</p>
            <p class="value">
              <count-to :end-val="item.fmsCount" :decimal-places="0" />
            </p>
          </div>
          <div class="count-content-item">
            <p class="label">车辆</p>
            <p class="value">
              <count-to :end-val="item.vehicleCount" :decimal-places="0" />
            </p>
          </div>
          <div class="count-content-item" style="width: 20%">
            <p class="label">司机</p>
            <p class="value">
              <count-to :end-val="item.driverCount" :decimal-places="0" />
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { http_request } from "@/api";
import CountTo from '@/components/CountTo';
export default {
  components: {
    CountTo
  },
  props: {

  },
  data() {
    return {
      dataList: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.dataList = [{
        cityName: '福建',
        companyCount: 100,
        fmsCount: 100,
        vehicleCount: 100,
        driverCount: 100
      },{
        cityName: '福建',
        companyCount: 100,
        fmsCount: 100,
        vehicleCount: 100,
        driverCount: 100
      },{
        cityName: '福建',
        companyCount: 100,
        fmsCount: 100,
        vehicleCount: 100,
        driverCount: 100
      },{
        cityName: '福建',
        companyCount: 100,
        fmsCount: 100,
        vehicleCount: 100,
        driverCount: 56664
      },{
        cityName: '福建',
        companyCount: 100,
        fmsCount: 100,
        vehicleCount: 100,
        driverCount: 56664
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  padding: 0.8rem 0;
  &__list{
    height: 100%;
    >li{
      >h5{
        width: 6rem;
        >.index{
          display: inline-block;
          width: 1.15rem;
          height: 1.25rem;
          line-height: 1.1rem;
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 500;
          text-align: center;
          color: #FFFFFF;
          transform: scale(0.9);
          padding-right: 0.1rem;
          background: url('~@/assets/images/statistic/index_before.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 0.25rem;
        }
        >.title{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #F2E9FA;
          position: relative;
          padding: 0 0.25rem;
          &::after{
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -0.05rem;
            width: 100%;
            height: 0.175rem;
            background: rgba(212, 54, 226, 0.27);
            z-index: 0;
          }
          
        }
      }
      >.count-content{
        width: calc(100% - 6rem);
        .count-content-item{
          width: 25%;
          >.label{
            font-size: 0.6rem;
            font-family: PingFang SC;
            font-weight: 300;
            color: #FFE6F4;
            transform: scale(0.95);
            transform-origin: 0 50%;
          }
          >.value{
            font-size: 0.7rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
          }
        }
      }
      &:first-child{
        >h5{
          >.index{
            background: url('~@/assets/images/statistic/index_before_first.png') no-repeat;
            background-size: 100% 100%;
          }
          >.title{
            &::after{
              background: rgba(47, 65, 155, 0.37);
            }
          }
        }
      }
    }
  }
}
</style>