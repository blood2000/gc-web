<template>
  <section class="app-main" :class="showRecord ? 'hidden-x' : ''">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"  />
      </keep-alive>
    </transition>
    <!-- <div v-show="showRecord" class="foot-record-number">
      <p>福建至简至一信息科技有限公司 版权所有</p>
      <p>CopyRight@ 2021 All Rights Reserved <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2021009502号-4</a></p>
    </div> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',

  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
    // 工作台/地图不显示版本号
    showRecord() {
      const path = this.$route.path;
      return path !== '/index';
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  // 70: headerHeight
  // min-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  // overflow: hidden;
  background: #F0F2F5;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 70 + 49 */
    // min-height: calc(100vh - 119px);
  }
}

.fixed-header+.app-main{
  // height: calc(100vh - 119px);
  &.hidden-x{
    overflow-x: hidden;
  }
}

.app-main-content{
  min-height: calc(100% - 63px);
}

.foot-record-number{
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  color: #afafaf;
  padding: 0px 0 15px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 15px;
//   }
// }
</style>
