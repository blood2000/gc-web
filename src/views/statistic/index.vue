<template>
  <div class="g-statistic">
    <!-- title -->
    <div class="header-box">
      <img src="~@/assets/images/statistic/title.png">
    </div>

    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top ly-border">
        <Title>用户总览<span>The user overview</span></Title>
        <div class="content-box ly-border">内容</div>
      </div>
      <div class="ly-left-center ly-border">
        <Title :show-after="true" after-text="TOP5">地区分布<span>Regional distribution</span></Title>
        <div class="content-box ly-border">内容</div>
      </div>
      <div class="ly-left-bottom ly-border">
        <Title :show-after="true" after-text="TOP8">车辆类型<span>Vehicle type</span></Title>
        <div class="content-box ly-border">内容</div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border ly-flex-v ly-flex-pack-justify">

    </div>

    <!-- right -->
    <div class="ly-right ly-border">
      <div class="ly-right-top ly-border">
        <div class="ly-right-top-top ly-border">
          <Title>设备资产信息<span>Equipment asset information</span></Title>
          <div class="content-box ly-border">内容</div>
        </div>
        <div class="ly-right-top-bottom ly-border">
          <Title>设备类型占比<span>Device type accounted for</span></Title>
          <div class="content-box ly-border">内容</div>
        </div>
      </div>
      <div class="ly-right-center ly-border">
        <Title :show-after="true" after-text="TOP8">告警事件统计<span>The alarm event statistics</span></Title>
        <div class="content-box ly-border">内容</div>
      </div>
      <div class="ly-right-bottom ly-border">
        <Title>告警信息<span>The alarm rate</span></Title>
        <div class="content-box ly-border">内容</div>
      </div>
    </div>

    <!-- background -->
    <img class="bg-img bg-bottom" src="~@/assets/images/statistic/bg_bottom.png" />
    <img class="bg-img bg-left" src="~@/assets/images/statistic/bg_left.png" />
    <img class="bg-img bg-right" src="~@/assets/images/statistic/bg_right.png" />
    <img class="bg-img bg-top-left" src="~@/assets/images/statistic/bg_top_left.png" />
    <img class="bg-img bg-top-right" src="~@/assets/images/statistic/bg_top_right.png" />
    <img class="bg-img bg-map" src="~@/assets/images/statistic/bg.png" />
  </div>
</template>

<script>
import { http_request } from "@/api";
import { ThrottleFun } from '@/utils/index.js';
import Title from './components/title';
import Map from './Map.vue';
export default {
  name: 'Statistic',
  components: {
    Title,
    Map
  },
  data() {
    return {
      
    };
  },
  mounted() {
    this.setHtmlFontSize();
    window.addEventListener('resize', this.resizeFun);
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
      // ...
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
    }
  }
}
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  border: 0.05rem dashed rgba(255, 255, 255, 0.2);
}

// 设计稿大小：1920*1080
// 1rem = 40px;
.g-statistic {
  $width: 96rem;
  $width_left: 27.8rem;
  $width_right: 26rem;

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
  padding: 5.4rem 3.85rem 3.85rem;
  .ly-left{
    width: $width_left;
    height: 100%;
    float: left;
    position: relative;
    z-index: 9;
    padding-top: 0.45rem;
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
  }
  .ly-right{
    width: $width_right;
    height: 100%;
    float: right;
    position: relative;
    z-index: 9;
    padding-top: 0.45rem;
    .ly-right-top{
      height: 38%;
      padding-right: 2.4rem;
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
    z-index: 1;
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
    width: 26.95rem;
    height: 3.4rem;
    background: url('~@/assets/images/statistic/bg_title.png') no-repeat;
    background-size: 100% 100%;
    >img{
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
      left: -23.2rem;
      background: url('~@/assets/images/statistic/bg_title_left.png') no-repeat;
      background-size: 100% 100%;
    }
    &::after{
      right: -23.2rem;
      background: url('~@/assets/images/statistic/bg_title_right.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>