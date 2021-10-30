<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex ly-flex-pack-justify">
      <li style="width: 34.4%">
        <h5>组织告警排行</h5>
        <div class="content-box">
          <div v-for="(item, index) in warnList" :key="index" class="content-item ly-flex ly-flex-pack-justify">
            <span class="text g-single-row">{{ item.orgName }}</span>
            <count-to class="count" :end-val="item.number" :decimal-places="0" />
          </div>
        </div>
      </li>
      <li style="width: 43.9%">
        <h5>违规车辆排行</h5>
        <div class="content-box">
          <div v-for="(item, index) in vehicleList" :key="index" class="content-item ly-flex ly-flex-pack-justify">
            <p class="text g-single-row">
              {{ item.licenseNumber }}
              <span v-if="item.vehicleTypeName && item.vehicleTypeName !== ''" class="small-card type2">{{ item.vehicleTypeName }}</span>
            </p>
            <count-to class="count" :end-val="item.number" :decimal-places="0" />
          </div>
        </div>
      </li>
      <li style="width: 21.7%">
        <h5>违规司机排行</h5>
        <div class="content-box">
          <div v-for="(item, index) in driverList" :key="index" class="content-item ly-flex ly-flex-pack-justify">
            <span class="text g-single-row">{{ item.name }}</span>
            <count-to class="count" :end-val="item.number" :decimal-places="0" />
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
      queryParams: {
        pageNum: 1,
        pageSize: 3
      },
      warnList: [],
      vehicleList: [],
      driverList: []
    };
  },
  mounted() {
    this.getWarnData();
    this.getVehicleData();
    this.getDriverData();
  },
  methods: {
    getWarnData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "organizationAlarm",
        data: this.queryParams
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.warnList = res.data.rows || [];
        } else {
          this.warnList = [];
        }
      })
    },
    getVehicleData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "illegalVehicle",
        data: this.queryParams
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.vehicleList = res.data.rows || [];
        } else {
          this.vehicleList = [];
        }
      })
    },
    getDriverData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "illegalDriver",
        data: this.queryParams
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.driverList = res.data.rows || [];
        } else {
          this.driverList = [];
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 5.2rem;
  &__list{
    height: 100%;
    >li{
      width: 33%;
      height: 100%;
      >h5{
        height: 1rem;
        line-height: 1rem;
        font-size: 0.65rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFEDF7;
        text-align: center;
        position: relative;
        &::before{
          content: '';
          width: 1.05rem;
          height: 0.2rem;
          position: absolute;
          top: 0.4rem;
          left: 50%;
          transform: translateX(-3.3rem);
          background: url('~@/assets/images/statistic/pot_left.png') no-repeat;
          background-size: 100% 100%;
        }
        &::after{
          content: '';
          width: 1.05rem;
          height: 0.2rem;
          position: absolute;
          top: 0.4rem;
          right: 50%;
          transform: translateX(3.3rem);
          background: url('~@/assets/images/statistic/pot_right.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      >.content-box{
        height: 4.2rem;
        .content-item{
          height: 1.4rem;
          line-height: 1.4rem;
          position: relative;
          padding-left: 0.6rem;
          background: url('~@/assets/images/statistic/card_before.png') no-repeat 0 center;
          background-size: 0.375rem 0.275rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #FFE6F4;
          .text{
            display: inline-block;
            font-size: 0.6rem;
            transform: scale(0.9);
            transform-origin: 0 48%;
            width: calc(100% - 2rem);
            .small-card{
              width: 0.9rem;
              height: 0.55rem;              
              border-radius: 3px;
              text-align: center;
              padding: 0 0.2rem;
              &.type1{
                border: 1px solid rgba(198, 180, 255, 0.55);
                color: rgba(198, 180, 255, 1);
              }
              &.type2{
                border: 1px solid rgba(181, 136, 217, 0.55);
                color: rgba(181, 136, 217, 1);
              }
              margin-left: 0.2rem;
            }
          }
          .count{
            font-size: 0.65rem;
            font-family: PingFang SC;
            font-weight: bold;
            color: #F4F4F4;
          }
          &:not(:last-child){
            &::after{
              content: '';
              position: absolute;
              left: 0.6rem;
              right: 0;
              bottom: 0;
              height: 1px;
              background: rgba(192, 90, 150, 0.18);
            }
          }
        }
      }
      &:not(:first-child){
        padding-left: 0.9rem;
      }
      &:not(:last-child){
        padding-right: 0.9rem;
        .content-box{
          position: relative;
          &::after{
            content: '';
            position: absolute;
            right: -1rem;
            top: 10%;
            bottom: 10%;
            width: 1px;
            background: linear-gradient(180deg, rgba(245, 154, 207, 0), rgba(245, 154, 207, 0.4), rgba(245, 154, 207, 0));
          } 
        }
      }
    }
  }
}
</style>