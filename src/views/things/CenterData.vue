<template>
  <div class="s-container">
    <ul class="s-container__list ly-flex-v ly-flex-pack-around">
      <li class="item-box box-1">
        <h5>实时接口调用量</h5>
        <div class="box-content">
          <div v-for="(item, index) in dataList1" :key="index" class="row-text ly-flex ly-flex-align-center">
            <p class="label">{{ item.title }}</p>
            <p class="count">
              <count-to class="count" :end-val="item.count" :decimal-places="0" />
            </p>
          </div>
        </div>
      </li>
      <li class="item-box box-2">
        <h5>实时数据存储量</h5>
        <div class="box-content">
          <div v-for="(item, index) in dataList2" :key="index" class="row-text ly-flex ly-flex-align-center">
            <p class="label">{{ item.title }}</p>
            <p class="count">
              <count-to class="count" :end-val="item.count" :decimal-places="0" />
            </p>
          </div>
        </div>
      </li>
      <li class="item-box box-3">
        <h5>实时上报数据量</h5>
        <div class="box-content">
          <div v-for="(item, index) in dataList3" :key="index" class="row-text ly-flex ly-flex-align-center">
            <p class="label">{{ item.title }}</p>
            <p class="count">
              <count-to class="count" :end-val="item.count" :decimal-places="0" />
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
      dataList1: [],
      dataList2: [],
      dataList3: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      // 实时数据存储量
      this.dataList2 = [{
        title: '数据库',
        count: 326559
      },{
        title: '全文索引',
        count: 302151
      },{
        title: '消息队列',
        count: 312134
      },{
        title: '内存库',
        count: 298276
      }];
      // 实时上报数据量
      this.dataList3 = [{
        title: '小黑盒A1便携款',
        count: 62551
      },{
        title: '小黑盒A2固线款',
        count: 59636
      },{
        title: '行车记录仪T1基础款',
        count: 51202
      }]
    },
    setData(data) {
      // 实时接口调用量
      this.dataList1 = data;
    },
    refreshData() {
      this.dataList2.forEach(el => {
        el.count += Math.round(Math.random()*10);
      })
      this.dataList3.forEach(el => {
        el.count += Math.round(Math.random()*10);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  // background: rgba(255, 255, 255, 0.1); // 辅助线
  &__list{
    width: 12rem;
    height: 100%;
    position: absolute;
    right: 1.9rem;
    top: 0;
    bottom: 0;
    z-index: 9;
    padding: 1.5rem 0 4rem;
    >.item-box{
      width: 12rem;
      height: 10rem;
      position: relative;
      >h5{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1.6rem;
        line-height: 1.6rem;
        font-size: 0.8rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        padding: 0 0.9rem;
      }
      >.box-content{
        height: 100%;
        padding: 2.25rem 0 0 1.1rem;
        >.row-text{
          line-height: 1.35rem;
          >.label{
            font-size: 0.7rem;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFFFFF;
            width: 4.2rem;
          }
          >.count{
            font-size: 0.7rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
      }
      &.box-1{
        background: url('~@/assets/images/things/box_1.png') no-repeat;
        background-size: 100% 100%;
        >h5{
          background: linear-gradient(0deg, rgba(169, 146, 215, 0.5) 0%, rgba(138, 105, 203, 0.5) 100%);
        }
        >.box-content{
          background: linear-gradient(0deg, rgba(169, 146, 215, 0.5) 0%, rgba(138, 105, 203, 0.5) 100%);
        }
      }
      &.box-2{
        background: url('~@/assets/images/things/box_2.png') no-repeat;
        background-size: 100% 100%;
        >h5{
          background: linear-gradient(0deg, rgba(5, 206, 227, 0.3) 0%, rgba(61, 243, 184, 0.3) 100%);
        }
        >.box-content{
          background: linear-gradient(0deg, rgba(5, 206, 227, 0.3) 0%, rgba(61, 243, 184, 0.3) 100%);
        }
      }
      &.box-3{
        background: url('~@/assets/images/things/box_3.png') no-repeat;
        background-size: 100% 100%;
        >h5{
          background: linear-gradient(0deg, rgba(89, 100, 241, 0.5) 0%, rgba(21, 171, 253, 0.5) 100%);
        }
        >.box-content{
          background: linear-gradient(0deg, rgba(89, 100, 241, 0.5) 0%, rgba(21, 171, 253, 0.5) 100%);
          >.row-text{
            >.label{
              width: 7.2rem;
            }
          }
        }
      }
    }
  }
}
</style>