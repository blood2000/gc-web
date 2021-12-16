<template>
  <div class="noneData">
    <img src="@/assets/images/icon/icon_null.png" alt="" />
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'noneData'
}
</script>

<style lang="scss" scoped>
.noneData {
  width: 64px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 64px;
    height: 64px;
  }
  p {
    font-size: 14px;
    color: #909398;
    text-align: center;
    margin-top: -5px;
  }
}
</style>
