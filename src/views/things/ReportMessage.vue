<template>
  <div class="s-container">
    <div class="s-container__list">
      <ul :class="{isRoll: isRoll}">
        <li v-for="(item, index) in dataList" :key="index" :class="{isOpacity: isOpacity}" class="ly-flex-v ly-flex-pack-center">
          <p class="row-text ly-flex ly-flex-pack-justify">
            <span class="time">{{ parseTime(item.time) }}</span>
            <span class="name">{{ item.name }}</span>
          </p>
          <!-- 【{类型}】产生于 {时间} ，来自设备 {设备号} -->
          <p class="row-content g-single-row">{{ `【${item.type}】产生于${parseTime(item.time)} ，来自设备${item.device}` }}</p>
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
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.dataList = [{
        time: this.parseTime(new Date()),
        name: '小黑盒A1便携款',
        type: '超速预警',
        device: '868120274638466'
      },{
        time: this.parseTime(new Date().getTime() - 8000),
        name: '小黑盒A1便携款',
        type: '接打电话报警',
        device: '868120274638466'
      },{
        time: this.parseTime(new Date().getTime() - 11000),
        name: '超好运小黑盒A2固线款',
        type: '路线偏离报警 ',
        device: '868120274638466'
      }];
    },
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
        this.dataList.splice(3);
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
  height: 100%;
  padding: 0.5rem 0;
  overflow: hidden;
  &__list{
    height: 100%;
    overflow: hidden;
    >ul{
      height: 100%;
      >li{
        height: 33.3%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        >.row-text{
          font-size: 0.7rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #2D85FF;
          line-height: 1.5rem;
          >.name{
            font-weight: bold;
          }
        }
        >.row-content{
          line-height: 1.5rem;
          font-size: 0.7rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
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
      &.isRoll{
        transform: translateY(33.3%);
        transition: transform 0.4s;
      }
    }
  }
}
</style>