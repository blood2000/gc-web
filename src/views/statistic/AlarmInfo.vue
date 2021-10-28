<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <li v-for="(item, index) in dataList" :key="index" class="ly-flex ly-flex-pack-justify">
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
</template>

<script>
import { http_request } from "@/api";
export default {
  props: {

  },
  data() {
    return {
      dataList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 4
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  padding-top: 0.8rem;
  &__list{
    width: calc(100% - 0.9rem);
    height: 100%;
    >li{
      background: linear-gradient(to right, rgba(23, 6, 18, 0.77), rgba(23, 6, 18, 0.77), rgba(23, 6, 18, 0.77),  rgba(23, 6, 18, 0.66), rgba(23, 6, 18, 0.4));
      border-radius: 8px;
      padding: 0.2rem 0 0.3rem 0.2rem;
      >h5{
        width: 4.15rem;
        line-height: 1.05rem;
        transform: scale(0.9);
        >.index{
          width: 0.8rem;
          height: 0.75rem;
          margin-right: 0.2rem;
          vertical-align: middle;
        }
        >.title{
          font-size: 0.55rem;
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
        width: calc(100% - 4.15rem);
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
    }
  }
}
</style>