<template>
  <div class="monitor-card">
    <div class="monitor-card-title"><span>闽A54772</span></div>
    <div class="monitor-card-location">
      <span>当前位置 |</span>
      <span>东滨路1号富邦总部大楼大楼</span>
    </div>
    <div class="monitor-card-driver">
      <span>最新告警</span>
      <img src="@/assets/images/monitor-line.png" alt="" />
    </div>
    <div class="monitor-card-content">
      <img src="@/assets/images/tmpImage/monitor-tmp.png" alt="" />
      <div class="monitor-card-content-right"></div>
    </div>
    <div class="monitor-card-footer"></div>
  </div>
</template>
<script>
export default {

};
</script>

<style lang="scss" scoped>
.monitor-card {
  width: 376px;
  height:228px;
  background: #ffffff;
  border-radius: 6px;
  padding-top: 16px;
  box-sizing: border-box;
  &-title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #3D4050;
    padding-left: 16px;
    padding-right: 16px;
  }
  &-location {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #3d4050;
     padding-left: 16px;
    padding-right: 16px;
  }
  &-driver {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #adb5bd;
     margin-top: 10px;
     margin-bottom  : 15px;
      padding-left: 16px;
    padding-right: 16px;
    display: flex;

    & >span {
        padding-right: 2px;
    }
    &> img{
        width: 295px;
        height: 9px;
        // padding-left: 2px;
    }
  }
  &-content {
    height: 102px;
    display: flex;
    & > img {
      width: 68px;
      height: 68px;
    }
    &-right {
    }
  }
  &-footer {
  }
}
</style>