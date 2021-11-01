<template>
  <div class="s-container">
    <div class="s-container__list">
      <ul>
        <li v-for="(item, index) in dataList" :key="index" class="ly-flex-v ly-flex-pack-center">
          <p class="row-text ly-flex ly-flex-pack-justify">
            <span class="time">{{ parseTime(item.time) }}</span>
            <span class="name">{{ item.name }}</span>
          </p>
          <p class="row-content g-single-row">{{ item.content }}</p>
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
      dataList: [{
        time: '2019-08-22 17:25:02',
        name: '小黑盒A1便携款',
        content: '福州市mq集群在2019-08-22 17:25:02时间 ，节点数...'
      },{
        time: '2019-08-22 17:25:02',
        name: '小黑盒A1便携款',
        content: '福州市mq集群在2019-08-22 17:25:02时间 ，节点数...'
      },{
        time: '2019-08-22 17:25:02',
        name: '小黑盒A1便携款',
        content: '福州市mq集群在2019-08-22 17:25:02时间 ，节点数...'
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
  padding: 0.5rem 0;
  &__list{
    height: 100%;
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
      }
    }
  }
}
</style>