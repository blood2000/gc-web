<template>
  <div class="g-statistic">
    <!-- title -->
    <div class="header-box">
      <img class="header-box__title" src="~@/assets/images/statistic/title.png">
      <img class="header-box__left" src="~@/assets/images/statistic/bg_title_left.webp">
      <img class="header-box__right" src="~@/assets/images/statistic/bg_title_right.webp">
      <img class="header-box__block-left" src="~@/assets/images/statistic/block_top_left.webp">
      <img class="header-box__block-right" src="~@/assets/images/statistic/block_top_right.webp">
    </div>

    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top ly-border">
        <Title>用户总览<span>The user overview</span></Title>
        <div class="content-box ly-border">
          <UserOverView ref="UserOverViewRef" />
        </div>
      </div>
      <div class="ly-left-center ly-border">
        <Title :show-after="true" after-text="TOP5">地区分布<span>Regional distribution</span></Title>
        <div class="content-box ly-border">
          <RegionalDistribute />
        </div>
      </div>
      <div class="ly-left-bottom ly-border">
        <Title :show-after="true" after-text="TOP5">车辆类型<span>Vehicle type</span></Title>
        <div class="content-box ly-border">
          <VehicleType ref="VehicleTypeRef" />
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border ly-flex-v ly-flex-pack-justify">
      <TotalCount ref="TotalCount" />
      <Map ref="MapRef" />
      <RankingCard />
      <ScrollCard ref="ScrollCardRef" />
    </div>

    <!-- right -->
    <div class="ly-right ly-border">
      <div class="ly-right-top ly-border">
        <div class="ly-right-top-top ly-border">
          <Title>设备资产信息<span>Equipment asset information</span></Title>
          <div class="content-box ly-border">
            <DeviceAssetInfo />
          </div>
        </div>
        <div class="ly-right-top-bottom ly-border">
          <Title>设备类型占比<span>Device type accounted for</span></Title>
          <div class="content-box ly-border">
            <DeviceType ref="DeviceTypeRef" />
          </div>
        </div>
      </div>
      <div class="ly-right-center ly-border">
        <Title :show-after="true" after-text="TOP5">告警事件统计<span>The alarm event statistics</span></Title>
        <div class="content-box ly-border">
          <AlarmEvent />
        </div>
      </div>
      <div class="ly-right-bottom ly-border">
        <Title>告警信息<span>The alarm rate</span></Title>
        <div class="content-box ly-border">
          <AlarmInfo ref="AlarmInfoRef" />
        </div>
      </div>
    </div>

    <!-- background -->
    <img class="bg-img bg-bottom" src="~@/assets/images/statistic/bg_bottom.png" />
    <img class="bg-img bg-left" src="~@/assets/images/statistic/bg_left.png" />
    <img class="bg-img bg-right" src="~@/assets/images/statistic/bg_right.png" />
    <img class="bg-img bg-top-left" src="~@/assets/images/statistic/bg_top_left.png" />
    <img class="bg-img bg-top-right" src="~@/assets/images/statistic/bg_top_right.png" />
    <img class="bg-img bg-map" src="~@/assets/images/statistic/bg.png" />
    <!-- <div class="bg-img bg-circle" /> -->

    <!-- gif -->
    <video class="bg-img bg-circle" autoplay muted loop>
      <source src="~@/assets/images/statistic/bg_circle.mp4" type="video/mp4">
    </video>
    <img class="bg-img angle-bottom-left" src="~@/assets/images/statistic/angle_bottom_left.webp" />
    <img class="bg-img angle-bottom-right" src="~@/assets/images/statistic/angle_bottom_right.webp" />
    <img class="bg-img angle-top-left" src="~@/assets/images/statistic/angle_top_left.webp" />
    <img class="bg-img angle-top-right" src="~@/assets/images/statistic/angle_top_right.webp" />
    <img class="bg-img block-bottom-left" src="~@/assets/images/statistic/block_bottom_left.webp" />
    <img class="bg-img block-bottom-right" src="~@/assets/images/statistic/block_bottom_right.webp" />
  </div>
</template>

