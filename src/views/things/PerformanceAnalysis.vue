<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <!-- 3s绿色 3s-10s橙色 10s+红色 -->
      <li v-for="(item, index) in dataList" :key="index" :class="[{err: item.time > 10}, {warn: item.time <= 10 && item.time > 3}, {green: item.time <= 3}]" class="ly-flex ly-flex-pack-justify">
        <h5>{{ item.title }}</h5>
        <div class="row-text">
          调用次数：
          <count-to class="count" :end-val="item.count" :decimal-places="0" />
          <span>/</span>
          平均耗时：
          <count-to class="count" :end-val="item.time" :decimal-places="2" />s
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
export default {
  components: {
    CountTo
  },
  props: {

  },
  data() {
    return {
      dataList: [{
        title: '轨迹查询',
        count: 3265598,
        time: 2.14
      },{
        title: '位置查询',
        count: 3265598,
        time: 7.51
      },{
        title: '视频调阅',
        count: 3265598,
        time: 12.41
      },{
        title: '告警查询',
        count: 3265598,
        time: 0.68
      },{
        title: '指令下发',
        count: 3265598,
        time: 12.76
      }]
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
  &__list{
    height: 100%;
    padding: 1rem 0 2rem;
    >li{
      width: 100%;
      height: 1.65rem;
      line-height: 1.65rem;
      padding: 0 0.7rem 0 0.5rem;
      >h5{
        font-size: 0.7rem;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #FFFFFF;
      }
      >.row-text{
        font-size: 0.55rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        >span{
          margin: 0 0.25rem;
        }
      }
      &.err{
        background: linear-gradient(90deg, #782222, rgba(85, 31, 32, 0.3));
      }
      &.warn{
        background: linear-gradient(90deg, #785F2D, rgba(89, 72, 39, 0.3));
      }
      &.green{
        background: linear-gradient(90deg, #195549, rgba(35, 67, 52, 0.3));
      }
    }
  }
}
</style>