<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex ly-flex-pack-justify ly-flex-align-center">
      <li>
        <p class="value">
          <count-to :end-val="23651" :decimal-places="0" />
        </p>
        <p class="label">设备总量</p>
      </li>
      <li>
        <p class="value">
          <count-to :end-val="23651" :decimal-places="0" />
        </p>
        <p class="label">设备激活量</p>
      </li>
      <li>
        <p class="value">
          <count-to :end-val="23651" :decimal-places="0" />
        </p>
        <p class="label">设备在线量</p>
      </li>
      <li>
        <p class="value">
          <count-to :end-val="23651" :decimal-places="0" />
        </p>
        <p class="label">设备离线量</p>
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
      
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {

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
    padding-right: 0.5rem;
    >li{
      width: calc(25% - 1.09rem);
      text-align: right;
      position: relative;
      >.value{
        font-size: 0.85rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #F2E9FA;
        line-height: 1.2rem;
      }
      >.label{
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #937D8A;
        transform: scale(0.9);
        transform-origin: 100% 0;
        line-height: 1.2rem;
      }
      &:not(:last-child){
        margin-right: 1.45rem;
      }
      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 0.2rem;
        width: 1.05rem;
        height: 0.9rem;
        background: url('~@/assets/images/statistic/count_before.png') no-repeat;
        background-size: 100% 100%;
      }
      &::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 0.475rem;
        background: url('~@/assets/images/statistic/count_bottom.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>