<script>
import { ThrottleFun } from '@/utils/index.js';
import Title from './components/title';
import Map from './Map.vue';
import UserOverView from './UserOverView.vue'; // 用户总览
import RegionalDistribute from './RegionalDistribute.vue'; // 地区分布
import VehicleType from './VehicleType.vue'; // 车辆类型
import DeviceAssetInfo from './DeviceAssetInfo.vue'; // 设备资产信息
import DeviceType from './DeviceType.vue'; // 设备类型占比
import AlarmEvent from './AlarmEvent.vue'; // 告警事件统计
import AlarmInfo from './AlarmInfo.vue'; // 告警信息
import TotalCount from './TotalCount.vue';
import RankingCard from './RankingCard.vue';
import ScrollCard from './ScrollCard.vue';
export default {
  name: 'Statistic',
  components: {
    Title,
    Map,
    UserOverView,
    RegionalDistribute,
    VehicleType,
    DeviceAssetInfo,
    DeviceType,
    AlarmEvent,
    AlarmInfo,
    TotalCount,
    RankingCard,
    ScrollCard
  },
  data() {
    return {
      wsurl: '/fmsweb/tempAlarm',
      websock: null,
      lockReconnect: false,
      timerReconnect: null,
      heartTimeout: null,
      serverTimeout: null
    };
  },
  mounted() {
    this.setHtmlFontSize();
    window.addEventListener('resize', this.resizeFun);
    this.createWebSocket();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun);
  },
  methods: {
    resizeFun() {
      const throttle = ThrottleFun(this.refreshChart, 300);
      throttle();
    },
    // 图表自适应
    refreshChart() {
      this.setHtmlFontSize();
      this.$refs.UserOverViewRef.refreshChart();
      this.$refs.VehicleTypeRef.refreshChart();
      this.$refs.DeviceTypeRef.refreshChart();
      this.$refs.MapRef.refreshChart();
    },
    // 计算根节点fontsize
    setHtmlFontSize() {
      // 设1rem = 40px
      // 192 = 3840 / 20
      // 96 = 1920 / 20
      // font-size: calc(100vw / 96);
      const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (!clientWidth) return;
      let size = clientWidth / 40;
      if (size < 96) size = 96;
      if (size > 192) size = 192;
      // console.log('clientWidth: ', clientWidth);
      // console.log('size: ', size);
      document.getElementsByTagName('html')[0].style.fontSize = `calc(100vw / ${size})`;
    },
    // 创建websocket
    createWebSocket() {
      try {
      console.log(process.env.VUE_APP_WS_PROTOCOL + process.env.VUE_APP_BASE_HOST + this.wsurl);
        this.websock = new WebSocket(process.env.VUE_APP_WS_PROTOCOL + process.env.VUE_APP_BASE_HOST + this.wsurl);
        // this.websock = new WebSocket('ws://192.168.1.18:8080/fmsweb/tempAlarm');
        this.initWebSocket();
      } catch (e) {
        console.log('catch', e);
        this.reconnect();
      }
    },
    initWebSocket() {
      this.websock.onmessage = (e) => {
        // 拿到pong说明当前连接是正常的
        if (e.data === 'pong') {
          // console.log('pong');
          this.heartCheck();
        } else if (e.data && e.data.length > 10) {
          this.setData(JSON.parse(e.data));
        }
      };
      this.websock.onopen = () => {
        console.log('连接成功', this.websock);
        this.heartCheck();
      };
      this.websock.onerror = () => {
        console.log('连接失败');
        this.reconnect();
      };
      this.websock.onclose = (e) => {
        console.log('断开连接', e);
        this.reconnect();
      };
    },
    // 重连
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      console.log('发起重连');
      this.lockReconnect = true;
      // 没连接上会一直重连，设置延迟
      this.timerReconnect && clearTimeout(this.timerReconnect);
      this.timerReconnect = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 3 * 1000);
    },
    // 心跳检测
    heartCheck() {
      this.heartTimeout && clearTimeout(this.heartTimeout);
      this.serverTimeout && clearTimeout(this.serverTimeout);
      this.heartTimeout = setTimeout(() => {
        // 发送一个心跳包
        // console.log('ping');
        this.websock.send('ping');
        // 计算答复的超时时间
        this.serverTimeout = setTimeout(() => {
          if (this.websock) this.websock.close();
          console.log('答复超时');
        }, 5 * 1000);
      }, 4 * 1000);
    },
    // 处理实时数据
    setData(dJson) {
      console.log('实时Json：', dJson);
      this.$refs.AlarmInfoRef.setData(dJson);
      this.$refs.ScrollCardRef.setData(dJson);
      this.$refs.TotalCount.setData(dJson);
      this.$refs.MapRef.setData(dJson);
    }
  }
}
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  // border: 0.05rem dashed rgba(255, 255, 255, 0.2);
}

