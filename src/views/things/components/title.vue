<template>
  <div class="title ly-flex">
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {

  }
};
</script>

<style lang="scss" scoped>
.title{
  width: 100%;
  height: 1rem;
  position: relative;
  >.text{
    font-size: 0.8rem;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #999999;
    line-height: 1rem;
  }
}
</style>
