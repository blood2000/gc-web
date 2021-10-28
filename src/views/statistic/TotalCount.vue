<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex ly-flex-pack-justify ly-flex-align-center ly-flex-w">
      <li class="ly-flex">
        <p class="label">用户量</p>
        <p class="value">
          <count-to :end-val="form.userTotal" :decimal-places="0" />
          <!-- <span class="unit">万</span> -->
        </p>
      </li>
      <li class="ly-flex">
        <p class="label">设备量</p>
        <p class="value">
          <count-to :end-val="form.deviceTotal" :decimal-places="0" />
        </p>
      </li>
      <li class="ly-flex" style="width: 29%">
        <p class="label">降低事故率</p>
        <p class="value">
          <count-to :end-val="form.reduceAccidents" :decimal-places="0" />
          <span class="unit">%</span>
        </p>
      </li>
      <li class="ly-flex">
        <p class="label">高危告警量</p>
        <p class="value">
          <count-to :end-val="form.highRiskAlarmTotal" :decimal-places="0" />
        </p>
      </li>
      <li class="ly-flex">
        <p class="label">中危告警量</p>
        <p class="value">
          <count-to :end-val="form.seriousAlarmTotal" :decimal-places="0" />
        </p>
      </li>
      <li class="ly-flex" style="width: 29%">
        <p class="label">一般告警量</p>
        <p class="value">
          <count-to :end-val="form.commonlyAlarmTotal" :decimal-places="0" />
        </p>
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
      form: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "totalScreen"
      };
      http_request(obj).then((res) => {
        this.form = res.data || {};
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 16.8%;
  &__list{
    height: 100%;
    >li{
      width: 33%;
      text-align: left;
      position: relative;
      padding: 0.9rem 0 0.95rem;
      line-height: 1.23rem;
      background: url('~@/assets/images/statistic/count_bg.png') no-repeat 0 0.9rem;
      background-size: 5.15rem 1.23rem;
      >.label{
        width: 4.5rem;
        font-size: 0.65rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #E5D4F4;
      }
      >.value{
        font-size: 1.05rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #FFFFFF;
        >.unit{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #B3A2C1;
          margin-left: 0.2rem;
        }
      }
      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 0rem;
        width: 60%;
        height: 0.725rem;
        background: url('~@/assets/images/statistic/double_line_top.png') no-repeat;
        background-size: 100% 100%;
      }
      &::after{
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 60%;
        height: 0.725rem;
        background: url('~@/assets/images/statistic/double_line_bottom.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>