// 设计稿大小：1920*1080
// 1rem = 40px;
.g-statistic {
  $width: 96rem;
  $width_left: 27.4rem;
  $width_right: 26.8rem;

  //base
  position: relative;
  color: #fff;
  font-size: 0.7rem;
  background-color: #040509;
  box-sizing: border-box;
  background: #040509;
  background-size: 100% 100%;

  //unSelect
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  //layout
  width: $width;
  height: 100%;
  overflow: hidden;
  padding: 5rem 3.85rem 3.85rem;
  .ly-left{
    width: $width_left;
    height: 100%;
    float: left;
    position: relative;
    z-index: 9;
    padding-top: 0.85rem;
    padding-left: 3rem;
    .ly-left-top{
      height: 40.3%;
    }
    .ly-left-center{
      height: 35.3%;
    }
    .ly-left-bottom{
      height: 24.4%;
    }
  }
  .ly-center{
    position: relative;
    width: calc(100% - #{$width_left} - #{$width_right});
    height: 100%;
    float: left;
    position: relative;
    z-index: 9;
    padding: 0 1rem;
  }
  .ly-right{
    width: $width_right;
    height: 100%;
    float: right;
    position: relative;
    z-index: 9;
    padding-top: 0.85rem;
    .ly-right-top{
      height: 38%;
      .ly-right-top-top{
        height: 37%;
      }
      .ly-right-top-bottom{
        height: 63%;
      }
    }
    .ly-right-center{
      height: 27%;
    }
    .ly-right-bottom{
      height: 35%;
    }
  }

  // background
  .bg-img{
    z-index: 2;
    position: absolute;
    &.bg-bottom{
      width: 100%;
      height: 7.45rem;
      left: 0;
      right: 0;
      bottom: 0.55rem;
    }
    &.bg-left{
      width: 7rem;
      height: 87%;
      top: 5.15rem;
      left: 0.55rem;
    }
    &.bg-right{
      width: 7rem;
      height: 87%;
      top: 5.15rem;
      right: 0.55rem;
    }
    &.bg-top-left{
      width: 15.4rem;
      height: 4.8rem;
      top: 0;
      left: 1.8rem;
    }
    &.bg-top-right{
      width: 15.4rem;
      height: 4.8rem;
      top: 0;
      right: 1.8rem;
    }
    &.bg-map{
      width: 100%;
      top: 11.05rem;
      left: 0;
      right: 0;
      z-index: 0;
    }
    &.bg-circle{
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 1;
      // background: url('~@/assets/images/statistic/bg_circle.png') no-repeat center center;
      // background-size: cover;
      object-fit: cover;
    }
    &.angle-bottom-left{
      width: 1.95rem;
      height: 1.95rem;
      right: 5rem;
      bottom: 1.65rem;
    }
    &.angle-bottom-right{
      width: 2.4rem;
      height: 1.85rem;
      left: 3.8rem;
      bottom: 1.7rem;
    }
    &.angle-top-left{
      width: 2rem;
      height: 2rem;
      left: 2rem;
      top: 1.5rem;
    }
    &.angle-top-right{
      width: 1.825rem;
      height: 2rem;
      right: 2.65rem;
      top: 1.65rem;
    }
    &.block-bottom-left{
      width: 2.275rem;
      height: 0.8rem;
      bottom: 0.6rem;
      left: 15.6rem;
    }
    &.block-bottom-right{
      width: 2.2rem;
      height: 0.775rem;
      bottom: 0.6rem;
      right: 16.6rem;
    }
  }

  // style
  .content-box{
    height: calc(100% - 1.9rem);
  }
  .header-box {
    position: absolute;
    top: 0.35rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    width: 27rem;
    height: 3.175rem;
    background: url('~@/assets/images/statistic/bg_title.png') no-repeat;
    background-size: 100% 100%;
    >.header-box__title{
      width: 11.35rem;
      height: 1.625rem;
      position: absolute;
      left: 50%;
      margin-left: -5.675rem;
      top: 0.7rem;
    }
    &::before, &::after{
      content: '';
      width: 25.575rem;
      height: 2.7rem;
      position: absolute;
      top: 0.4rem;
      z-index: 1;
    }
    &::before{
      left: -22.4rem;
      background: url('~@/assets/images/statistic/bg_title_left.png') no-repeat;
      background-size: 100% 100%;
    }
    &::after{
      right: -22.6rem;
      background: url('~@/assets/images/statistic/bg_title_right.png') no-repeat;
      background-size: 100% 100%;
    }
    >.header-box__left{
      width: 12.9rem;
      height: 1.6rem;
      position: absolute;
      top: 0;
      left: -10rem;
    }
    >.header-box__right{
      width: 14.525rem;
      height: 1.6rem;
      position: absolute;
      top: 0;
      right: -9.2rem;
    }
    >.header-box__block-left{
      width: 2.45rem;
      height: 0.825rem;
      position: absolute;
      top: 2.6rem;
      left: 2.3rem;
    }
    >.header-box__block-right{
      width: 2.4rem;
      height: 0.675rem;
      position: absolute;
      top: 2.75rem;
      right: 2.7rem;
    }
  }
}
</style>
