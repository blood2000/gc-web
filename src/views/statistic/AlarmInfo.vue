<template>
  <div class="s-container">
    <div class="s-scroll-box">
      <ul :class="{isRoll: isRoll}" class="s-container__list ly-flex-v ly-flex-pack-justify">
        <li v-for="(item, index) in dataList" :key="index" :class="{isOpacity: isOpacity}" class="ly-flex ly-flex-pack-justify">
          <h5 class="g-single-row" :class="`alarm_type_${item.alarmLevel}`">
            <img class="index" :src="require(`@/assets/images/statistic/alarm_${item.alarmLevel}.png`)" />
            <span class="title">{{ item.alarmTypeName }}</span>
          </h5>
          <div class="info-content">
            <p class="g-single-row">{{ item.name }} {{ item.licenseNumber }} {{ item.orgName }}</p>
            <div class="ly-flex ly-flex-pack-justify">
              <p class="g-single-row">{{ item.alarmDescribe ? item.alarmDescribe : '暂无描述' }}</p>
              <p>{{ parseTime(item.alarmTime) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { http_request } from "@/api";
export default {
  props: {

  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 4
      },
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
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "alarmInfo",
        data: this.queryParams
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.dataList = res.data.rows || [];
        } else {
          this.dataList = [];
        }
      })
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
        this.dataList.splice(4);
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
  padding-top: 0.8rem;
  overflow: hidden;
  .s-scroll-box{
    height: 100%;
    overflow: hidden;
  }
  .s-container__list{
    width: calc(100% - 0.9rem);
    height: 100%;
    >li{
      background: linear-gradient(to right, rgba(23, 6, 18, 0.77), rgba(23, 6, 18, 0.77), rgba(23, 6, 18, 0.77),  rgba(23, 6, 18, 0.66), rgba(23, 6, 18, 0.4));
      border-radius: 8px;
      padding: 0.2rem 0 0.3rem 0.2rem;
      >h5{
        width: 5rem;
        line-height: 1.05rem;
        transform: scale(0.9);
        >.index{
          width: 0.8rem;
          height: 0.75rem;
          margin-right: 0.2rem;
          vertical-align: middle;
        }
        >.title{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: bold;
          vertical-align: middle;
        }
        &.alarm_type_1{
          >.title{
            color: #F93B9E;
          }
        }
        &.alarm_type_2{
          >.title{
            color: #9C39F7;;
          }
        }
        &.alarm_type_3{
          >.title{
            color: #3B52F4;
          }
        }
      }
      >.info-content{
        width: calc(100% - 5rem);
        >p, >div{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1.05rem;
          transform: scale(0.95);
        }
        >div>p:first-child{
          width: calc(100% - 6rem);
        }
        >div>p:last-child{
          width: 6rem;
          text-align: right;
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(227, 195, 218, 0.33);
        }
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
      transform: translateY(26.5%);
      transition: transform 0.4s;
    }
  }
}
</style>