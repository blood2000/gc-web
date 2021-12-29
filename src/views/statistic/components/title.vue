<template>
  <div class="title ly-flex">
    <span v-if="showAfter" class="after-text">{{ afterText }}</span>
    <div class="text">
      <slot />
    </div>
    <img class="title_line" src="~@/assets/images/statistic/title_line.gif" />
  </div>
</template>

<script>
export default {
  props: {
    showAfter: {
      type: Boolean,
      default: false
    },
    afterText: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.title{
  width: 100%;
  height: 1.95rem;
  position: relative;
  background: url('~@/assets/images/statistic/title_bg.png') no-repeat;
  background-size: 100% 100%;
  padding-left: 1.6rem;
  
  >.after-text{
    display: block;
    position: absolute;
    right: 0.7rem;
    top: 0;
    line-height: 1.9rem;
    font-size: 0.6rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(245, 154, 207, 0.7);
  }
  >.text{
    font-size: 0.7rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 1.9rem;
    >span{
      font-size: 0.6rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(245, 161, 208, 0.28);
      line-height: 22px;
      margin-left: 0.6rem;
    }
  }

  .title_line{
    position: absolute;
    bottom: -0.35rem;
    left: -0.5rem;
    width: 8.75rem;
    height: 0.75rem;
    opacity: 0.7;
  }
}
</style>
