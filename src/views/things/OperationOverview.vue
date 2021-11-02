<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <li class="list-item ly-flex ly-flex-pack-justify" v-for="(item, index) in dataList" :key="index">
        <img :src="require('@/assets/images/things/before_'+(index+1)+'.png')" />
        <div class="info-box ly-flex-v ly-flex-pack-justify">
          <h5>{{ item.title }}</h5>
          <div class="ly-flex ly-flex-pack-justify ly-flex-align-center">
            <p class="row-text row-blue ly-flex ly-flex-align-center">
              正常
              <count-to class="count" :end-val="item.count" :decimal-places="0" />
              <img src="~@/assets/images/things/icon_add.png" />
              <span class="percent">{{ item.percent }}</span>
            </p>
            <p class="row-text row-red ly-flex ly-flex-align-center">
              异常
              <count-to class="count" :end-val="item.errCount" :decimal-places="0" />
              <img src="~@/assets/images/things/icon_reduce.png" />
              <span class="percent">{{ item.errPercent }}</span>
            </p>
          </div>
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
        title: '服务器集群',
        count: 17,
        percent: '10%',
        errCount: 10,
        errPercent: '10%'
      },{
        title: '服务节点',
        count: 17,
        percent: '10%',
        errCount: 10,
        errPercent: '10%'
      },{
        title: '服务容器',
        count: 17,
        percent: '10%',
        errCount: 10,
        errPercent: '10%'
      },{
        title: '接入设备',
        count: 17,
        percent: '10%',
        errCount: 10,
        errPercent: '10%'
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
    padding: 1rem 0 1.5rem;
    >.list-item{
      width: 100%;
      height: 2.425rem;
      >img{
        width: 2.425rem;
        height: 2.425rem;
      }
      >.info-box{
        width: calc(100% - 3.2rem);
        height: 100%;
        >h5{
          font-size: 0.7rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 0.8rem;
        }
        .row-text{
          width: 50%;
          font-size: 0.6rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          >img{
            width: 0.225rem;
            height: 0.55rem;
            margin: 0 0.375rem;
          }
          >.count{
            font-size: 0.8rem;
            font-weight: bold;
            margin-left: 1rem;
          }
          &.row-blue{
            color: #2D85FF;
          }
          &.row-red{
            color: #FF6B6B;
          }
        }
      }
    }
  }
}
</style>