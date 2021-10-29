<template>
  <div class="s-container">
    <div class="s-scroll-box">
      <ul :class="{isRoll: isRoll}" class="s-container__list">
        <li v-for="(item, index) in dataList" :key="index" :class="{isOpacity: isOpacity}" class="ly-flex ly-flex-pack-justify ly-flex-align-center">
          <p class="g-single-row ly-flex ly-flex-align-center">
            <img src="~@/assets/images/statistic/before.png" />
            <span style="font-weight: 700">{{ `[ ${item.name} ]` }}</span>
            <span>{{ item.licenseNumber }}</span>
            <span>{{ item.address }}</span>
          </p>
          <span>{{ parseTime(item.alarmTime, '{h}:{i}:{s}') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      dataList: [],
      storageList: [], // 缓存数据
      storageTimer: null,
      isRoll: false,
      rollTimer: null,
      isOpacity: false,
      opacityTimer: false
    };
  },
  beforeDestroy() {
    if (this.storageTimer) this.clearReadStorage();
  },
  methods: {
    setData(data) {
      // 缓存数据
      this.storageList.push(data);
      // 开启缓存查询
      this.readStorage();
      // 接收数据，最快0.6s刷一条数据
      this.rollCard();
    },
    rollCard() {
      if (this.rollTimer || this.opacityTimer) return;
      this.isRoll = true;
      this.rollTimer = setTimeout(() => {
        this.isRoll = false;
        this.startAnimation();
        this.clearAnimation();
        // 从缓存读取数据
        this.dataList.unshift(this.storageList[0]);
        this.dataList.splice(1);
        this.storageList.splice(0, 1);
        // 保证一个完整的动画
        this.rollTimer = null;
      }, 0.4 * 1000);
    },
    startAnimation() {
      this.isOpacity = true;
    },
    clearAnimation() {
      this.opacityTimer = setTimeout(() => {
        this.isOpacity = false;
        this.opacityTimer = null;
      }, 0.2 * 1000);
    },
    // 定时访问缓存里面是否还有数据
    readStorage() {
      if (this.storageList.length === 0) {
        this.clearReadStorage();
        return;
      }
      // 保证当前有且只有一个定时器在工作
      if (this.storageTimer) return;
      this.storageTimer = setInterval(() => {
        if (this.storageList.length > 0) {
          this.rollCard();
        }
      }, 0.4 * 1000);
    },
    clearReadStorage() {
      clearInterval(this.storageTimer);
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 1.6rem;
  width: 18.75rem;
  overflow: hidden;
  position: absolute;
  bottom: 7.1rem;
  left: 1.2rem;
  .s-scroll-box{
    height: 1.6rem;
    overflow: hidden;
  }
  .s-container__list{
    height: 1.6rem;
    >li{
      height: 1.6rem;
      line-height: 1.6rem;
      background: url('~@/assets/images/statistic/tip_bg.png') no-repeat;
      background-size: 100% 100%;
      font-size: 0.6rem;
      color: #fff;
      >p{
        height: 1.6rem;
        line-height: 1.6rem;
        transform: scale(0.9);
        font-family: PingFang SC;
        >img{
          width: 1.025rem;
          height: 0.9rem;
        }
        >span{
          margin-left: 0.4rem;
        }
      }
      >span{
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFE6F4;
        transform: scale(0.9);
      }

      // 动画
      &.isOpacity:first-child{
        animation: is-opacity 0.2s;
      }
      @keyframes is-opacity {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
    // 动画
    transform: translateY(0);
    &.isRoll{
      transform: translateY(1.6rem);
      transition: transform 0.4s;
    }
  }
}
</style>