<template>
  <div class="app-wrapper" :style="{ '--current-color': theme }">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <!-- 头部标题 -->
    <navbar />
    <div class="app-wrapper__container" :class="classObj">
      <!-- 侧边导航栏 -->
      <sidebar
        class="sidebar-container"
        v-show="sideSecondRouters && sideSecondRouters.length > 1"
        :style="{
          backgroundColor:
            sideTheme === 'theme-dark'
              ? variables.menuBg
              : variables.menuLightBg,
        }"
      />
      <!-- <side-panel v-if="device !== 'mobile'" /> -->
      <!-- 内容 -->
      <div :class="{ hasTagsView: needTagsView }" class="main-container">
        <!-- 标签栏 -->
        <div
          v-show="sideSecondRouters && sideSecondRouters.length > 1"
          :class="{ 'fixed-header': fixedHeader }"
        >
          <tags-view v-if="needTagsView" />
        </div>
        <!-- 内容 -->
        <app-main />
        <!-- 工具栏 -->
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, TagsView } from "./components";
import { Sidebar } from "./components";
import SidePanel from "./components/SidePanel/index";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapGetters, mapState } from "vuex";
import variables from "@/assets/styles/variables.scss";

export default {
  name: "Layout",
  data() {
    return {
      goodsBigTypeConfig: {
        status: "0",
        dictPid: "0",
        dictType: "goodsType",
      },
      goodsTypeConfig: {
        status: "0",
        dictPid: "",
        dictType: "goodsType",
      },
    };
  },
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    SidePanel,
    TagsView,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters(["sideSecondRouters"]),

    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    variables() {
      return variables;
    },
  },
  mounted() {
    console.log("我是layout");
    this.getGoodsTypeList();
  },
  methods: {
    //获取级联形式大类小类
    async getGoodsTypeList() {
      const resBig = await this.getDicts(null, this.goodsBigTypeConfig);
      // console.log("resBig", resBig);
      if (resBig.code != "200") return;
      const bigList = resBig.data;
      const result = [];
      for (const item of bigList) {
        const bigObj = {};
        if (item.dictCode && item.dictLabel) {
          bigObj.value = item.dictCode;
          bigObj.label = item.dictLabel;
          bigObj.children = [];
          this.goodsTypeConfig.dictPid = item.dictCode;
          const res = await this.getDicts(null, this.goodsTypeConfig);
          // console.log("ressmall", res);
          if (res.code != "200") return;
          for (const el of res.data) {
            const obj = {};
            obj.value = el.dictValue;
            obj.label = el.dictLabel;
            bigObj.children.push(obj);
          }
          result.push(bigObj);
        }
      }
      this.$store.commit("set_goodsTypeList", result);
      console.log("set_goodsTypeList", result);
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  &__container {
    // 70: headerHeight
    flex: 1;
    height: 100%;
    display: flex;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: relative;
  z-index: 9;
  margin: 0 20px;
  height: 36px;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
