<template>
  <div class="info-header">
    <div class="title-side-right"></div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.info-header {
  display: flex;
  height: 40px;
  padding: 10px;
  .title-side-right {
    width: 3px;
    background: cornflowerblue;
    height: 100%;
    margin-right: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
  }
}
</style>