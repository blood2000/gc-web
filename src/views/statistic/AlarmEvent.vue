<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <li v-for="(item, index) in dataList" :key="index" class="ly-flex ly-flex-pack-justify ly-flex-align-center">
        <h5 class="ly-flex ly-flex-align-center">
          <span class="g-single-row">{{ item.alarmTypeName }}</span>
        </h5>
        <div class="line-content ly-flex ly-flex-align-center">
          <div v-if="item.number / maxCount * 100 > 1" class="line" :style="`width: calc(${item.number / maxCount * 100}% - 4.5rem);`" />
          <!-- 避免百分比太小不显示 -->
          <div v-else class="line" :style="`width: 1%;`" />

          <div class="value">
            <count-to :end-val="item.number" :decimal-places="0" />
            <span class="unit">次</span>
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
      dataList: [],
      maxCount: 1,
      queryParams: {
        pageNum: 1,
        pageSize: 5
      },
      // 每5分钟刷新一次
      time: 5 * 60 * 1000,
      timer: null
    };
  },
  beforeDestroy() {
    this.clearTimer();
  },
  mounted() {
    this.getData();
    this.setTimer();
  },
  methods: {
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.getData();
      }, this.time);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    getData() {
      const obj = {
        moduleName: "http_statistic",
        method: "get",
        url_alias: "alarmTypeStatistics",
        data: this.queryParams
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.dataList = res.data.rows || [];
          this.dataList.forEach(el => {
            if (el.number > this.maxCount) {
              this.maxCount = el.number;
            }
          })
        } else {
          this.dataList = [];
        }
      })
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
      padding-right: 0.8rem;
      height: 20%;
      >h5{
        height: 100%;
        width: 5rem;
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFE6F4;
        transform: scale(0.9);
        >span{
          display: block;
        }
      }
      >.line-content{
        width: calc(100% - 4.5rem);
        height: 100%;
        border-bottom: 1px solid rgba(130, 85, 168, 0.26);
        >.line{
          width: calc(100% - 5rem);
          height: 0.25rem;
          background: linear-gradient(90deg, #235FDA, #AF21E4);
        }
        >.value{
          font-size: 0.7rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
          margin-left: 0.6rem;
          .unit{
            display: inline-block;
            font-size: 0.6rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFE4F3;
            transform: scale(0.9);
            margin-left: 0.1rem;
          }
        }
      }
      &:first-child{
        >.line-content{
          border-top: 1px solid rgba(130, 85, 168, 0.26);
        }
      }
    }
  }
}
</style>