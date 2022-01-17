<template>
  <div class="stealing-coal-card" :class="['level-' + level]" @click="$emit('click')">
    <div class="stealing-coal-card-title"></div>
    <div class="stealing-coal-card-time">2021-03-04 22:23:12</div>
    <div class="stealing-coal-card-content">
      <div class="stealing-coal-card-content-car">
        <span class="stealing-coal-card-content-car-id">0001</span>
        闽A54772
      </div>
      <div class="stealing-coal-card-address">福州市台江区东滨路1号富邦总部大楼起点告警地址</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StealingCoalWarnCard",
  props: {
    cardInfo: {
      type: Object
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.stealing-coal-card {
  position: relative;
  width: 23%;
  height: 130px;
  background: url("../../../../assets/images/stealingcoal/card-warning-1-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #EF6969;
  margin: 0 1% 20px 1%;
  cursor: pointer;
  &-title {
    background: url("../../../../assets/images/stealingcoal/card-title-warning-1.png") no-repeat;
    height: 28px;
    width: 226px;
    margin-top: 15px;
  }
  &-time {
    position: absolute;
    right: 20px;
    top: 15px;
    line-height: 28px;
    font-weight: bold;
  }
  &-content {
    padding: 15px 15px;
    font-size: 14px;
    color: #3D4050;
    font-weight: 400;
    &-car {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 6px;
      &-id {
        font-size: 16px;
        border: solid 1px #3d4050;
        padding: 0 5px;
        border-radius: 5px;
      }
    }
  }
}
.stealing-coal-card.level-2 {
  background: url("../../../../assets/images/stealingcoal/card-warning-2-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #C76E29;
}
.stealing-coal-card.level-2 .stealing-coal-card-title {
  background: url("../../../../assets/images/stealingcoal/card-title-warning-2.png") no-repeat;
}
.stealing-coal-card.level-3 {
  color: #4682FA;
  background: url("../../../../assets/images/stealingcoal/card-warning-3-bg.png") no-repeat;
  background-size: 100% 100%;
}
.stealing-coal-card.level-3 .stealing-coal-card-title {
  background: url("../../../../assets/images/stealingcoal/card-title-warning-3.png") no-repeat;
  background-size: 100% 100%;
}
</style>
