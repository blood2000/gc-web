<template>
  <div class="info-header">
    <div class="title-side-right"></div>
    <div class="titles">{{ title }}</div>
    <div class="title-line"></div>
  </div>
</template>

<script>
export default {
  name: "TitleSideBlueTip",
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
  padding:0 24px;
  .title-side-right {
    width: 4px;
    height: 14px;
    background: #4682fa;
    opacity: 1;
    border-radius: 2px;
    margin-right: 8px;
  }
  .titles {
    width: 56px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 15px;
    color: #262626;
    opacity: 1;
  }
  .title-line{
    flex: 1;
    margin-left: 15px;
    border: 1px dashed #DAD3D3;
    height: 0;
    line-height: 15px;
    position: relative;
    top: 7px;

  }
}
</style>